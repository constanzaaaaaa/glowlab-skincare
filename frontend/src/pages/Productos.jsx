import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { listarCategorias } from "../api/masterDataApi";
import { listarProductos } from "../api/productosApi";
import ProductoGrid from "../components/productos/ProductoGrid";
import Buscador from "../components/atoms/Buscador";
import { filtrarProductos } from "../utils/format";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    listarProductos().then(setProductos).catch((e) => setError(e.message));
    listarCategorias().then(setCategorias).catch((e) => setError(e.message));
  }, []);

  return (
    <Container className="py-5">
      <h1 className="section-title">Catálogo de skincare</h1>
      <Row className="g-3 my-3">
        <Col md={8}><Buscador valor={busqueda} onBuscar={setBusqueda} placeholder="Buscar por nombre…" /></Col>
        <Col md={4}>
          <Form.Select aria-label="Filtrar por categoría" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </Form.Select>
        </Col>
      </Row>
      {error && <p className="text-danger" role="alert">{error}</p>}
      <ProductoGrid productos={filtrarProductos(productos, busqueda, categoriaId)} />
    </Container>
  );
}
