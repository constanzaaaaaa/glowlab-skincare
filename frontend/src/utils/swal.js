import Swal from "sweetalert2";

export function mostrarError(texto) {
  return Swal.fire("Atención", texto, "error");
}
export function mostrarExito(titulo, texto) {
  return Swal.fire(titulo, texto, "success");
}
export async function confirmarAccion({ titulo, texto, confirmButtonText = "Confirmar", icon = "warning" }) {
  const resultado = await Swal.fire({
    title: titulo,
    text: texto,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancelar"
  });
  return resultado.isConfirmed;
}
