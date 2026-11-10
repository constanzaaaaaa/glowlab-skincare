import Swal from "sweetalert2";

// Mensajes detallados en una alerta grande y legible, con escapes para evitar HTML inyectado.
function escaparHtml(valor) {
  return String(valor).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export function mostrarErrores(errores) {
  const lista = (Array.isArray(errores) ? errores : [errores]).filter(Boolean);
  if (!lista.length) return Promise.resolve();
  return Swal.fire({
    title: lista.length > 1 ? "Corrige los siguientes datos" : "Revisa este dato",
    html: '<div style="text-align:left;max-height:50vh;overflow:auto">' +
      '<p>Revisa lo siguiente antes de continuar:</p>' +
      '<ul style="padding-left:1.3rem;margin-bottom:0">' +
      lista.map((error) => "<li style=\"margin-bottom:.5rem\">" + escaparHtml(error) + "</li>").join("") +
      "</ul></div>",
    icon: "error",
    width: 620,
    confirmButtonText: "Entendido",
    focusConfirm: true
  });
}
export function mostrarError(texto) { return mostrarErrores([texto]); }
export function mostrarExito(titulo, texto) {
  return Swal.fire(titulo, texto, "success");
}
export function mostrarInfo(titulo, texto) {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: "info",
    confirmButtonText: "Entendido"
  });
}
export async function confirmarAccion({ titulo, texto, confirmButtonText = "Confirmar", icon = "warning" }) {
  const resultado = await Swal.fire({
    title: titulo, text: texto, icon,
    showCancelButton: true, confirmButtonText, cancelButtonText: "Cancelar"
  });
  return resultado.isConfirmed;
}
