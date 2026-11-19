import * as local from "../storage/otros";
import { api, MODO_API } from "./http";

export async function listarCategorias() {
  return MODO_API ? api("/categorias") : local.listarCategorias();
}
export async function crearCategoria(nombre) {
  return MODO_API ? api("/categorias", { method: "POST", body: { nombre } }) : local.crearCategoria(nombre);
}
// Regiones, comunas y roles permanecen como catálogos estáticos locales;
// el Anexo 1 propone cinco tablas: usuario, boleta, detalle, producto y categoría.
export const listarRegiones = local.listarRegiones;
export const listarComunas = local.listarComunas;
export const listarRoles = local.listarRoles;
