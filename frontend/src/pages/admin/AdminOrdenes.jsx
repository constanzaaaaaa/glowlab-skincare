import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Table } from "react-bootstrap";
import { listarPedidosAdmin } from "../../api/pedidosApi";
import { formatearPrecio } from "../../utils/format";

export default function AdminOrdenes() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [abierta, setAbierta] = useState(null);

  useEffect(() => {
    listarPedidosAdmin().then(setPedidos).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="h3 mb-3">Órdenes</h1>
      <p className="text-muted">Listado y detalle de órdenes registradas en la base de datos.</p>
      {error && <Alert variant="danger">{error}</Alert>}
      {!error && pedidos.length === 0 && <Card body>No hay órdenes registradas.</Card>}
      <Table responsive striped bordered hover size="sm">
        <thead><tr><th>N.º pedido</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th><th>Detalle</th></tr></thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{new Date(pedido.fecha).toLocaleString("es-CL")}</td>
              <td>{pedido.clienteNombre}</td>
              <td><Badge bg="info" text="dark">{pedido.estado}</Badge></td>
              <td>{formatearPrecio(pedido.total)}</td>
              <td><Button size="sm" variant="outline-info" onClick={() => setAbierta(abierta === pedido.id ? null : pedido.id)}>
                {abierta === pedido.id ? "Ocultar" : "Ver detalle"}
              </Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      {pedidos.filter((pedido) => pedido.id === abierta).map((pedido) => (
        <Card className="mt-3" key={pedido.id}>
          <Card.Header>Detalle de {pedido.id}</Card.Header>
          <Card.Body>
            <p><strong>Cliente:</strong> {pedido.clienteNombre}</p>
            <Table responsive size="sm">
              <thead><tr><th>Producto</th><th>Cantidad</th><th>Oferta</th><th>Subtotal</th></tr></thead>
              <tbody>{pedido.items.map((item) => (
                <tr key={item.codigo}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.oferta || "—"}</td>
                  <td>{formatearPrecio(item.subtotal)}</td>
                </tr>
              ))}</tbody>
            </Table>
            <p><strong>Despacho:</strong> {pedido.entrega.direccion}, {pedido.entrega.comuna}, {pedido.entrega.region}</p>
            <p className="mb-0"><strong>Total:</strong> {formatearPrecio(pedido.total)}</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
