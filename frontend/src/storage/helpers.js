// Funciones compartidas de la persistencia simulada.
// El hash evita guardar contraseñas legibles, pero NO sustituye un backend seguro.
import { obtenerColeccion, obtenerRunSesion, guardarRunSesion } from "./persistencia";
import { enteroEnRango } from "../utils/validaciones";

export function fallar(mensaje) { throw new Error(mensaje); }

export function usuarioPublico(usuario) {
  if (!usuario) return null;
  const { claveHash, ...publico } = usuario;
  return publico;
}

export function sesionInterna() {
  const run = obtenerRunSesion();
  if (!run) return null;
  const usuario = obtenerColeccion("usuarios").find((u) => u.run === run && u.estado === "Activo");
  if (!usuario) guardarRunSesion(null);
  return usuario || null;
}

export function exigirAdmin() {
  if (sesionInterna()?.rolId !== 1) fallar("No tienes permisos para esta acción.");
}

export function numeroEntero(valor, minimo = 0) {
  return valor !== "" && valor !== null && valor !== undefined &&
    /^\d+$/.test(String(valor)) && enteroEnRango(valor, minimo);
}

// Hash con sal asociada al RUN; uso local únicamente para el proyecto académico.
export async function hashClave(run, clave) {
  const datos = new TextEncoder().encode("glowlab-demo:" + run + ":" + clave);
  const hash = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(hash), (n) => n.toString(16).padStart(2, "0")).join("");
}
