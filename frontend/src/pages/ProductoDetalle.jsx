import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../api/productosApi";
import { rutaImagen } from "../api/axiosClient";
import { useCart } from "../hooks/useCart";
import { calcularTotalProducto, etiquetaOferta, formatearPrecio, stockDisponible } from "../utils/format";
import { obtenerContenidoProducto } from "../data/contenidoProductos";
import { mostrarError } from "../utils/swal";

export default function ProductoDetalle() {
  const { codigo } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const { agregar } = useCart();
  useEffect(() => {
    setProducto(null); setError(""); setCantidad(1);
    obtenerProducto(codigo).then(setProducto).catch((e) => setError(e.message));
  }, [codigo]);

  async function agregarSeleccionado() {
    if (!Number.isInteger(cantidad) || cantidad < 1) { await mostrarError("La cantidad debe ser un número entero mayor que cero."); return; }
    if (cantidad > producto.stock) { await mostrarError("No hay stock suficiente: quedan " + producto.stock + " unidades."); return; }
    try { await agregar(producto.codigo, cantidad, producto.nombre); }
    catch (e) { mostrarError(e.message); }
  }

  if (error) return <Container className="py-5"><Alert variant="danger" role="alert">{error}</Alert></Container>;
  if (!producto) return <Container className="py-5">Cargando producto…</Container>;
  const ficha = obtenerContenidoProducto(producto);
  const calculo = calcularTotalProducto(producto, cantidad);

  return (
    <Container className="py-5">
      <Link to="/productos">← Volver al catálogo</Link>
      <Row className="g-4 mt-2 align-items-start">
        <Col md={6}><img className="w-100 rounded-4 preview-img shadow-sm" src={rutaImagen(producto.imagen)} alt={producto.nombre} style={{ maxHeight: 560, objectFit: "cover" }} /></Col>
        <Col md={6}>
          <p className="text-uppercase text-info fw-semibold small mb-2">{ficha.enfoque}</p>
          <h1 className="display-6 fw-semibold">{producto.nombre}</h1>
          {etiquetaOferta(producto) && <Alert variant="success" className="py-2"><strong>Oferta especial: {etiquetaOferta(producto)}</strong>{producto.ofertaTipo === "2x1" && <span> · Lleva 2 y paga 1.</span>}</Alert>}
          {producto.ofertaTipo === "porcentaje" && etiquetaOferta(producto) && <p className="text-muted text-decoration-line-through mb-0">{formatearPrecio(producto.precio)}</p>}
          <p className="display-6 text-info fw-bold mb-1">{formatearPrecio(calcularTotalProducto(producto, 1).subtotal)}</p>
          <p className="text-muted small">Precio por unidad, sujeto a las promociones indicadas.</p>
          <p className="lh-lg">{producto.descripcion}</p>
          <p className="lh-lg">{ficha.descripcionAmpliada}</p>
          <div className="d-flex align-items-center gap-2 mb-3"><span className="text-muted">Disponibilidad:</span>
            {stockDisponible(producto) ? <span className="text-success fw-semibold">Disponible · {producto.stock} unidades</span> : <span className="text-danger fw-semibold">Sin stock disponible</span>}
          </div>
          <Form.Label htmlFor="detalle-cantidad">Cantidad</Form.Label>
          <Form.Control id="detalle-cantidad" className="mb-3" type="number" min={1} max={Math.max(1, producto.stock)} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
          {etiquetaOferta(producto) && <Alert variant="light" className="border">Total por {cantidad} unidad(es): <strong>{formatearPrecio(calculo.subtotal)}</strong>{calculo.ahorro > 0 && <span className="text-success"> · Ahorras {formatearPrecio(calculo.ahorro)}</span>}</Alert>}
          <Button className="btn-glow w-100" disabled={!stockDisponible(producto)} onClick={agregarSeleccionado}><i className="bi bi-bag-plus me-2" />Agregar al carrito</Button>
        </Col>
      </Row>
      <section className="mt-5">
        <div className="mb-3"><span className="text-uppercase text-info fw-semibold small">Conoce el producto</span><h2 className="h3 mt-1">Información y recomendaciones</h2><p className="text-muted">Una guía general para entender dónde puede encajar dentro de tu rutina.</p></div>
        <Row className="g-4">
          <Col md={6} lg={4}><Card className="h-100 border-0 shadow-sm"><Card.Body className="p-4">
            <h3 className="h5"><i className="bi bi-stars text-info me-2" />Qué aporta</h3><p>{ficha.descripcionAmpliada}</p>
            <p className="small text-muted mb-1">Ingrediente o característica destacada</p><strong>{ficha.ingrediente}</strong>
            <ul className="mt-3 mb-0 ps-3">{ficha.beneficios.map((beneficio) => <li className="mb-2" key={beneficio}>{beneficio}</li>)}</ul>
          </Card.Body></Card></Col>
          <Col md={6} lg={4}><Card className="h-100 border-0 shadow-sm"><Card.Body className="p-4">
            <h3 className="h5"><i className="bi bi-person-check text-info me-2" />¿Para quién está pensado?</h3><p className="lh-lg">{ficha.tipoPiel}</p>
            <h4 className="h6 mt-4">Modo de uso orientativo</h4><ol className="ps-3 mb-0">{ficha.modoUso.map((paso, indice) => <li className="mb-2" key={indice}>{paso}</li>)}</ol>
          </Card.Body></Card></Col>
          <Col md={12} lg={4}><Card className="h-100 border-0 shadow-sm"><Card.Body className="p-4">
            <h3 className="h5"><i className="bi bi-lightbulb text-info me-2" />Recomendaciones</h3><ul className="ps-3 mb-0">{ficha.recomendaciones.map((recomendacion) => <li className="mb-3" key={recomendacion}>{recomendacion}</li>)}</ul>
          </Card.Body></Card></Col>
        </Row>
        <Alert variant="light" className="border mt-4 small"><strong>Importante:</strong> esta información es orientativa y complementa, pero no reemplaza, las instrucciones del fabricante ni una recomendación dermatológica. Revisa siempre el listado completo de ingredientes y suspende el uso si aparece irritación o molestia.</Alert>
      </section>
    </Container>
  );
}
