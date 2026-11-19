import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { listarNoticias } from "../api/blogApi";
import BlogCard from "../components/blog/BlogCard";

export default function Blog() {
  const [noticias, setNoticias] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { listarNoticias().then(setNoticias).catch((e) => setError(e.message)); }, []);
  return (
    <Container className="py-5">
      <div className="mx-auto text-center mb-4" style={{ maxWidth: 760 }}>
        <span className="text-uppercase text-info fw-semibold small">Consejos, ideas y cuidado facial</span>
        <h1 className="section-title mt-2">El universo GlowLab</h1>
        <p className="lead">Un espacio para aprender sobre skincare, conocer mejor los productos y descubrir hábitos que pueden ayudarte a construir una rutina sencilla y consciente.</p>
        <p className="text-muted">Encuentra guías prácticas, información sobre categorías de cuidado facial y recomendaciones generales para elegir tus productos con más confianza.</p>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Row className="g-4 mt-2">{noticias.map((noticia) => <Col md={6} lg={4} key={noticia.id}><BlogCard noticia={noticia} /></Col>)}</Row>
      {!error && noticias.length === 0 && <Alert variant="light" className="text-center mt-4">Pronto encontrarás nuevos artículos y consejos en nuestro blog.</Alert>}
      <div className="rounded-4 p-4 p-md-5 mt-5 text-center" style={{ background: "var(--bs-tertiary-bg)" }}>
        <h2 className="h4">Una rutina informada empieza por conocer tu piel</h2>
        <p className="mb-0 text-muted">Lee, compara y recuerda que cada piel es diferente. La información del blog es orientativa y no reemplaza la evaluación de un dermatólogo.</p>
      </div>
    </Container>
  );
}
