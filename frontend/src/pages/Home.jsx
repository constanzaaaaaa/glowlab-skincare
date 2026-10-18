import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
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
      <section className="hero-glow py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Cuida tu piel con GLOWLAB</h1>
          <p className="lead">Limpieza, hidratación y protección en una sola tienda skincare.</p>
          <Button as={Link} to="/productos" className="btn-glow">Ver catálogo</Button>
        </Container>
      </section>
      <Container className="py-5">
        <h2 className="section-title mb-4">Productos destacados</h2>
        <ProductoGrid productos={productos} />
      </Container>
    </>
  );
}
