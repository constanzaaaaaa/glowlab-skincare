import axiosClient from "./axiosClient";

export async function listarUsuarios() {
  const { data } = await axiosClient.get("/usuarios");
  return data;
}
export async function obtenerUsuario(run) {
  const { data } = await axiosClient.get("/usuarios/" + encodeURIComponent(run));
  return data;
}
export async function crearUsuario(usuario) {
  const { data } = await axiosClient.post("/usuarios", usuario);
  return data;
}
export async function actualizarUsuario(run, usuario) {
  const { data } = await axiosClient.put("/usuarios/" + encodeURIComponent(run), usuario);
  return data;
}
export async function eliminarUsuario(run) {
  await axiosClient.delete("/usuarios/" + encodeURIComponent(run));
}
