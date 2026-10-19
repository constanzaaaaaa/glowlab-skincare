// Catálogos, blog y contacto: datos simulados para los componentes React.
import { obtenerColeccion, guardarColeccion } from "./persistencia";
import { fallar } from "./helpers";
import { textoRequerido, validarCorreo } from "../utils/validaciones";

export async function listarCategorias() { return obtenerColeccion("categorias"); }
export async function listarRegiones() { return obtenerColeccion("regiones"); }
export async function listarComunas(regionId) {
  return obtenerColeccion("comunas").filter((c) => !regionId || c.regionId === Number(regionId));
}
export async function listarRoles() { return obtenerColeccion("roles"); }

export async function listarNoticias() {
  return obtenerColeccion("blog").sort((a, b) => b.id - a.id);
}
export async function obtenerNoticia(id) {
  const noticia = obtenerColeccion("blog").find((n) => n.id === Number(id));
  return noticia || fallar("Noticia no encontrada.");
}

export async function enviarMensajeContacto(datos) {
  if (!textoRequerido(datos?.nombre, 100) || !validarCorreo(datos?.correo) ||
      !textoRequerido(datos?.mensaje, 3000)) fallar("Revisa los campos obligatorios del mensaje.");
  const contactos = obtenerColeccion("contactos");
  const mensaje = {
    id: contactos.reduce((maximo, c) => Math.max(maximo, c.id || 0), 0) + 1,
    nombre: datos.nombre.trim(), correo: datos.correo.trim(), mensaje: datos.mensaje.trim()
  };
  guardarColeccion("contactos", [...contactos, mensaje]);
  return { ok: true };
}
