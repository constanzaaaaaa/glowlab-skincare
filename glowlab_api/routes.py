"""Rutas /api alineadas con axiosClient del ejemplo 033 del profesor."""
from functools import wraps
from uuid import uuid4

from flask import Blueprint, jsonify, request, session
from sqlalchemy import func

from glowlab_api import db
from glowlab_api.models import CarritoItem, Contacto, Noticia, Producto, Usuario
from glowlab_api.seed import CATEGORIAS, COMUNAS, REGIONES, ROLES

api_bp = Blueprint("glowlab_api", __name__, url_prefix="/api")


def error(mensaje, status=400):
    return jsonify({"error": mensaje}), status


def actual():
    run = session.get("user_run")
    usuario = db.session.get(Usuario, run) if run else None
    return usuario if usuario and usuario.estado == "Activo" else None


def roles_requeridos(*roles):
    def decorar(funcion):
        @wraps(funcion)
        def protegida(*args, **kwargs):
            usuario = actual()
            if not usuario:
                return error("Debes iniciar sesión.", 401)
            if usuario.rol_id not in roles:
                return error("No tienes permisos para esta acción.", 403)
            return funcion(*args, **kwargs)
        return protegida
    return decorar


def cart_id():
    if not session.get("cart_id"):
        session["cart_id"] = str(uuid4())
    return session["cart_id"]


def validar_numero(valor, minimo=0):
    try:
        numero = int(valor)
        if str(numero) != str(valor) and not isinstance(valor, int):
            return None
        return numero if numero >= minimo else None
    except (TypeError, ValueError):
        return None


def datos_usuario(datos, usuario=None):
    campos = ("run", "nombre", "apellidos", "correo", "regionId", "comunaId", "direccion")
    if any(not str(datos.get(campo, "")).strip() for campo in campos):
        return "Faltan datos obligatorios del usuario."
    if datos.get("correo", "").lower().split("@")[-1] not in ("gmail.com", "duoc.cl", "profesor.duoc.cl"):
        return "El dominio del correo no está permitido."
    if len(str(datos["run"])) < 7 or len(str(datos["run"])) > 9:
        return "RUN inválido."
    if not usuario and not (4 <= len(str(datos.get("password", ""))) <= 10):
        return "La contraseña debe tener entre 4 y 10 caracteres."
    region_id = validar_numero(datos.get("regionId"), 1)
    comuna_id = validar_numero(datos.get("comunaId"), 1)
    if not any(region_id == r["id"] for r in REGIONES):
        return "La región no existe."
    if not any(comuna_id == c["id"] and region_id == c["regionId"] for c in COMUNAS):
        return "La comuna no pertenece a la región."
    return None


def asignar_usuario(usuario, datos, permitir_rol=False):
    usuario.nombre = datos["nombre"].strip()
    usuario.apellidos = datos["apellidos"].strip()
    usuario.correo = datos["correo"].strip().lower()
    usuario.fecha_nacimiento = datos.get("fechaNacimiento") or ""
    usuario.region_id = int(datos["regionId"])
    usuario.comuna_id = int(datos["comunaId"])
    usuario.direccion = datos["direccion"].strip()
    if datos.get("password"):
        usuario.set_password(datos["password"])
    if permitir_rol:
        usuario.rol_id = int(datos.get("rolId", 3))
        usuario.estado = datos.get("estado", "Activo")


def datos_producto(datos, codigo=None):
    if not str(datos.get("codigo", "")).strip() or not str(datos.get("nombre", "")).strip():
        return "El código y el nombre son obligatorios."
    if not str(datos.get("descripcion", "")).strip():
        return "La descripción es obligatoria."
    if len(str(datos["descripcion"])) > 800:
        return "La descripción no puede superar 800 caracteres."
    for campo in ("precio", "stock", "stockCritico"):
        if validar_numero(datos.get(campo)) is None:
            return campo + " debe ser un entero positivo o cero."
    if not any(c["id"] == validar_numero(datos.get("categoriaId"), 1) for c in CATEGORIAS):
        return "La categoría no existe."
    if codigo is not None and datos["codigo"] != codigo:
        return "No puedes cambiar el código del producto."
    return None


def asignar_producto(producto, datos):
    producto.nombre = datos["nombre"].strip()
    producto.descripcion = datos["descripcion"].strip()
    producto.precio = int(datos["precio"])
    producto.stock = int(datos["stock"])
    producto.stock_critico = int(datos["stockCritico"])
    producto.categoria_id = int(datos["categoriaId"])
    producto.imagen = (datos.get("imagen") or "").strip()
    producto.estado = datos.get("estado", "Activo")


@api_bp.get("/health")
def health():
    return jsonify({"status": "ok", "servicio": "GlowLab API"})


@api_bp.get("/categorias")
def categorias():
    return jsonify(CATEGORIAS)


@api_bp.get("/regiones")
def regiones():
    return jsonify(REGIONES)


@api_bp.get("/comunas")
def comunas():
    region = request.args.get("regionId")
    return jsonify([c for c in COMUNAS if not region or c["regionId"] == validar_numero(region, 1)])


@api_bp.get("/roles")
def roles():
    return jsonify(ROLES)


@api_bp.get("/productos")
def listar_productos():
    query = Producto.query
    texto = request.args.get("search")
    if texto:
        query = query.filter(Producto.nombre.ilike("%" + texto + "%"))
    categoria = request.args.get("categoriaId")
    if categoria:
        query = query.filter(Producto.categoria_id == categoria)
    return jsonify([p.to_dict() for p in query.order_by(Producto.codigo).all()])


@api_bp.get("/productos/<codigo>")
def obtener_producto(codigo):
    producto = db.session.get(Producto, codigo)
    return jsonify(producto.to_dict()) if producto else error("Producto no encontrado.", 404)


@api_bp.post("/productos")
@roles_requeridos(1)
def crear_producto():
    datos = request.get_json(silent=True) or {}
    mensaje = datos_producto(datos)
    if mensaje:
        return error(mensaje)
    codigo = datos["codigo"].strip()
    if db.session.get(Producto, codigo):
        return error("El código ya está registrado.", 409)
    producto = Producto(codigo=codigo)
    asignar_producto(producto, datos)
    db.session.add(producto)
    db.session.commit()
    return jsonify(producto.to_dict()), 201


@api_bp.put("/productos/<codigo>")
@roles_requeridos(1)
def actualizar_producto(codigo):
    producto = db.session.get(Producto, codigo)
    if not producto:
        return error("Producto no encontrado.", 404)
    datos = request.get_json(silent=True) or {}
    mensaje = datos_producto(datos, codigo)
    if mensaje:
        return error(mensaje)
    asignar_producto(producto, datos)
    db.session.commit()
    return jsonify(producto.to_dict())


@api_bp.delete("/productos/<codigo>")
@roles_requeridos(1)
def eliminar_producto(codigo):
    producto = db.session.get(Producto, codigo)
    if not producto:
        return error("Producto no encontrado.", 404)
    if CarritoItem.query.filter_by(producto_codigo=codigo).first():
        return error("No puedes eliminar un producto que está en un carrito.", 409)
    db.session.delete(producto)
    db.session.commit()
    return jsonify({"ok": True})


@api_bp.get("/auth/me")
def sesion_actual():
    usuario = actual()
    return jsonify({"usuario": usuario.to_dict() if usuario else None})


@api_bp.post("/auth/login")
def iniciar_sesion():
    datos = request.get_json(silent=True) or {}
    correo = str(datos.get("correo", "")).lower().strip()
    usuario = Usuario.query.filter(func.lower(Usuario.correo) == correo).first()
    if not usuario or not usuario.check_password(str(datos.get("password", ""))):
        return error("El correo o la contraseña no coinciden.", 401)
    if usuario.estado == "Inactivo":
        return error("La cuenta está inactiva.", 403)
    session["user_run"] = usuario.run
    return jsonify({"usuario": usuario.to_dict()})


@api_bp.post("/auth/logout")
def cerrar_sesion():
    session.pop("user_run", None)
    return jsonify({"ok": True})


@api_bp.post("/auth/registro")
def registrar():
    datos = request.get_json(silent=True) or {}
    mensaje = datos_usuario(datos)
    if mensaje:
        return error(mensaje)
    if db.session.get(Usuario, datos["run"].upper().strip()):
        return error("RUN ya registrado.", 409)
    if Usuario.query.filter(func.lower(Usuario.correo) == datos["correo"].lower().strip()).first():
        return error("Correo ya registrado.", 409)
    usuario = Usuario(run=datos["run"].upper().strip())
    asignar_usuario(usuario, datos)
    usuario.rol_id = 3
    usuario.estado = "Activo"
    db.session.add(usuario)
    db.session.commit()
    return jsonify({"usuario": usuario.to_dict()}), 201


@api_bp.get("/usuarios")
@roles_requeridos(1)
def listar_usuarios():
    return jsonify([u.to_dict() for u in Usuario.query.order_by(Usuario.nombre).all()])


@api_bp.get("/usuarios/<run>")
@roles_requeridos(1)
def obtener_usuario(run):
    usuario = db.session.get(Usuario, run)
    return jsonify(usuario.to_dict()) if usuario else error("Usuario no encontrado.", 404)


@api_bp.post("/usuarios")
@roles_requeridos(1)
def crear_usuario():
    datos = request.get_json(silent=True) or {}
    mensaje = datos_usuario(datos)
    if mensaje:
        return error(mensaje)
    if db.session.get(Usuario, datos["run"].upper().strip()):
        return error("RUN ya registrado.", 409)
    if Usuario.query.filter(func.lower(Usuario.correo) == datos["correo"].lower().strip()).first():
        return error("Correo ya registrado.", 409)
    usuario = Usuario(run=datos["run"].upper().strip())
    asignar_usuario(usuario, datos, permitir_rol=True)
    db.session.add(usuario)
    db.session.commit()
    return jsonify(usuario.to_dict()), 201


@api_bp.put("/usuarios/<run>")
@roles_requeridos(1)
def actualizar_usuario(run):
    usuario = db.session.get(Usuario, run)
    if not usuario:
        return error("Usuario no encontrado.", 404)
    datos = request.get_json(silent=True) or {}
    mensaje = datos_usuario(datos, usuario=usuario)
    if mensaje:
        return error(mensaje)
    if str(datos.get("run", "")).upper().strip() != run:
        return error("No puedes cambiar el RUN.")
    repetido = Usuario.query.filter(func.lower(Usuario.correo) == datos["correo"].lower().strip(), Usuario.run != run).first()
    if repetido:
        return error("Correo ya registrado.", 409)
    asignar_usuario(usuario, datos, permitir_rol=True)
    db.session.commit()
    return jsonify(usuario.to_dict())


@api_bp.delete("/usuarios/<run>")
@roles_requeridos(1)
def eliminar_usuario(run):
    if actual().run == run:
        return error("No puedes eliminar tu propia cuenta.")
    usuario = db.session.get(Usuario, run)
    if not usuario:
        return error("Usuario no encontrado.", 404)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"ok": True})


@api_bp.get("/blog")
def listar_blog():
    return jsonify([n.to_dict() for n in Noticia.query.order_by(Noticia.id.desc()).all()])


@api_bp.get("/blog/<int:id>")
def detalle_blog(id):
    noticia = db.session.get(Noticia, id)
    return jsonify(noticia.to_dict()) if noticia else error("Noticia no encontrada.", 404)


@api_bp.post("/contacto")
def contacto():
    datos = request.get_json(silent=True) or {}
    if not all(str(datos.get(campo, "")).strip() for campo in ("nombre", "correo", "mensaje")):
        return error("Debes completar todos los campos.")
    if len(str(datos["mensaje"])) > 3000:
        return error("El mensaje es demasiado largo.")
    db.session.add(Contacto(nombre=datos["nombre"].strip(), correo=datos["correo"].strip(), mensaje=datos["mensaje"].strip()))
    db.session.commit()
    return jsonify({"ok": True}), 201


@api_bp.get("/carrito")
def carrito():
    return jsonify([i.to_dict() for i in CarritoItem.query.filter_by(cart_id=cart_id()).all()])


@api_bp.post("/carrito")
def agregar_carrito():
    datos = request.get_json(silent=True) or {}
    codigo = datos.get("codigo")
    cantidad = validar_numero(datos.get("cantidad"), 1)
    producto = db.session.get(Producto, codigo)
    if not producto or producto.estado != "Activo":
        return error("Producto no disponible.", 404)
    if cantidad is None:
        return error("La cantidad debe ser un entero positivo.")
    item = CarritoItem.query.filter_by(cart_id=cart_id(), producto_codigo=codigo).first()
    cantidad_final = cantidad + (item.cantidad if item else 0)
    if cantidad_final > producto.stock:
        return error("Solo hay " + str(producto.stock) + " unidades disponibles.")
    if item:
        item.cantidad = cantidad_final
    else:
        item = CarritoItem(cart_id=cart_id(), producto_codigo=codigo, cantidad=cantidad_final)
        db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@api_bp.put("/carrito/<codigo>")
def cambiar_carrito(codigo):
    item = CarritoItem.query.filter_by(cart_id=cart_id(), producto_codigo=codigo).first()
    if not item:
        return error("No existe ese producto en el carrito.", 404)
    datos = request.get_json(silent=True) or {}
    cantidad = validar_numero(datos.get("cantidad"))
    if cantidad is None:
        return error("La cantidad debe ser un entero no negativo.")
    if cantidad == 0:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"eliminado": True})
    if cantidad > item.producto.stock:
        return error("Solo hay " + str(item.producto.stock) + " unidades disponibles.")
    item.cantidad = cantidad
    db.session.commit()
    return jsonify(item.to_dict())


@api_bp.delete("/carrito/<codigo>")
def eliminar_carrito(codigo):
    item = CarritoItem.query.filter_by(cart_id=cart_id(), producto_codigo=codigo).first()
    if item:
        db.session.delete(item)
        db.session.commit()
    return jsonify({"ok": True})


@api_bp.delete("/carrito")
def vaciar_carrito():
    CarritoItem.query.filter_by(cart_id=cart_id()).delete()
    db.session.commit()
    return jsonify({"ok": True})


@api_bp.post("/carrito/checkout")
def finalizar_compra():
    items = CarritoItem.query.filter_by(cart_id=cart_id()).all()
    if not items:
        return error("El carrito está vacío.")
    for item in items:
        if item.cantidad > item.producto.stock:
            return error("Stock insuficiente para " + item.producto.nombre)
    total = sum(item.cantidad * item.producto.precio for item in items)
    CarritoItem.query.filter_by(cart_id=cart_id()).delete()
    db.session.commit()
    return jsonify({"ok": True, "total": total, "simulada": True})
