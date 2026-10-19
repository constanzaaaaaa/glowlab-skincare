import { CLAVES, inicializarDatos, obtenerColeccion, guardarRunSesion } from "../src/storage/persistencia";
import { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } from "../src/storage/productos";

describe("GlowLab: persistencia JS y CRUD", () => {
  beforeEach(() => {
    Object.values(CLAVES).forEach((clave) => localStorage.removeItem(clave));
    inicializarDatos();
  });
  afterEach(() => Object.values(CLAVES).forEach((clave) => localStorage.removeItem(clave)));

  it("09 - crea y consulta productos", async () => {
    guardarRunSesion("123456785");
    const nuevo = { ...obtenerColeccion("productos")[0], codigo: "GL-TST", nombre: "Prueba" };
    await crearProducto(nuevo);
    expect((await obtenerProducto("GL-TST")).nombre).toBe("Prueba");
  });
  it("10 - edita y elimina productos", async () => {
    guardarRunSesion("123456785");
    const actual = { ...obtenerColeccion("productos")[0], nombre: "Nombre editado" };
    await actualizarProducto(actual.codigo, actual);
    expect((await obtenerProducto(actual.codigo)).nombre).toBe("Nombre editado");
    await eliminarProducto(actual.codigo);
    expect((await listarProductos()).some((p) => p.codigo === actual.codigo)).toBeFalse();
  });
});
