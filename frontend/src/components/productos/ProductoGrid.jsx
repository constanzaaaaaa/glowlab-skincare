// Igual que ProductoGrid del ejemplo 033: un Row que representa tarjetas por props.
import { Row } from "react-bootstrap";
import ProductoCard from "./ProductoCard";

export default function ProductoGrid({ productos, mensajeVacio = "No se encontraron productos." }) {
  if (productos.length === 0) {
    return <p className="text-center py-5 text-muted">{mensajeVacio}</p>;
  }

  return (
    <Row className="g-4">
      {productos.map((producto) => (
        <ProductoCard key={producto.codigo} producto={producto} />
      ))}
    </Row>
  );
}
