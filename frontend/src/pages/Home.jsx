import { useEffect, useState } from "react";
import { Button, Carousel, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listarProductos } from "../api/productosApi";
import ProductoGrid from "../components/productos/ProductoGrid";

export default function Home() {
  const [productos, setProductos] = useState([]);
  useEffect(() => {
    listarProductos().then((datos) => setProductos(datos.filter((p) => p.estado === "Activo").slice(0, 4))).catch(() => setProductos([]));
  }, []);
  return (
    <>
      {/* Carrusel original de templates/index.html, adaptado a React-Bootstrap. */}
      <section className="hero-section">
        <Carousel id="heroCarousel" className="glow-hero-carousel" interval={5000} pause="hover" touch>
          <Carousel.Item>
            <img
              className="d-block w-100 glow-hero-image"
              src="/static/img/carusel1.png"
              alt="Rutina Glow 2026"
            />
            <Carousel.Caption className="glow-hero-caption">
              <h1 className="display-6">Rutina Glow 2026</h1>
              <p className="d-none d-md-block">Descubre los mejores productos para cada tipo de piel.</p>
              <Button as={Link} to="/productos" className="glow-carousel-btn">Ver catálogo</Button>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100 glow-hero-image"
              src="/static/img/carusel2.png"
              alt="Ofertas de lanzamiento"
            />
            <Carousel.Caption className="glow-hero-caption">
              <h1 className="display-6">Ofertas de lanzamiento</h1>
              <p className="d-none d-md-block">Precios especiales en nuestros últimos lanzamientos.</p>
              <Button as={Link} to="/productos" className="glow-carousel-btn">Ver ofertas</Button>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100 glow-hero-image"
              src="/static/img/carusel3.png"
              alt="Comunidad GLOWLAB"
            />
            <Carousel.Caption className="glow-hero-caption">
              <h1 className="display-6">Únete a la comunidad GLOWLAB</h1>
              <p className="d-none d-md-block">Regístrate y comienza a cuidar tu piel con nosotros.</p>
              <Button as={Link} to="/registro" className="glow-carousel-btn">Registrarme</Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>
      <Container className="py-5">
        <h2 className="section-title mb-4">Productos destacados</h2>
        <ProductoGrid productos={productos} />
      </Container>
    </>
  );
}
