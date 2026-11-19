// 🧪 MOLÉCULA: combina dos átomos, Buscador y SelectorCategoria.
// Recibe datos por props; no administra el estado ni filtra productos.
import { Col, Row } from "react-bootstrap";
import Buscador from "../atoms/Buscador.jsx";
import SelectorCategoria from "../atoms/SelectorCategoria.jsx";

export default function FiltrosProductos({ categorias, busqueda, onBuscar, categoriaId, onCategoria }) {
  return (
    <Row className="g-3 my-3 filtros-productos">
      <Col md={8}>
        <Buscador valor={busqueda} onBuscar={onBuscar} placeholder="Buscar por nombre…" />
      </Col>
      <Col md={4}>
        <SelectorCategoria categorias={categorias} valor={categoriaId} onCambiar={onCategoria} />
      </Col>
    </Row>
  );
}
