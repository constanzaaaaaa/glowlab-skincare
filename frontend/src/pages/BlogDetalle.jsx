import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { obtenerNoticia } from "../api/blogApi";
import { rutaImagen } from "../api/axiosClient";
export default function BlogDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { obtenerNoticia(id).then(setNoticia).catch((e) => setError(e.message)); }, [id]);
  if (error) return <Container className="py-5 text-danger" role="alert">{error}</Container>;
  if (!noticia) return <Container className="py-5">Cargando noticia…</Container>;
  return <Container className="py-5" style={{ maxWidth: 900 }}>
    <Link to="/blog">← Volver al blog</Link>
    <h1 className="mt-4">{noticia.titulo}</h1><small>{noticia.fecha}</small>
    <img className="w-100 rounded my-4 preview-img" src={rutaImagen(noticia.imagen)} alt={noticia.titulo} />
    <p className="lead">{noticia.resumen}</p>
    {(noticia.contenido || []).map((parrafo, i) => <p key={i}>{parrafo}</p>)}
  </Container>;
}
