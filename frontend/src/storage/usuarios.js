// CRUD de usuarios y sesión simulada para React (no hay servidor de autenticación).
import { obtenerColeccion, guardarColeccion, obtenerRunSesion, guardarRunSesion } from "./persistencia";
import { exigirAdmin, fallar, hashClave, sesionInterna, usuarioPublico } from "./helpers";
import { validarCorreo, validarPassword, validarRun, textoRequerido } from "../utils/validaciones";

function validar(datos, runAnterior) {
  if (!validarRun(datos?.run) || !textoRequerido(datos?.nombre, 50) ||
      !textoRequerido(datos?.apellidos, 100) || !validarCorreo(datos?.correo) ||
      !textoRequerido(datos?.direccion, 300)) fallar("Revisa los datos obligatorios del usuario.");
  if (runAnterior && datos.run.toUpperCase().trim() !== runAnterior) fallar("No puedes cambiar el RUN.");
  if ((!runAnterior || datos.password) && !validarPassword(datos.password)) {
    fallar("La contraseña debe tener entre 4 y 10 caracteres.");
  }
  const region = Number(datos.regionId), comuna = Number(datos.comunaId);
  if (!obtenerColeccion("regiones").some((r) => r.id === region)) fallar("La región no existe.");
  if (!obtenerColeccion("comunas").some((c) => c.id === comuna && c.regionId === region)) {
    fallar("La comuna no pertenece a la región.");
  }
}

async function normalizar(datos, anterior, esRegistro) {
  const run = datos.run.toUpperCase().trim();
  return {
    run, nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(),
    correo: datos.correo.trim().toLowerCase(),
    claveHash: datos.password ? await hashClave(run, datos.password) : anterior?.claveHash,
    fechaNacimiento: datos.fechaNacimiento || "",
    rolId: esRegistro ? 3 : Number(datos.rolId ?? 3),
    regionId: Number(datos.regionId), comunaId: Number(datos.comunaId),
    direccion: datos.direccion.trim(),
    estado: esRegistro ? "Activo" : (datos.estado || "Activo")
  };
}

function verificarDuplicados(datos, usuarios, runAnterior) {
  if (usuarios.some((u) => u.run === datos.run.toUpperCase().trim() && u.run !== runAnterior)) {
    fallar("RUN ya registrado.");
  }
  if (usuarios.some((u) => u.correo.toLowerCase() === datos.correo.trim().toLowerCase() && u.run !== runAnterior)) {
    fallar("Correo ya registrado.");
  }
}

async function crear(datos, esRegistro) {
  validar(datos);
  const usuarios = obtenerColeccion("usuarios");
  verificarDuplicados(datos, usuarios);
  const usuario = await normalizar(datos, null, esRegistro);
  if (![1, 2, 3].includes(usuario.rolId)) fallar("Rol inválido.");
  guardarColeccion("usuarios", [...usuarios, usuario]);
  return usuarioPublico(usuario);
}

export async function obtenerSesionActual() { return usuarioPublico(sesionInterna()); }

export async function iniciarSesion(correo, password) {
  const usuario = obtenerColeccion("usuarios").find((u) =>
    u.correo.toLowerCase() === String(correo || "").trim().toLowerCase());
  if (!usuario || usuario.claveHash !== await hashClave(usuario.run, password)) {
    fallar("El correo o la contraseña no coinciden.");
  }
  if (usuario.estado !== "Activo") fallar("La cuenta está inactiva.");
  guardarRunSesion(usuario.run);
  return usuarioPublico(usuario);
}

export async function cerrarSesionApi() { guardarRunSesion(null); }
export async function registrarUsuario(datos) { return crear(datos, true); }

export async function listarUsuarios() {
  exigirAdmin();
  return obtenerColeccion("usuarios").map(usuarioPublico).sort((a, b) => a.nombre.localeCompare(b.nombre));
}
export async function obtenerUsuario(run) {
  exigirAdmin();
  const usuario = obtenerColeccion("usuarios").find((u) => u.run === run);
  return usuario ? usuarioPublico(usuario) : fallar("Usuario no encontrado.");
}
export async function crearUsuario(datos) {
  exigirAdmin();
  return crear(datos, false);
}
export async function actualizarUsuario(run, datos) {
  exigirAdmin();
  validar(datos, run);
  const usuarios = obtenerColeccion("usuarios");
  const indice = usuarios.findIndex((u) => u.run === run);
  if (indice < 0) fallar("Usuario no encontrado.");
  verificarDuplicados(datos, usuarios, run);
  const usuario = await normalizar(datos, usuarios[indice], false);
  if (![1, 2, 3].includes(usuario.rolId)) fallar("Rol inválido.");
  usuarios[indice] = usuario;
  guardarColeccion("usuarios", usuarios);
  return usuarioPublico(usuario);
}
export async function eliminarUsuario(run) {
  exigirAdmin();
  if (obtenerRunSesion() === run) fallar("No puedes eliminar tu propia cuenta.");
  const usuarios = obtenerColeccion("usuarios");
  if (!usuarios.some((u) => u.run === run)) fallar("Usuario no encontrado.");
  guardarColeccion("usuarios", usuarios.filter((u) => u.run !== run));
}
