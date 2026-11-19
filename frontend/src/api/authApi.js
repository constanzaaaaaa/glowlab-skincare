import * as local from "../storage/usuarios";
import { api, MODO_API } from "./http";

export async function obtenerSesionActual() {
  if (!MODO_API) return local.obtenerSesionActual();
  try { return await api("/auth/me"); }
  catch (error) {
    if (error.status === 401) return null;
    throw error;
  }
}
export async function iniciarSesion(correo, password) {
  if (!MODO_API) return local.iniciarSesion(correo, password);
  const respuesta = await api("/auth/login", { method: "POST", body: { correo, password } });
  return respuesta.usuario;
}
export async function cerrarSesionApi() {
  if (!MODO_API) return local.cerrarSesionApi();
  return api("/auth/logout", { method: "POST" });
}
export async function registrarUsuario(datos) {
  if (!MODO_API) return local.registrarUsuario(datos);
  return api("/auth/registro", { method: "POST", body: datos });
}
