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
// Las ofertas se calculan siempre desde los datos vigentes del producto.
export function esProductoEnOferta(producto) {
  if (!producto || producto.estado !== "Activo") return false;
  if (producto.ofertaTipo === "2x1") return true;
  const porcentaje = Number(producto.descuentoPorcentaje);
  return producto.ofertaTipo === "porcentaje" && Number.isInteger(porcentaje) && porcentaje >= 1 && porcentaje <= 90;
}

export function etiquetaOferta(producto) {
  if (!esProductoEnOferta(producto)) return "";
  return producto.ofertaTipo === "2x1" ? "2x1" : "-" + producto.descuentoPorcentaje + "%";
}

// En 2x1, 2 unidades cuestan 1; 3 cuestan 2; 4 cuestan 2.
// En porcentaje, se redondea el precio final por unidad a pesos chilenos.
export function calcularTotalProducto(producto, cantidad = 1) {
  const unidades = Number(cantidad);
  const n = Number.isInteger(unidades) && unidades > 0 ? unidades : 0;
  const precio = Number(producto?.precio) || 0;
  const original = n * precio;
  let subtotal = original;
  if (esProductoEnOferta(producto)) {
    if (producto.ofertaTipo === "2x1") subtotal = Math.ceil(n / 2) * precio;
    if (producto.ofertaTipo === "porcentaje") {
      subtotal = n * Math.round(precio * (100 - Number(producto.descuentoPorcentaje)) / 100);
    }
  }
  return { original, subtotal, ahorro: original - subtotal };
}

export function totalCarrito(items) {
  return items.reduce((suma, item) => suma + calcularTotalProducto(item.producto, item.cantidad).subtotal, 0);
}
