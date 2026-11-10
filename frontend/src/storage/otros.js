// Catálogos, blog y contacto: datos simulados para los componentes React.
import { obtenerColeccion, guardarColeccion } from "./persistencia";
import { exigirAdmin, fallar } from "./helpers";
import { validarDatosContacto } from "../utils/validaciones";

export async function listarCategorias() { return obtenerColeccion("categorias"); }

export async function crearCategoria(nombre) {
  exigirAdmin();
  if (typeof nombre !== "string" || !nombre.trim()) fallar("Debes ingresar el nombre de la categoría.");
  const limpio = nombre.trim();
  if (limpio.length > 50) fallar("El nombre de la categoría no puede superar los 50 caracteres.");
  const categorias = obtenerColeccion("categorias");
  if (categorias.some((categoria) => categoria.nombre.trim().toLowerCase() === limpio.toLowerCase())) {
    fallar("Ya existe una categoría con ese nombre.");
  }
  const id = categorias.reduce((mayor, categoria) => Math.max(mayor, Number(categoria.id) || 0), 0) + 1;
  const nueva = { id, nombre: limpio };
  guardarColeccion("categorias", [...categorias, nueva]);
  return nueva;
}
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
  const errores = validarDatosContacto(datos);
  if (errores.length) fallar(errores.join("\n"));
  const contactos = obtenerColeccion("contactos");
  const mensaje = {
    id: contactos.reduce((maximo, c) => Math.max(maximo, c.id || 0), 0) + 1,
    nombre: datos.nombre.trim(), correo: datos.correo.trim(), mensaje: datos.mensaje.trim()
  };
  guardarColeccion("contactos", [...contactos, mensaje]);
  return { ok: true };
}
