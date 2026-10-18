import axiosClient from "./axiosClient";

export async function listarProductos({ search, categoriaId } = {}) {
  const { data } = await axiosClient.get("/productos", { params: { search, categoriaId } });
  return data;
}
export async function obtenerProducto(codigo) {
  const { data } = await axiosClient.get("/productos/" + encodeURIComponent(codigo));
  return data;
}
export async function crearProducto(producto) {
  const { data } = await axiosClient.post("/productos", producto);
  return data;
}
export async function actualizarProducto(codigo, producto) {
  const { data } = await axiosClient.put("/productos/" + encodeURIComponent(codigo), producto);
  return data;
}
export async function eliminarProducto(codigo) {
  await axiosClient.delete("/productos/" + encodeURIComponent(codigo));
}
