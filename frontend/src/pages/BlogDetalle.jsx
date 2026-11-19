import { useEffect, useState } from "react";
import { Alert, Badge, Card, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { obtenerNoticia } from "../api/blogApi";
import { rutaImagen } from "../api/axiosClient";

export default function BlogDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setNoticia(null); setError("");
    obtenerNoticia(id).then(setNoticia).catch((e) => setError(e.message));
  }, [id]);
  if (error) return <Container className="py-5"><Alert variant="danger" role="alert">{error}</Alert></Container>;
  if (!noticia) return <Container className="py-5">Cargando artículo…</Container>;
  const secciones = noticia.secciones || [];
  return (
    <Container className="py-5" style={{ maxWidth: 900 }}>
      <Link to="/blog">← Volver al blog</Link>
      <header className="mt-4">
        {noticia.categoria && <Badge bg="info" className="mb-3">{noticia.categoria}</Badge>}
        <h1 className="display-5 fw-semibold">{noticia.titulo}</h1>
        <div className="d-flex flex-wrap gap-3 text-muted small mt-3">
          <span><i className="bi bi-calendar3 me-2" />{noticia.fecha}</span>
          {noticia.lecturaMinutos && <span><i className="bi bi-clock me-2" />{noticia.lecturaMinutos} min de lectura</span>}
        </div>
      </header>
      <img className="w-100 rounded-4 my-4 preview-img" src={rutaImagen(noticia.imagen)} alt={noticia.titulo} style={{ maxHeight: 430, objectFit: "cover" }} />
      <p className="lead fw-medium">{noticia.resumen}</p>
      {secciones.length > 0 ? secciones.map((seccion, indice) => (
        <section className="my-4" key={seccion.titulo || indice}>
          <h2 className="h4 mb-3">{seccion.titulo}</h2>
          {(seccion.parrafos || []).map((parrafo, i) => <p key={i} className="lh-lg">{parrafo}</p>)}
          {seccion.puntos?.length > 0 && <ul className="lh-lg">{seccion.puntos.map((punto, i) => <li key={i}>{punto}</li>)}</ul>}
        </section>
      )) : (noticia.contenido || []).map((parrafo, i) => <p key={i} className="lh-lg">{parrafo}</p>)}
      {noticia.consejos?.length > 0 && <Card className="my-4 border-0" style={{ background: "var(--bs-tertiary-bg)" }}>
        <Card.Body className="p-4">
          <h2 className="h5"><i className="bi bi-lightbulb me-2" />Consejos para recordar</h2>
          <ul className="mb-0 lh-lg">{noticia.consejos.map((consejo, i) => <li key={i}>{consejo}</li>)}</ul>
        </Card.Body>
      </Card>}
      {noticia.conclusion && <p className="lh-lg fw-medium mt-4">{noticia.conclusion}</p>}
      <p className="small text-muted border-top pt-3 mt-5">Contenido informativo general. Las necesidades y tolerancias de la piel son distintas; ante molestias persistentes o dudas sobre una condición cutánea, consulta con un profesional de salud.</p>
      <Link to="/blog">← Volver a todos los artículos</Link>
    </Container>
  );
}
