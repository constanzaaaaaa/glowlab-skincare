import axiosClient from "./axiosClient";

export async function obtenerSesionActual() {
  const { data } = await axiosClient.get("/auth/me");
  return data.usuario;
}
export async function iniciarSesion(correo, password) {
  const { data } = await axiosClient.post("/auth/login", { correo, password });
  return data.usuario;
}
export async function cerrarSesionApi() {
  await axiosClient.post("/auth/logout");
}
export async function registrarUsuario(datos) {
  const { data } = await axiosClient.post("/auth/registro", datos);
  return data.usuario;
}
