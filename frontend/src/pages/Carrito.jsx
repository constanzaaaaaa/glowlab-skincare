import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { rutaImagen } from "../api/axiosClient";
import { useCart } from "../hooks/useCart";
import { formatearPrecio } from "../utils/format";
import { mostrarError } from "../utils/swal";

export default function Carrito() {
  const { items, cargando, total, cambiarCantidad, eliminar, vaciar, finalizarCompra } = useCart();

  async function ejecutar(accion) {
    try { await accion(); } catch (e) { mostrarError(e.message); }
  }

  return (
    <Container className="py-5">
      <h1 className="section-title">Mi carrito</h1>
      {cargando && <Spinner animation="border" />}
      {!cargando && items.length === 0 && <p>Tu carrito está vacío. <Link to="/productos">Ver productos</Link></p>}
      {items.map((item) => (
        <Row className="align-items-center border rounded p-3 g-3 my-3" key={item.codigo}>
          <Col xs={3} md={2}><img src={rutaImagen(item.producto.imagen)} className="img-fluid" alt={item.producto.nombre} /></Col>
          <Col xs={9} md={4}><strong>{item.producto.nombre}</strong><p className="mb-0">{formatearPrecio(item.producto.precio)} por unidad</p></Col>
          <Col xs={6} md={3} className="d-flex align-items-center gap-2">
            <Button variant="outline-info" size="sm" aria-label={"Quitar uno de " + item.producto.nombre} onClick={() => ejecutar(() => cambiarCantidad(item.codigo, item.cantidad - 1))} disabled={item.cantidad <= 1}>−</Button>
            <span>{item.cantidad}</span>
            <Button variant="outline-info" size="sm" aria-label={"Agregar uno de " + item.producto.nombre} onClick={() => ejecutar(() => cambiarCantidad(item.codigo, item.cantidad + 1))} disabled={item.cantidad >= item.producto.stock}>+</Button>
          </Col>
          <Col xs={6} md={3} className="text-end">
            <p className="fw-bold">{formatearPrecio(item.cantidad * item.producto.precio)}</p>
            <Button variant="outline-danger" size="sm" onClick={() => ejecutar(() => eliminar(item.codigo))}>Eliminar</Button>
          </Col>
        </Row>
      ))}
      {items.length > 0 && <div className="text-end">
        <h2 className="h4">Total: {formatearPrecio(total)}</h2>
        <Button variant="outline-secondary" className="me-2" onClick={() => ejecutar(vaciar)}>Vaciar</Button>
        <Button className="btn-glow" onClick={() => ejecutar(finalizarCompra)}>Confirmar compra</Button>
        <p className="small text-muted mt-2">Compra simulada para evaluación académica.</p>
      </div>}
    </Container>
  );
}
