import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { rutaImagen } from "../api/axiosClient";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { calcularTotalProducto, etiquetaOferta, formatearPrecio } from "../utils/format";
import { mostrarError } from "../utils/swal";

export default function Carrito() {
  const { items, cargando, total, cambiarCantidad, eliminar, vaciar } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  async function ejecutar(accion) {
    try { await accion(); }
    catch (error) { mostrarError(error.message); }
  }

  return (
    <Container className="py-5">
      <h1 className="section-title">Mi carrito</h1>
      {cargando && <p role="status">Cargando carrito…</p>}
      {!cargando && items.length === 0 && <p>Tu carrito está vacío. <Link to="/productos">Ver productos</Link></p>}

      {items.map((item) => {
        const precio = calcularTotalProducto(item.producto, item.cantidad);
        const oferta = etiquetaOferta(item.producto);
        return (
          <Row className="align-items-center border rounded p-3 g-3 my-3" key={item.codigo}>
            <Col xs={3} md={2}>
              <img src={rutaImagen(item.producto.imagen)} className="img-fluid" alt={item.producto.nombre} />
            </Col>
            <Col xs={9} md={4}>
              <strong>{item.producto.nombre}</strong>
              <p className="mb-0">{formatearPrecio(item.producto.precio)} precio normal por unidad</p>
              {oferta && <span className="text-success small fw-bold">{oferta}{oferta === "2x1" ? " · lleva 2 y paga 1" : ""}</span>}
            </Col>
            <Col xs={6} md={3} className="d-flex align-items-center gap-2">
              <Button variant="outline-info" size="sm" aria-label={"Quitar uno de " + item.producto.nombre}
                onClick={() => ejecutar(() => cambiarCantidad(item.codigo, item.cantidad - 1))} disabled={item.cantidad <= 1}>−</Button>
              <span>{item.cantidad}</span>
              <Button variant="outline-info" size="sm" aria-label={"Agregar uno de " + item.producto.nombre}
                onClick={() => ejecutar(() => cambiarCantidad(item.codigo, item.cantidad + 1))} disabled={item.cantidad >= item.producto.stock}>+</Button>
            </Col>
            <Col xs={6} md={3} className="text-end">
              {precio.ahorro > 0 && <p className="text-muted text-decoration-line-through mb-1">{formatearPrecio(precio.original)}</p>}
              <p className="fw-bold mb-1">{formatearPrecio(precio.subtotal)}</p>
              {precio.ahorro > 0 && <p className="text-success small">Ahorras {formatearPrecio(precio.ahorro)}</p>}
              <Button variant="outline-danger" size="sm" onClick={() => ejecutar(() => eliminar(item.codigo))}>Eliminar</Button>
            </Col>
          </Row>
        );
      })}

      {items.length > 0 && (
        <div className="text-end">
          {items.reduce((suma, item) => suma + calcularTotalProducto(item.producto, item.cantidad).ahorro, 0) > 0 && (
            <p className="text-success fw-bold">
              Ahorro por ofertas: {formatearPrecio(items.reduce((suma, item) => suma + calcularTotalProducto(item.producto, item.cantidad).ahorro, 0))}
            </p>
          )}
          <h2 className="h4">Total con ofertas: {formatearPrecio(total)}</h2>
          <Button variant="outline-secondary" className="me-2" onClick={() => ejecutar(vaciar)}>Vaciar</Button>
          {!usuario && (
            <p className="text-info mt-3">
              <Link to="/login">Inicia sesión</Link> o <Link to="/registro">regístrate</Link> para guardar tu compra y verla en tu historial.
            </p>
          )}
          <Button className="btn-glow" onClick={() => navigate("/checkout")} disabled={!usuario || cargando}>
            Continuar con el despacho
          </Button>
          <p className="small text-muted mt-2">En el siguiente paso podrás ingresar los datos de contacto y entrega.</p>
        </div>
      )}
    </Container>
  );
}
