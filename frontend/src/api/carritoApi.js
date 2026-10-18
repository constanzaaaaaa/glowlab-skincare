import axiosClient from "./axiosClient";

export async function obtenerCarrito() {
  const { data } = await axiosClient.get("/carrito");
  return data;
}
export async function agregarItemCarrito(codigo, cantidad = 1) {
  const { data } = await axiosClient.post("/carrito", { codigo, cantidad });
  return data;
}
export async function actualizarItemCarrito(codigo, cantidad) {
  const { data } = await axiosClient.put("/carrito/" + encodeURIComponent(codigo), { cantidad });
  return data;
}
export async function eliminarItemCarrito(codigo) {
  await axiosClient.delete("/carrito/" + encodeURIComponent(codigo));
}
export async function vaciarCarritoApi() {
  await axiosClient.delete("/carrito");
}
export async function finalizarCompraApi() {
  const { data } = await axiosClient.post("/carrito/checkout");
  return data;
}
