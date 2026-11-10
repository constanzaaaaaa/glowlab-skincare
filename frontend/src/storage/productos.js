// CRUD del catálogo sobre localStorage: documento 040 de la evaluación.
import { obtenerColeccion, guardarColeccion } from "./persistencia";
import { exigirAdmin, fallar } from "./helpers";
import { validarDatosProducto } from "../utils/validaciones";

function validar(datos, codigoEdicion) {
  const errores = validarDatosProducto(datos);
  if (codigoEdicion && datos?.codigo !== codigoEdicion) errores.push("No puedes cambiar el código de un producto existente.");
  if (datos?.categoriaId && !obtenerColeccion("categorias").some((c) => c.id === Number(datos.categoriaId))) {
    errores.push("La categoría seleccionada no existe.");
  }
  if (errores.length) fallar(errores.join("\n"));
}

function normalizar(datos) {
  return {
    codigo: datos.codigo.trim(), nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio), stock: Number(datos.stock), stockCritico: Number(datos.stockCritico),
    categoriaId: Number(datos.categoriaId), imagen: String(datos.imagen || "").trim(),
    estado: datos.estado || "Activo",
    ofertaTipo: datos.ofertaTipo || "ninguna",
    descuentoPorcentaje: datos.ofertaTipo === "porcentaje" ? Number(datos.descuentoPorcentaje) : 0
  };
}

export async function listarProductos({ search, categoriaId } = {}) {
  const texto = String(search || "").trim().toLowerCase();
  return obtenerColeccion("productos").filter((p) =>
    (!texto || p.nombre.toLowerCase().includes(texto)) &&
    (!categoriaId || p.categoriaId === Number(categoriaId))
  ).sort((a, b) => a.codigo.localeCompare(b.codigo));
}

export async function obtenerProducto(codigo) {
  return obtenerColeccion("productos").find((p) => p.codigo === codigo) || fallar("Producto no encontrado.");
}

export async function crearProducto(datos) {
  exigirAdmin();
  validar(datos);
  const productos = obtenerColeccion("productos");
  const producto = normalizar(datos);
  if (productos.some((p) => p.codigo === producto.codigo)) fallar("El código ya está registrado.");
  guardarColeccion("productos", [...productos, producto]);
  return producto;
}

export async function actualizarProducto(codigo, datos) {
  exigirAdmin();
  validar(datos, codigo);
  const productos = obtenerColeccion("productos");
  const indice = productos.findIndex((p) => p.codigo === codigo);
  if (indice === -1) fallar("Producto no encontrado.");
  const producto = normalizar(datos);
  productos[indice] = producto;
  guardarColeccion("productos", productos);
  return producto;
}

export async function eliminarProducto(codigo) {
  exigirAdmin();
  const productos = obtenerColeccion("productos");
  if (!productos.some((p) => p.codigo === codigo)) fallar("Producto no encontrado.");
  if (obtenerColeccion("carrito").some((i) => i.codigo === codigo)) {
    fallar("No puedes eliminar un producto que está en un carrito.");
  }
  guardarColeccion("productos", productos.filter((p) => p.codigo !== codigo));
}
