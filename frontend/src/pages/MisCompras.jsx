// Historial de pedidos del usuario autenticado.
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
    setError("");
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
      <p className="text-muted">Aquí puedes revisar tus pedidos, productos y datos de despacho.</p>
      {cargando && <Spinner animation="border" role="status" />}
      {error && <p role="alert" className="text-danger">{error}</p>}
      {!cargando && !error && pedidos.length === 0 && (
        <Card body>Todavía no tienes compras registradas. <Link to="/productos">Explorar productos</Link></Card>
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
            {pedido.entrega && (
              <div className="border-top mt-3 pt-3">
                <h2 className="h6">Datos de despacho</h2>
                <p className="mb-1"><strong>Recibe:</strong> {pedido.entrega.nombre} {pedido.entrega.apellidos}</p>
                <p className="mb-1"><strong>Dirección:</strong> {pedido.entrega.direccion}{pedido.entrega.departamento ? ", " + pedido.entrega.departamento : ""}</p>
                <p className="mb-1"><strong>Comuna:</strong> {pedido.entrega.comuna}, {pedido.entrega.region}</p>
                <p className="mb-1"><strong>Teléfono:</strong> {pedido.entrega.telefono}</p>
                <p className="mb-1"><strong>Correo:</strong> {pedido.entrega.correo}</p>
                {pedido.entrega.referencia && <p className="mb-0"><strong>Referencia:</strong> {pedido.entrega.referencia}</p>}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
