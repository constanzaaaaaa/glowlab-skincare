import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { rutaImagen } from "../../api/axiosClient";
import { useCart } from "../../hooks/useCart";
import { formatearPrecio, stockDisponible } from "../../utils/format";
import { mostrarError } from "../../utils/swal";
import TituloProducto from "../atoms/TituloProducto";

export default function ProductoCard({ producto }) {
  const { agregar } = useCart();
  async function agregarUno() {
    try { await agregar(producto.codigo, 1, producto.nombre); }
    catch (error) { mostrarError(error.message); }
  }
  return (
    <Card className="h-100 card-glow">
      <Card.Img variant="top" className="product-img" src={rutaImagen(producto.imagen)} alt={producto.nombre} />
      <Card.Body className="d-flex flex-column">
        <TituloProducto nombre={producto.nombre} />
        <p className="fw-bold text-info">{formatearPrecio(producto.precio)}</p>
        <p className="small text-muted">{producto.stock > 0 ? "Stock: " + producto.stock : "Sin stock"}</p>
        <div className="mt-auto d-flex gap-2">
          <Link to={"/productos/" + producto.codigo} className="btn btn-outline-info btn-sm">Ver detalle</Link>
          <Button size="sm" className="btn-glow" disabled={!stockDisponible(producto)} onClick={agregarUno} aria-label={"Agregar " + producto.nombre}>Agregar</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
