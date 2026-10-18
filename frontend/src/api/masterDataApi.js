import axiosClient from "./axiosClient";

export async function listarCategorias() {
  const { data } = await axiosClient.get("/categorias");
  return data;
}
export async function listarRegiones() {
  const { data } = await axiosClient.get("/regiones");
  return data;
}
export async function listarComunas(regionId) {
  const { data } = await axiosClient.get("/comunas", { params: { regionId } });
  return data;
}
export async function listarRoles() {
  const { data } = await axiosClient.get("/roles");
  return data;
}
