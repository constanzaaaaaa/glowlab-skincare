"""Prueba de integración real contra MySQL para el Control 3.
Ejecutar con el backend iniciado y con cuentas de prueba ADMIN_EMAIL / VENDEDOR_EMAIL.
Solo usa la biblioteca estándar de Python. No utiliza contraseñas de personas reales.
"""
import json
import os
from http.cookiejar import CookieJar
from urllib.error import HTTPError
from urllib.request import HTTPCookieProcessor, Request, build_opener

BASE = os.getenv("CONTROL3_API_URL", "http://127.0.0.1:8080/api/v1").rstrip("/")


class Cliente:
    def __init__(self):
        self.opener = build_opener(HTTPCookieProcessor(CookieJar()))

    def pedir(self, method, ruta, datos=None, esperado=None):
        cuerpo = json.dumps(datos).encode("utf-8") if datos is not None else None
        cabeceras = {"Accept": "application/json", "X-Requested-With": "XMLHttpRequest"}
        if cuerpo is not None:
            cabeceras["Content-Type"] = "application/json"
        request = Request(BASE + ruta, data=cuerpo, method=method, headers=cabeceras)
        try:
            with self.opener.open(request, timeout=15) as response:
                codigo, respuesta = response.status, response.read().decode()
        except HTTPError as error:
            codigo, respuesta = error.code, error.read().decode()
        if esperado is not None and codigo != esperado:
            raise AssertionError(f"{method} {ruta}: se esperaba {esperado}, recibí {codigo}: {respuesta[:500]}")
        return json.loads(respuesta) if respuesta else None

    def login(self, correo, clave):
        resultado = self.pedir("POST", "/auth/login",
                              {"correo": correo, "password": clave}, 200)
        assert resultado["usuario"]["correo"] == correo, "No se obtuvo el usuario esperado."


def main():
    publico = Cliente()
    catalogo = publico.pedir("GET", "/productos", esperado=200)
    assert len(catalogo) >= 8, "El catálogo inicial no se cargó en MySQL."
    original = next(p for p in catalogo if p["codigo"] == "GL-001")
    print(f"Catálogo conectado a MySQL: {len(catalogo)} productos.")

    admin = Cliente()
    admin.login(os.getenv("ADMIN_EMAIL", "admin@gmail.com"),
                os.getenv("ADMIN_PASSWORD", "ClavePruebaSoloCI2026"))
    assert admin.pedir("GET", "/auth/me", esperado=200)["rolId"] == 1

    # CRUD completo en una base MySQL real.
    categoria = admin.pedir("POST", "/categorias", {"nombre": "Kits verificación CI"}, 201)
    cid = categoria["id"]
    producto = {"codigo": "GL-CI", "nombre": "Kit de integración",
                "descripcion": "Producto de prueba de la API Spring con MySQL",
                "precio": 10000, "stock": 4, "stockCritico": 1,
                "categoriaId": cid, "estado": "Activo", "ofertaTipo": "ninguna"}
    admin.pedir("POST", "/productos", producto, 201)
    assert publico.pedir("GET", "/productos/GL-CI", esperado=200)["precio"] == 10000
    producto["precio"] = 12000
    admin.pedir("PUT", "/productos/GL-CI", producto, 200)
    assert publico.pedir("GET", "/productos/GL-CI", esperado=200)["precio"] == 12000
    admin.pedir("DELETE", "/productos/GL-CI", esperado=204)
    admin.pedir("DELETE", "/categorias/" + str(cid), esperado=204)
    print("CRUD de categorías y productos con MySQL: correcto.")

    vendedor = Cliente()
    vendedor.login(os.getenv("VENDEDOR_EMAIL", "vendedor@gmail.com"),
                   os.getenv("VENDEDOR_PASSWORD", "ClaveVendedorSoloCI2026"))
    assert vendedor.pedir("GET", "/auth/me", esperado=200)["rolId"] == 2
    vendedor.pedir("GET", "/productos/GL-001", esperado=200)
    vendedor.pedir("GET", "/boletas", esperado=200)
    vendedor.pedir("GET", "/usuarios", esperado=403)
    vendedor.pedir("DELETE", "/productos/GL-001", esperado=403)
    print("Vendedor: lectura permitida, escritura denegada.")

    cliente = Cliente()
    cliente.pedir("POST", "/auth/registro", {
        "run": "123123123", "nombre": "Ana", "apellidos": "Prueba",
        "correo": "compraci@gmail.com", "password": "ClaveSoloPruebas2026",
        "direccion": "Calle de prueba 123", "regionId": 1, "comunaId": 1
    }, 201)
    cliente.login("compraci@gmail.com", "ClaveSoloPruebas2026")
    assert cliente.pedir("GET", "/auth/me", esperado=200)["rolId"] == 3
    cliente.pedir("GET", "/usuarios", esperado=403)
    pedido = {"items": [{"codigo": "GL-001", "cantidad": 2}],
              "entrega": {"nombre": "Ana", "apellidos": "Prueba",
                          "correo": "compraci@gmail.com", "telefono": "912345678",
                          "direccion": "Calle de prueba 123",
                          "regionId": 1, "region": "Metropolitana",
                          "comunaId": 1, "comuna": "Santiago"}}
    respuesta = cliente.pedir("POST", "/boletas", pedido, 201)
    assert respuesta["total"] == original["precio"] * 2, "El backend no recalculó el total."
    assert respuesta["clienteRun"] == "123123123"
    actual = publico.pedir("GET", "/productos/GL-001", esperado=200)
    assert actual["stock"] == original["stock"] - 2, "No se descontó el stock MySQL."
    historico = cliente.pedir("GET", "/boletas/mis", esperado=200)
    assert any(x["id"] == respuesta["id"] for x in historico), "La compra no persistió."
    print("Compra, boleta, total y stock en MySQL: correctos.")

    # Rechazar venta sin stock sin alterar la BD.
    pedido["items"][0]["cantidad"] = 100000
    cliente.pedir("POST", "/boletas", pedido, esperado=409)
    assert publico.pedir("GET", "/productos/GL-001", esperado=200)["stock"] == original["stock"] - 2
    print("Rechazo de stock insuficiente y rollback: correcto.")


if __name__ == "__main__":
    main()
