import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true
});

axiosClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => Promise.reject(new Error(error.response?.data?.error || "No se pudo completar la solicitud. Comprueba que Flask esté ejecutándose."))
);

export default axiosClient;

export function rutaImagen(imagen) {
  return "/static/img/" + (imagen || "logo.avif");
}
