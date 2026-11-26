// Mantiene la interfaz ProductoCard del 033 y delega la tarjeta visual a la molécula del 034.
import { Col } from "react-bootstrap";
import TarjetaProducto from "../molecules/TarjetaProducto.jsx";

export default function ProductoCard({ producto }) {
  return (
    <Col sm={6} lg={3}>
      <TarjetaProducto producto={producto} />
    </Col>
  );
}
