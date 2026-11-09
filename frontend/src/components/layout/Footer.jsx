import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

// Iconos de referencia visual. No representan perfiles oficiales publicados.
const redes = [
  { nombre: "Instagram", icono: "bi-instagram" },
  { nombre: "TikTok", icono: "bi-tiktok" },
  { nombre: "Facebook", icono: "bi-facebook" },
  { nombre: "Pinterest", icono: "bi-pinterest" }
];

export default function Footer() {
  return (
    <footer className="glow-footer mt-5">
      <Container className="py-5">
        <Row className="g-4 glow-footer-grid">
          <Col sm={6} lg={4}>
            <Link to="/" className="glow-footer-brand">
              GLOW<span>LAB</span> <small>SKINCARE</small>
            </Link>
            <p className="glow-footer-description mt-3 mb-3">
              Tu espacio para descubrir productos, consejos y rutinas
              para cuidar tu piel todos los días.
            </p>
            <p className="glow-footer-small mb-0">
              <i className="bi bi-stars me-2" aria-hidden="true" />
              Tu rutina, a tu manera.
            </p>
          </Col>

          <Col xs={6} sm={6} lg={2}>
            <h2 className="glow-footer-heading">Explora</h2>
            <nav aria-label="Explorar GlowLab" className="glow-footer-links">
              <Link to="/productos">Productos</Link>
              <Link to="/ofertas">Ofertas</Link>
              <Link to="/blog">Blog y consejos</Link>
              <Link to="/nosotros">Sobre nosotros</Link>
            </nav>
          </Col>

          <Col xs={6} sm={6} lg={3}>
            <h2 className="glow-footer-heading">Ayuda</h2>
            <nav aria-label="Ayuda y atención" className="glow-footer-links">
              <Link to="/ayuda">Preguntas frecuentes</Link>
              <Link to="/contacto">Contáctanos</Link>
              <Link to="/carrito">Mi carrito</Link>
              <Link to="/mis-compras">Mis compras</Link>
              <Link to="/login">Mi cuenta</Link>
            </nav>
          </Col>

          <Col sm={6} lg={3}>
            <h2 className="glow-footer-heading">Contacto y comunidad</h2>
            <div className="glow-footer-contact">
              <p className="mb-2">
                <i className="bi bi-geo-alt me-2" aria-hidden="true" />
                Chile · Tienda online
              </p>
              <p className="mb-3">
                <i className="bi bi-envelope me-2" aria-hidden="true" />
                <Link to="/contacto">Envíanos un mensaje</Link>
              </p>
            </div>
            <p className="glow-footer-heading mb-2">Redes sociales</p>
            <div className="glow-footer-social" aria-label="Iconos de redes sociales">
              {redes.map((red) => (
                <span key={red.nombre} className="glow-social-icon" role="img"
                  aria-label={red.nombre} title={red.nombre}>
                  <i className={"bi " + red.icono} aria-hidden="true" />
                </span>
              ))}
            </div>
          </Col>
        </Row>

        <div className="glow-footer-bottom mt-4 pt-4">
          <span>© {new Date().getFullYear()} GLOWLAB Skincare.</span>
          <span>Cuidado facial · Bienestar · Belleza</span>
        </div>
      </Container>
    </footer>
  );
}
