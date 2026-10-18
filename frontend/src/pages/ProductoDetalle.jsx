import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../api/productosApi";
import { rutaImagen } from "../api/axiosClient";
import { useCart } from "../hooks/useCart";
import { formatearPrecio, stockDisponible } from "../utils/format";
import { mostrarError } from "../utils/swal";

export default function ProductoDetalle() {
  const { codigo } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const { agregar } = useCart();

  useEffect(() => {
    obtenerProducto(codigo).then(setProducto).catch((e) => setError(e.message));
  }, [codigo]);

  async function agregarSeleccionado() {
    try { await agregar(producto.codigo, cantidad, producto.nombre); }
    catch (e) { mostrarError(e.message); }
  }

  if (error) return <Container className="py-5"><p role="alert" className="text-danger">{error}</p></Container>;
  if (!producto) return <Container className="py-5">Cargando producto…</Container>;

  return (
    <Container className="py-5">
      <Link to="/productos">← Volver al catálogo</Link>
      <Row className="g-4 mt-2">
        <Col md={6}><img className="w-100 rounded preview-img" src={rutaImagen(producto.imagen)} alt={producto.nombre} /></Col>
        <Col md={6}>
          <h1>{producto.nombre}</h1>
          <p className="display-6 text-info fw-bold">{formatearPrecio(producto.precio)}</p>
          <p>{producto.descripcion}</p>
          <p>Stock disponible: {producto.stock}</p>
          <Form.Label htmlFor="detalle-cantidad">Cantidad</Form.Label>
          <Form.Control id="detalle-cantidad" className="mb-3" type="number" min={1} max={Math.max(1, producto.stock)} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
          <Button className="btn-glow" disabled={!stockDisponible(producto) || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > producto.stock} onClick={agregarSeleccionado}>Agregar al carrito</Button>
        </Col>
      </Row>
    </Container>
  );
}
