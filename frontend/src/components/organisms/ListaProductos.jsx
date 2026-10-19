// 🦠 ORGANISMO: une moléculas de filtros y tarjetas, como ListaRecetas del 034.
// Mantiene con useState los valores de búsqueda y categoría.
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import FiltrosProductos from "../molecules/FiltrosProductos.jsx";
import TarjetaProducto from "../molecules/TarjetaProducto.jsx";
import { filtrarProductos } from "../../utils/format";

export default function ListaProductos({ productos, categorias }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const filtrados = filtrarProductos(productos, busqueda, categoriaId);

  return (
    <section className="lista-productos">
      <FiltrosProductos
        categorias={categorias}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        categoriaId={categoriaId}
        onCategoria={setCategoriaId}
      />
      <Row className="g-4">
        {filtrados.map((producto) => (
          <Col sm={6} lg={3} key={producto.codigo}>
            <TarjetaProducto producto={producto} />
          </Col>
        ))}
      </Row>
      {filtrados.length === 0 && <p className="text-center py-5 text-muted">No se encontraron productos.</p>}
    </section>
  );
}
