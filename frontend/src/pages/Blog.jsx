import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { listarNoticias } from "../api/blogApi";
import BlogCard from "../components/blog/BlogCard";
export default function Blog() {
  const [noticias, setNoticias] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { listarNoticias().then(setNoticias).catch((e) => setError(e.message)); }, []);
  return <Container className="py-5">
    <h1 className="section-title">Blog GlowLab</h1>
    {error && <p role="alert" className="text-danger">{error}</p>}
    <Row className="g-4 mt-3">{noticias.map((noticia) => <Col md={6} lg={4} key={noticia.id}><BlogCard noticia={noticia} /></Col>)}</Row>
  </Container>;
}
