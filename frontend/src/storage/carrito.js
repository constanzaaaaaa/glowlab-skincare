// Carrito persistente en localStorage; conserva los contratos de carritoApi.
import { obtenerColeccion, guardarColeccion } from "./persistencia";
import { fallar, numeroEntero } from "./helpers";
import { obtenerProducto } from "./productos";

function itemsConProducto() {
  const productos = obtenerColeccion("productos");
  return obtenerColeccion("carrito").flatMap((item) => {
    const producto = productos.find((p) => p.codigo === item.codigo);
    return producto ? [{ codigo: item.codigo, cantidad: item.cantidad, producto }] : [];
  });
}

export async function obtenerCarrito() { return itemsConProducto(); }

export async function agregarItemCarrito(codigo, cantidad = 1) {
  const producto = await obtenerProducto(codigo);
  if (producto.estado !== "Activo") fallar("Producto no disponible.");
  if (!numeroEntero(cantidad, 1)) fallar("La cantidad debe ser un entero positivo.");
  const carrito = obtenerColeccion("carrito");
  const item = carrito.find((i) => i.codigo === codigo);
  const siguiente = (item?.cantidad || 0) + Number(cantidad);
  if (siguiente > producto.stock) fallar("Solo hay " + producto.stock + " unidades disponibles.");
  if (item) item.cantidad = siguiente;
  else carrito.push({ codigo, cantidad: siguiente });
  guardarColeccion("carrito", carrito);
  return { codigo, cantidad: siguiente, producto };
}

export async function actualizarItemCarrito(codigo, cantidad) {
  if (!numeroEntero(cantidad)) fallar("La cantidad debe ser un entero no negativo.");
  const carrito = obtenerColeccion("carrito");
  const item = carrito.find((i) => i.codigo === codigo);
  if (!item) fallar("No existe ese producto en el carrito.");
  if (Number(cantidad) === 0) {
    guardarColeccion("carrito", carrito.filter((i) => i.codigo !== codigo));
    return { eliminado: true };
  }
  const producto = await obtenerProducto(codigo);
  if (Number(cantidad) > producto.stock) fallar("Solo hay " + producto.stock + " unidades disponibles.");
  item.cantidad = Number(cantidad);
  guardarColeccion("carrito", carrito);
  return { codigo, cantidad: item.cantidad, producto };
}

export async function eliminarItemCarrito(codigo) {
  guardarColeccion("carrito", obtenerColeccion("carrito").filter((i) => i.codigo !== codigo));
}

export async function vaciarCarritoApi() { guardarColeccion("carrito", []); }

export async function finalizarCompraApi() {
  const items = itemsConProducto();
  if (items.length === 0) fallar("El carrito está vacío.");
  for (const item of items) {
    if (item.producto.estado !== "Activo") fallar("Producto no disponible: " + item.producto.nombre);
    if (item.cantidad > item.producto.stock) fallar("Stock insuficiente para " + item.producto.nombre);
  }
  const total = items.reduce((suma, item) => suma + item.cantidad * item.producto.precio, 0);
  guardarColeccion("carrito", []);
  return { ok: true, total, simulada: true };
}
