export function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}
export function stockDisponible(producto) {
  return producto && producto.estado === "Activo" && Number(producto.stock) > 0;
}
export function filtrarProductos(productos, texto = "", categoriaId = "") {
  const q = texto.trim().toLowerCase();
  return productos.filter((producto) =>
    producto.estado === "Activo" &&
    (!q || producto.nombre.toLowerCase().includes(q)) &&
    (!categoriaId || Number(producto.categoriaId) === Number(categoriaId))
  );
}
export function totalCarrito(items) {
  return items.reduce((suma, item) => suma + Number(item.cantidad) * Number(item.producto.precio), 0);
}
