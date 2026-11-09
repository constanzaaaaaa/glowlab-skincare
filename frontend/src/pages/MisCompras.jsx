// Historial de compras del usuario autenticado (persistencia JS del documento 040).
import { useEffect, useState } from "react";
import { Badge, Card, Container, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listarMisPedidos } from "../storage/pedidos";
import { useAuth } from "../hooks/useAuth";
import { formatearPrecio } from "../utils/format";

export default function MisCompras() {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    setCargando(true);
    listarMisPedidos()
      .then((datos) => { if (activo) setPedidos(datos); })
      .catch((e) => { if (activo) setError(e.message); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [usuario?.run]);

  function fechaPedido(fecha) {
    return new Date(fecha).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
  }

  return (
    <Container className="py-5">
      <h1 className="section-title">Mi historial de compras</h1>
      <p className="text-muted">Pedidos simulados de {usuario?.nombre}. Solo se muestran las compras de tu cuenta en este navegador.</p>
      {cargando && <Spinner animation="border" role="status" />}
      {error && <p role="alert" className="text-danger">{error}</p>}
      {!cargando && !error && pedidos.length === 0 && (
        <Card body>
          Todavía no tienes compras registradas. <Link to="/productos">Explorar productos</Link>
        </Card>
      )}
      {!cargando && pedidos.map((pedido) => (
        <Card className="mb-4" key={pedido.id}>
          <Card.Header className="d-flex flex-wrap justify-content-between gap-2">
            <span><strong>{pedido.id}</strong> · {fechaPedido(pedido.fecha)}</span>
            <Badge bg="info" text="dark">{pedido.estado}</Badge>
          </Card.Header>
          <Card.Body>
            <Table responsive size="sm" className="align-middle">
              <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio original</th><th>Oferta</th><th>Subtotal</th></tr></thead>
              <tbody>
                {pedido.items.map((item) => (
                  <tr key={item.codigo}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatearPrecio(item.precioUnitario)}</td>
                    <td>{item.oferta || "—"}{item.descuento > 0 ? " · Ahorras " + formatearPrecio(item.descuento) : ""}</td>
                    <td>{formatearPrecio(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="text-end fw-bold mb-0">Total: {formatearPrecio(pedido.total)}</p>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
