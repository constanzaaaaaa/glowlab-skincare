// Carrito persistente en localStorage; conserva los contratos de carritoApi.
import { obtenerColeccion, guardarColeccion } from "./persistencia";
import { fallar, numeroEntero, sesionInterna } from "./helpers";
import { obtenerProducto } from "./productos";
import { calcularTotalProducto, etiquetaOferta } from "../utils/format";

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

// Registra una orden con el precio y nombre de cada producto al momento de comprar.
export async function finalizarCompraApi() {
  const usuario = sesionInterna();
  if (!usuario) fallar("Inicia sesión para confirmar la compra y guardar tu historial.");

  const carrito = obtenerColeccion("carrito");
  if (carrito.length === 0) fallar("El carrito está vacío.");
  const productos = obtenerColeccion("productos");
  const detalles = carrito.map(({ codigo, cantidad }) => {
    const producto = productos.find((p) => p.codigo === codigo);
    if (!producto || producto.estado !== "Activo") fallar("Producto no disponible: " + codigo);
    if (!numeroEntero(cantidad, 1) || Number(cantidad) > producto.stock) {
      fallar("Stock insuficiente para " + producto.nombre);
    }
    const calculo = calcularTotalProducto(producto, cantidad);
    return {
      codigo, nombre: producto.nombre, cantidad: Number(cantidad),
      precioUnitario: producto.precio, subtotal: calculo.subtotal,
      oferta: etiquetaOferta(producto), descuento: calculo.ahorro
    };
  });

  const pedidos = obtenerColeccion("pedidos");
  const numero = pedidos.reduce((mayor, p) => {
    const n = Number(String(p.id).replace(/^PED-/, ""));
    return Number.isInteger(n) ? Math.max(mayor, n) : mayor;
  }, 0) + 1;
  const pedido = {
    id: "PED-" + String(numero).padStart(5, "0"),
    fecha: new Date().toISOString(),
    clienteRun: usuario.run,
    clienteNombre: usuario.nombre + " " + usuario.apellidos,
    items: detalles,
    unidades: detalles.reduce((suma, item) => suma + item.cantidad, 0),
    total: detalles.reduce((suma, item) => suma + item.subtotal, 0),
    estado: "Confirmado (simulado)"
  };

  // localStorage solo simula persistencia: no hay cobro ni transacción bancaria.
  guardarColeccion("pedidos", [...pedidos, pedido]);
  guardarColeccion("productos", productos.map((producto) => {
    const comprado = detalles.find((item) => item.codigo === producto.codigo);
    return comprado ? { ...producto, stock: producto.stock - comprado.cantidad } : producto;
  }));
  guardarColeccion("carrito", []);
  return { ...pedido, ok: true, simulada: true };
}
