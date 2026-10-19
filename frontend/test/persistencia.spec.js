import { CLAVES, inicializarDatos, obtenerColeccion, guardarColeccion, guardarRunSesion } from "../src/storage/persistencia";
import { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } from "../src/storage/productos";
import { listarUsuarios, obtenerSesionActual, obtenerUsuario, actualizarUsuario, eliminarUsuario } from "../src/storage/usuarios";
import { agregarItemCarrito, actualizarItemCarrito, obtenerCarrito, finalizarCompraApi } from "../src/storage/carrito";
import { enviarMensajeContacto, listarCategorias } from "../src/storage/otros";

describe("GlowLab: persistencia JS y CRUD", () => {
  beforeEach(() => {
    Object.values(CLAVES).forEach((clave) => localStorage.removeItem(clave));
    inicializarDatos();
  });
  afterEach(() => Object.values(CLAVES).forEach((clave) => localStorage.removeItem(clave)));

  it("26 - inicializa colecciones de datos", async () => {
    expect(obtenerColeccion("productos").length).toBe(8);
    expect((await listarCategorias()).length).toBe(7);
  });
  it("27 - conserva las modificaciones al volver a inicializar", () => {
    guardarColeccion("contactos", [{ id: 1, mensaje: "Guardado" }]);
    inicializarDatos();
    expect(obtenerColeccion("contactos")[0].mensaje).toBe("Guardado");
  });
  it("28 - crea y consulta productos", async () => {
    guardarRunSesion("123456785");
    const nuevo = { ...obtenerColeccion("productos")[0], codigo: "GL-TST", nombre: "Prueba" };
    await crearProducto(nuevo);
    expect((await obtenerProducto("GL-TST")).nombre).toBe("Prueba");
  });
  it("29 - edita y elimina productos", async () => {
    guardarRunSesion("123456785");
    const actual = { ...obtenerColeccion("productos")[0], nombre: "Nombre editado" };
    await actualizarProducto(actual.codigo, actual);
    expect((await obtenerProducto(actual.codigo)).nombre).toBe("Nombre editado");
    await eliminarProducto(actual.codigo);
    expect((await listarProductos()).some((p) => p.codigo === actual.codigo)).toBeFalse();
  });
  it("30 - rechaza un código de producto duplicado", async () => {
    guardarRunSesion("123456785");
    await expectAsync(crearProducto(obtenerColeccion("productos")[0])).toBeRejectedWithError(/registrado/);
  });
  it("31 - impide cambios sin permisos de administrador", async () => {
    await expectAsync(eliminarProducto("GL-001")).toBeRejectedWithError(/permisos/);
  });
  it("32 - conserva el carrito y valida los límites de stock", async () => {
    await agregarItemCarrito("GL-001", 2);
    await actualizarItemCarrito("GL-001", 3);
    expect((await obtenerCarrito())[0].cantidad).toBe(3);
    expect(obtenerColeccion("carrito")[0].cantidad).toBe(3);
    await expectAsync(agregarItemCarrito("GL-001", 99)).toBeRejectedWithError(/unidades disponibles/);
  });
  it("33 - finaliza una compra simulada y vacía el carrito", async () => {
    await agregarItemCarrito("GL-001", 2);
    const resultado = await finalizarCompraApi();
    expect(resultado.total).toBe(31980);
    expect(await obtenerCarrito()).toEqual([]);
  });
  it("34 - edita y elimina usuarios sin exponer hashes", async () => {
    guardarRunSesion("123456785");
    expect((await obtenerSesionActual()).rolId).toBe(1);
    const usuario = await obtenerUsuario("112223339");
    await actualizarUsuario(usuario.run, { ...usuario, nombre: "Nombre editado" });
    expect((await obtenerUsuario(usuario.run)).nombre).toBe("Nombre editado");
    await eliminarUsuario(usuario.run);
    const usuarios = await listarUsuarios();
    expect(usuarios.length).toBe(3);
    expect(usuarios.some((u) => u.run === usuario.run)).toBeFalse();
    expect(usuarios[0].claveHash).toBeUndefined();
  });
  it("35 - almacena mensajes de contacto", async () => {
    await enviarMensajeContacto({ nombre: "Persona", correo: "persona@gmail.com", mensaje: "Consulta" });
    expect(obtenerColeccion("contactos").length).toBe(1);
  });
});
