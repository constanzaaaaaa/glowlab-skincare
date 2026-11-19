import * as local from "../storage/productos";
import { api, MODO_API } from "./http";

export async function listarProductos(filtros = {}) {
  if (!MODO_API) return local.listarProductos(filtros);
  const parametros = new URLSearchParams();
  if (filtros.search) parametros.set("search", filtros.search);
  if (filtros.categoriaId) parametros.set("categoriaId", filtros.categoriaId);
  return api("/productos" + (parametros.size ? "?" + parametros : ""));
}
export async function obtenerProducto(codigo) {
  return MODO_API ? api("/productos/" + encodeURIComponent(codigo)) : local.obtenerProducto(codigo);
}
export async function crearProducto(datos) {
  return MODO_API ? api("/productos", { method: "POST", body: datos }) : local.crearProducto(datos);
}
export async function actualizarProducto(codigo, datos) {
  return MODO_API ? api("/productos/" + encodeURIComponent(codigo), { method: "PUT", body: datos }) : local.actualizarProducto(codigo, datos);
}
export async function eliminarProducto(codigo) {
  return MODO_API ? api("/productos/" + encodeURIComponent(codigo), { method: "DELETE" }) : local.eliminarProducto(codigo);
}
