import axiosClient from "./axiosClient";

export async function enviarMensajeContacto(mensaje) {
  const { data } = await axiosClient.post("/contacto", mensaje);
  return data;
}
