// 🧪 MOLÉCULA: combina el átomo TituloProducto con imagen, precio y acciones.
// Adaptación de TarjetaReceta del 034 a la tarjeta skincare del 033.
import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { rutaImagen } from "../../api/axiosClient";
import { useCart } from "../../hooks/useCart";
import { calcularTotalProducto, etiquetaOferta, formatearPrecio, stockDisponible } from "../../utils/format";
import { mostrarError } from "../../utils/swal";
import TituloProducto from "../atoms/TituloProducto.jsx";

export default function TarjetaProducto({ producto }) {
  const { agregar } = useCart();

  async function agregarUno() {
    try {
      await agregar(producto.codigo, 1, producto.nombre);
    } catch (error) {
      mostrarError(error.message);
    }
  }

  return (
    <Card className="h-100 card-glow">
      <Card.Img variant="top" className="product-img" src={rutaImagen(producto.imagen)} alt={producto.nombre} />
      <Card.Body className="d-flex flex-column">
        {etiquetaOferta(producto) && <div className="mb-2"><Badge bg="danger">{etiquetaOferta(producto)}</Badge></div>}
        <TituloProducto nombre={producto.nombre} />
        {producto.ofertaTipo === "porcentaje" && etiquetaOferta(producto) ? (
          <p className="fw-bold text-info">
            <span className="text-decoration-line-through text-muted me-2 fw-normal">{formatearPrecio(producto.precio)}</span>
            {formatearPrecio(calcularTotalProducto(producto, 1).subtotal)}
          </p>
        ) : (
          <p className="fw-bold text-info">{formatearPrecio(producto.precio)}</p>
        )}
        {etiquetaOferta(producto) === "2x1" && <p className="small text-success mb-2">Lleva 2 y paga 1</p>}
        <p className="small text-muted">{producto.stock > 0 ? "Stock: " + producto.stock : "Sin stock"}</p>
        <div className="mt-auto d-flex gap-2">
          <Link to={"/productos/" + producto.codigo} className="btn btn-outline-info btn-sm">Ver detalle</Link>
          <Button size="sm" className="btn-glow" disabled={!stockDisponible(producto)} onClick={agregarUno} aria-label={"Agregar " + producto.nombre}>Agregar</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
