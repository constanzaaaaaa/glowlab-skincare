export const DOMINIOS_CORREO_VALIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
export function validarCorreo(correo) {
  return typeof correo === "string" && correo.length > 0 && correo.length <= 100 &&
    DOMINIOS_CORREO_VALIDOS.some((dominio) => correo.toLowerCase().endsWith(dominio));
}
export function validarPassword(password) {
  return typeof password === "string" && password.length >= 4 && password.length <= 10;
}
export function validarRun(valor) {
  if (typeof valor !== "string") return false;
  const run = valor.toUpperCase().trim();
  if (!/^[0-9]{6,8}[0-9K]$/.test(run)) return false;
  let suma = 0;
  let multiplicador = 2;
  for (let i = run.length - 2; i >= 0; i--) {
    suma += Number(run[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const digito = 11 - (suma % 11);
  const esperado = digito === 11 ? "0" : digito === 10 ? "K" : String(digito);
  return run.at(-1) === esperado;
}
export function textoRequerido(valor, maximo) {
  return typeof valor === "string" && valor.trim().length > 0 && (!maximo || valor.trim().length <= maximo);
}
export function enteroEnRango(valor, minimo) {
  return valor !== "" && valor !== null && Number.isInteger(Number(valor)) && Number(valor) >= minimo;
}
