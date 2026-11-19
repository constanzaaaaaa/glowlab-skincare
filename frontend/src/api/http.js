// Integración REST del Control 3. En la rama anterior se conservó localStorage.
// Vite selecciona el backend al definir VITE_API_BASE_URL=http://localhost:8080.
const BASE = (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const MODO_API = Boolean(BASE);

async function peticion(ruta, opciones = {}) {
  const metodo = opciones.method || "GET";
  const respuesta = await fetch(BASE + "/api/v1" + ruta, {
    credentials: "include",
    method: metodo,
    headers: {
      Accept: "application/json",
      ...(opciones.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(["POST", "PUT", "PATCH", "DELETE"].includes(metodo) ? { "X-Requested-With": "XMLHttpRequest" } : {})
    },
    ...(opciones.body !== undefined ? { body: JSON.stringify(opciones.body) } : {})
  });
  const texto = await respuesta.text();
  let datos = null;
  if (texto) {
    try { datos = JSON.parse(texto); } catch { datos = { message: texto.slice(0, 250) }; }
  }
  if (!respuesta.ok) {
    const error = new Error(datos?.message || datos?.detail || "Error HTTP " + respuesta.status);
    error.status = respuesta.status;
    throw error;
  }
  return datos;
}

export async function api(ruta, opciones = {}) {
  if (!MODO_API) throw new Error("No se configuró VITE_API_BASE_URL para conectar el backend.");
  try {
    return await peticion(ruta, opciones);
  } catch (error) {
    const noRenovar = ["/auth/login", "/auth/registro", "/auth/refresh", "/auth/logout"].includes(ruta);
    if (error.status !== 401 || noRenovar) throw error;
    try {
      await peticion("/auth/refresh", { method: "POST" });
    } catch {
      throw error;
    }
    return peticion(ruta, opciones);
  }
}
