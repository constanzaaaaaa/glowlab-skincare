// Persistencia simulada del documento 040: JavaScript + localStorage.
// Los datos de esta versión React están separados de static/js/storage.js (Jinja).
import { ROLES, CATEGORIAS, REGIONES, COMUNAS, PRODUCTOS, USUARIOS, NOTICIAS } from "../data/datosIniciales";

export const CLAVES = Object.freeze({
  roles: "glowlab_react_roles_v1",
  categorias: "glowlab_react_categorias_v1",
  regiones: "glowlab_react_regiones_v1",
  comunas: "glowlab_react_comunas_v1",
  productos: "glowlab_react_productos_v1",
  usuarios: "glowlab_react_usuarios_v1",
  blog: "glowlab_react_blog_v1",
  carrito: "glowlab_react_carrito_v1",
  contactos: "glowlab_react_contactos_v1",
  sesion: "glowlab_react_sesion_v1"
});

const SEMILLAS = {
  roles: ROLES, categorias: CATEGORIAS, regiones: REGIONES, comunas: COMUNAS,
  productos: PRODUCTOS, usuarios: USUARIOS, blog: NOTICIAS, carrito: [], contactos: []
};
export const EVENTO_DATOS = "glowlab:datos";

function storage() {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("La demostración necesita un navegador con localStorage.");
  }
  return window.localStorage;
}

export function inicializarDatos() {
  for (const [tipo, valores] of Object.entries(SEMILLAS)) {
    if (storage().getItem(CLAVES[tipo]) === null) {
      storage().setItem(CLAVES[tipo], JSON.stringify(valores));
    }
  }
}

export function obtenerColeccion(tipo) {
  if (!Object.prototype.hasOwnProperty.call(SEMILLAS, tipo)) {
    throw new Error("Colección desconocida: " + tipo);
  }
  inicializarDatos();
  const datos = JSON.parse(storage().getItem(CLAVES[tipo]));
  if (!Array.isArray(datos)) throw new Error("Datos inválidos en la colección " + tipo);
  return datos;
}

export function guardarColeccion(tipo, datos) {
  if (!Object.prototype.hasOwnProperty.call(SEMILLAS, tipo) || !Array.isArray(datos)) {
    throw new Error("No se puede guardar la colección " + tipo);
  }
  storage().setItem(CLAVES[tipo], JSON.stringify(datos));
  window.dispatchEvent(new CustomEvent(EVENTO_DATOS, { detail: { tipo } }));
}

export function obtenerRunSesion() {
  const valor = storage().getItem(CLAVES.sesion);
  if (!valor) return null;
  try {
    const run = JSON.parse(valor);
    return typeof run === "string" ? run : null;
  } catch {
    return null;
  }
}

export function guardarRunSesion(run) {
  if (run) storage().setItem(CLAVES.sesion, JSON.stringify(run));
  else storage().removeItem(CLAVES.sesion);
  window.dispatchEvent(new CustomEvent(EVENTO_DATOS, { detail: { tipo: "sesion" } }));
}
