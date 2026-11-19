// Las imágenes React se sirven desde public/static/img, sin requerir Flask.
export function rutaImagen(imagen) {
  return "/static/img/" + (imagen || "logo.avif");
}
