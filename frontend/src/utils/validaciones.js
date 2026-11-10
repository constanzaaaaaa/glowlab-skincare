// Reglas únicas para formularios React y funciones CRUD de localStorage.
// Correo institucional Duoc UC: @duocuc.cl. Los formularios no dependen de la validación nativa de HTML.
export const DOMINIOS_CORREO_VALIDOS = ["gmail.com", "duocuc.cl"];

export function obtenerErrorCorreo(correo) {
  if (typeof correo !== "string" || !correo.trim()) return "Debes ingresar tu correo electrónico.";
  const valor = correo.trim();
  if (valor.length > 100) return "El correo electrónico no puede superar los 100 caracteres.";
  if (/\s/.test(valor)) return "El correo electrónico no puede contener espacios.";
  const partes = valor.split("@");
  if (partes.length !== 2 || !partes[0] || !partes[1]) {
    return "El correo debe tener un usuario y un solo @, por ejemplo: nombre@gmail.com.";
  }
  const [usuario, dominio] = partes;
  if (!/^[a-z\d](?:[a-z\d._%+\-]*[a-z\d])?$/i.test(usuario) || usuario.includes("..")) {
    return "La parte anterior al @ tiene caracteres inválidos o puntos consecutivos.";
  }
  if (!DOMINIOS_CORREO_VALIDOS.includes(dominio.toLowerCase())) {
    return "El correo debe terminar exactamente en @gmail.com o @duocuc.cl.";
  }
  return null;
}

export function validarCorreo(correo) { return obtenerErrorCorreo(correo) === null; }

export function obtenerErrorPassword(password, opcional = false) {
  if (opcional && (password === "" || password === undefined || password === null)) return null;
  if (typeof password !== "string" || !password.length) return "Debes ingresar una contraseña.";
  if (password.trim().length === 0) return "La contraseña no puede contener solamente espacios.";
  if (password.length < 4 || password.length > 10) {
    return "La contraseña debe tener entre 4 y 10 caracteres (actualmente tiene " + password.length + ").";
  }
  return null;
}
export function validarPassword(password) { return obtenerErrorPassword(password) === null; }

export function calcularDigitoVerificador(cuerpo) {
  if (!/^\d{6,8}$/.test(String(cuerpo))) return null;
  let suma = 0;
  let multiplicador = 2;
  for (let i = String(cuerpo).length - 1; i >= 0; i--) {
    suma += Number(String(cuerpo)[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  return resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
}

export function obtenerErrorRun(valor) {
  if (typeof valor !== "string" || !valor.trim()) {
    return "Debes ingresar el RUN completo, incluidos todos sus números y el dígito verificador.";
  }
  const run = valor.trim().toUpperCase();
  if (/[.\-]/.test(run)) {
    return "El RUN está incompleto o tiene un formato incorrecto. Escríbelo sin puntos ni guion.";
  }
  if (/^\d{1,8}$/.test(run)) {
    return "El RUN está incompleto: debe incluir todos sus números y el dígito verificador.";
  }
  if (!/^\d{6,8}[0-9K]$/.test(run)) {
    return "El formato del RUN no es válido. Debe contener entre 6 y 8 números y un dígito verificador (0-9 o K).";
  }
  const esperado = calcularDigitoVerificador(run.slice(0, -1));
  if (run.at(-1) !== esperado) {
    return "El RUN ingresado no es válido. Revisa que el número y el dígito verificador estén correctos.";
  }
  return null;
}
export function validarRun(valor) { return obtenerErrorRun(valor) === null; }

export function textoRequerido(valor, maximo) {
  return typeof valor === "string" && valor.trim().length > 0 &&
    (!maximo || valor.trim().length <= maximo);
}
export function enteroEnRango(valor, minimo) {
  return valor !== "" && valor !== null && valor !== undefined &&
    /^\d+$/.test(String(valor)) && Number.isSafeInteger(Number(valor)) && Number(valor) >= minimo;
}

function errorTexto(valor, etiqueta, maximo, obligatorio = true) {
  if (typeof valor !== "string" || !valor.trim()) {
    return obligatorio ? "Debes completar el campo " + etiqueta + "." : null;
  }
  if (valor.trim().length > maximo) {
    return etiqueta + " no puede superar " + maximo + " caracteres.";
  }
  return null;
}
function agregar(lista, error) { if (error) lista.push(error); }

function errorFecha(fecha) {
  if (!fecha) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return "La fecha de nacimiento debe tener un formato válido.";
  const d = new Date(fecha + "T12:00:00");
  if (Number.isNaN(d.getTime()) || d.getFullYear() !== Number(fecha.slice(0, 4)) ||
      d.getMonth() + 1 !== Number(fecha.slice(5, 7)) || d.getDate() !== Number(fecha.slice(8, 10))) {
    return "La fecha de nacimiento indicada no existe en el calendario.";
  }
  if (d.getTime() > Date.now()) return "La fecha de nacimiento no puede ser posterior a hoy.";
  return null;
}

export function validarDatosUsuario(datos, { edicion = false, administrador = false, omitirPassword = false } = {}) {
  const errores = [];
  agregar(errores, obtenerErrorRun(datos?.run));
  agregar(errores, errorTexto(datos?.nombre, "Nombre", 50));
  agregar(errores, errorTexto(datos?.apellidos, "Apellidos", 100));
  agregar(errores, obtenerErrorCorreo(datos?.correo));
  if (!omitirPassword) agregar(errores, obtenerErrorPassword(datos?.password, edicion));
  agregar(errores, errorFecha(datos?.fechaNacimiento));
  agregar(errores, errorTexto(datos?.direccion, "Dirección", 300));
  if (!datos?.regionId || !/^\d+$/.test(String(datos.regionId))) {
    errores.push("Debes seleccionar una región.");
  }
  if (!datos?.comunaId || !/^\d+$/.test(String(datos.comunaId))) {
    errores.push("Debes seleccionar una comuna de la región elegida.");
  }
  if (administrador) {
    if (![1, 2, 3].includes(Number(datos?.rolId))) errores.push("Debes seleccionar un rol válido.");
    if (!["Activo", "Inactivo"].includes(datos?.estado)) errores.push("El estado del usuario debe ser Activo o Inactivo.");
  }
  return errores;
}

function errorEntero(valor, nombre, minimo = 0) {
  if (valor === "" || valor === null || valor === undefined) return "Debes ingresar " + nombre + ".";
  if (!enteroEnRango(valor, minimo)) {
    return nombre + " debe ser un número entero " + (minimo === 0 ? "igual o mayor que 0" : "igual o mayor que " + minimo) + ".";
  }
  return null;
}

export function validarDatosProducto(datos) {
  const errores = [];
  agregar(errores, errorTexto(datos?.codigo, "Código", 20));
  agregar(errores, errorTexto(datos?.nombre, "Nombre del producto", 100));
  agregar(errores, errorTexto(datos?.descripcion, "Descripción", 800));
  agregar(errores, datos?.precio === "" || datos?.precio === null || datos?.precio === undefined
    ? "Debes ingresar el precio del producto."
    : (!enteroEnRango(datos.precio, 1) ? "El precio debe ser un número entero mayor que 0." : null));
  agregar(errores, errorEntero(datos?.stock, "El stock", 0));
  agregar(errores, errorEntero(datos?.stockCritico, "El stock crítico", 0));
  if (!datos?.categoriaId || !/^\d+$/.test(String(datos.categoriaId))) {
    errores.push("Debes seleccionar una categoría para el producto.");
  }
  if (!["Activo", "Inactivo"].includes(datos?.estado || "Activo")) errores.push("El estado del producto debe ser Activo o Inactivo.");
  const tipo = datos?.ofertaTipo || "ninguna";
  if (!["ninguna", "2x1", "porcentaje"].includes(tipo)) {
    errores.push("Selecciona una promoción válida: ninguna, 2x1 o descuento porcentual.");
  }
  if (tipo === "porcentaje" && (!enteroEnRango(datos?.descuentoPorcentaje, 1) || Number(datos.descuentoPorcentaje) > 90)) {
    errores.push("El descuento debe ser un porcentaje entero entre 1 % y 90 %.");
  }
  const imagen = String(datos?.imagen || "").trim();
  if (imagen && (!/^[a-z\d_-]+(?:\/[a-z\d_-]+)*\.(png|jpe?g|webp|avif|jfif)$/i.test(imagen))) {
    errores.push("La imagen debe ser una ruta local de static/img, por ejemplo: productos/crema.webp.");
  }
  return errores;
}

export function validarDatosEntrega(datos) {
  const errores = [];
  agregar(errores, errorTexto(datos?.nombre, "Nombre de quien recibe", 50));
  agregar(errores, errorTexto(datos?.apellidos, "Apellidos de quien recibe", 100));
  agregar(errores, obtenerErrorCorreo(datos?.correo));

  const telefono = String(datos?.telefono || "").replace(/[\s().-]/g, "");
  if (!telefono) errores.push("Debes ingresar un teléfono de contacto.");
  else if (!/^(?:\+?56)?9\d{8}$/.test(telefono)) {
    errores.push("Ingresa un teléfono móvil chileno válido, con 9 dígitos y opcionalmente el código +56.");
  }

  agregar(errores, errorTexto(datos?.direccion, "Dirección y número", 200));
  agregar(errores, errorTexto(datos?.departamento || "", "Departamento o casa", 50, false));
  agregar(errores, errorTexto(datos?.referencia || "", "Referencia de despacho", 300, false));

  if (!datos?.regionId || !/^\d+$/.test(String(datos.regionId))) {
    errores.push("Debes seleccionar la región de despacho.");
  }
  if (!datos?.comunaId || !/^\d+$/.test(String(datos.comunaId))) {
    errores.push("Debes seleccionar la comuna de despacho.");
  }
  return errores;
}

export function validarDatosContacto(datos) {
  const errores = [];
  agregar(errores, errorTexto(datos?.nombre, "Nombre", 100));
  agregar(errores, obtenerErrorCorreo(datos?.correo));
  agregar(errores, errorTexto(datos?.mensaje, "Mensaje", 3000));
  return errores;
}

export function validarDatosLogin(correo, password) {
  const errores = [];
  agregar(errores, obtenerErrorCorreo(correo));
  agregar(errores, obtenerErrorPassword(password));
  return errores;
}
