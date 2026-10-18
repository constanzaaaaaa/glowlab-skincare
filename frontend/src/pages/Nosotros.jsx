import { Col, Container, Row } from "react-bootstrap";
export default function Nosotros() {
  return (
    <Container className="py-5">
      <h1 className="section-title">Sobre GLOWLAB</h1>
      <Row className="align-items-center g-4 mt-3">
        <Col md={6}><img src="/static/img/about.webp" alt="Cuidado personal GlowLab" className="img-fluid rounded" /></Col>
        <Col md={6}><h2>Tu rutina, a tu manera</h2>
          <p>GLOWLAB Skincare nace para acercar productos de cuidado facial a una comunidad interesada en el bienestar y las rutinas de skincare.</p>
          <p>En nuestro catálogo encontrarás limpiadores, sueros, hidratantes, protectores solares y tratamientos para diferentes necesidades de la piel.</p>
        </Col>
      </Row>
    </Container>
  );
}
