import * as local from "../storage/usuarios";
import { api, MODO_API } from "./http";
import { EVENTO_DATOS } from "../storage/persistencia";

export async function listarUsuarios() {
  return MODO_API ? api("/usuarios") : local.listarUsuarios();
}
export async function obtenerUsuario(run) {
  return MODO_API ? api("/usuarios/" + encodeURIComponent(run)) : local.obtenerUsuario(run);
}
export async function crearUsuario(datos) {
  return MODO_API ? api("/usuarios", { method: "POST", body: datos }) : local.crearUsuario(datos);
}
export async function actualizarUsuario(run, datos) {
  return MODO_API ? api("/usuarios/" + encodeURIComponent(run), { method: "PUT", body: datos }) : local.actualizarUsuario(run, datos);
}
export async function eliminarUsuario(run) {
  return MODO_API ? api("/usuarios/" + encodeURIComponent(run), { method: "DELETE" }) : local.eliminarUsuario(run);
}
export async function actualizarMiPerfil(datos) {
  if (!MODO_API) return local.actualizarMiPerfil(datos);
  const actualizado = await api("/auth/perfil", { method: "PUT", body: datos });
  window.dispatchEvent(new CustomEvent(EVENTO_DATOS, { detail: { tipo: "sesion" } }));
  return actualizado;
}
