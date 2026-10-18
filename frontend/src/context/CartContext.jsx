import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { actualizarItemCarrito, agregarItemCarrito, eliminarItemCarrito, finalizarCompraApi, obtenerCarrito, vaciarCarritoApi } from "../api/carritoApi";
import { confirmarAccion, mostrarExito } from "../utils/swal";
import { totalCarrito } from "../utils/format";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    const datos = await obtenerCarrito();
    setItems(datos);
    return datos;
  }, []);

  useEffect(() => {
    recargar().catch(() => setItems([])).finally(() => setCargando(false));
  }, [recargar]);

  const agregar = useCallback(async (codigo, cantidad, nombreProducto) => {
    await agregarItemCarrito(codigo, cantidad);
    await recargar();
    await mostrarExito("Agregado", nombreProducto + " se añadió al carrito.");
  }, [recargar]);

  const cambiarCantidad = useCallback(async (codigo, cantidad) => {
    await actualizarItemCarrito(codigo, cantidad);
    await recargar();
  }, [recargar]);

  const eliminar = useCallback(async (codigo) => {
    if (!await confirmarAccion({ titulo: "¿Eliminar producto?", texto: "Se quitará del carrito.", confirmButtonText: "Eliminar" })) return;
    await eliminarItemCarrito(codigo);
    await recargar();
  }, [recargar]);

  const vaciar = useCallback(async () => {
    await vaciarCarritoApi();
    await recargar();
  }, [recargar]);

  const finalizarCompra = useCallback(async () => {
    if (items.length === 0) return;
    if (!await confirmarAccion({
      titulo: "Confirmar compra",
      texto: "Total a pagar: $" + totalCarrito(items).toLocaleString("es-CL"),
      confirmButtonText: "Confirmar",
      icon: "question"
    })) return;
    await finalizarCompraApi();
    await recargar();
    await mostrarExito("Gracias por tu compra", "Tu pedido fue registrado correctamente (simulación académica).");
  }, [items, recargar]);

  const totalItems = useMemo(() => items.reduce((suma, item) => suma + item.cantidad, 0), [items]);
  const total = useMemo(() => totalCarrito(items), [items]);
  const valor = useMemo(() => ({ items, cargando, totalItems, total, agregar, cambiarCantidad, eliminar, vaciar, finalizarCompra, recargar }), [items, cargando, totalItems, total, agregar, cambiarCantidad, eliminar, vaciar, finalizarCompra, recargar]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}
