// CRUD del catálogo sobre localStorage: documento 040 de la evaluación.
import { obtenerColeccion, guardarColeccion } from "./persistencia";
import { exigirAdmin, fallar, numeroEntero } from "./helpers";
import { textoRequerido } from "../utils/validaciones";

function validar(datos, codigoEdicion) {
  if (!textoRequerido(datos?.codigo, 20) || !textoRequerido(datos?.nombre, 100) ||
      !textoRequerido(datos?.descripcion, 800)) fallar("Completa los datos obligatorios del producto.");
  if (codigoEdicion && datos.codigo !== codigoEdicion) fallar("No puedes cambiar el código del producto.");
  if (!["precio", "stock", "stockCritico"].every((campo) => numeroEntero(datos[campo]))) {
    fallar("Precio, stock y stock crítico deben ser enteros no negativos.");
  }
  if (!obtenerColeccion("categorias").some((c) => c.id === Number(datos.categoriaId))) {
    fallar("La categoría no existe.");
  }
  if (!["Activo", "Inactivo"].includes(datos.estado || "Activo")) fallar("Estado de producto inválido.");
}

function normalizar(datos) {
  return {
    codigo: datos.codigo.trim(), nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio), stock: Number(datos.stock), stockCritico: Number(datos.stockCritico),
    categoriaId: Number(datos.categoriaId), imagen: String(datos.imagen || "").trim(),
    estado: datos.estado || "Activo"
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
