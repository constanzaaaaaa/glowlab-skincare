import axiosClient from "./axiosClient";

export async function listarNoticias() {
  const { data } = await axiosClient.get("/blog");
  return data;
}
export async function obtenerNoticia(id) {
  const { data } = await axiosClient.get("/blog/" + encodeURIComponent(id));
  return data;
}
