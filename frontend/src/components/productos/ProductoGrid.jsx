import { Col, Row } from "react-bootstrap";
import ProductoCard from "./ProductoCard";
export default function ProductoGrid({ productos }) {
  if (productos.length === 0) return <p className="text-center py-5 text-muted">No se encontraron productos.</p>;
  return (
    <Row className="g-4">
      {productos.map((producto) =>
        <Col key={producto.codigo} sm={6} lg={4} xl={3}><ProductoCard producto={producto} /></Col>
      )}
    </Row>
  );
}
