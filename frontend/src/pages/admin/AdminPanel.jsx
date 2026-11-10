// Dashboard de stock e informes de ventas, usando el mismo CRUD local del documento 040.
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, ProgressBar, Row, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listarProductos } from "../../api/productosApi";
import { obtenerInformeVentas } from "../../storage/pedidos";
import { CLAVES, EVENTO_DATOS } from "../../storage/persistencia";
import { useAuth } from "../../hooks/useAuth";
import { formatearPrecio } from "../../utils/format";

function inicioPeriodo(periodo) {
  if (periodo === "todo") return undefined;
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() - Number(periodo) + 1);
  const numero = (n) => String(n).padStart(2, "0");
  return inicio.getFullYear() + "-" + numero(inicio.getMonth() + 1) + "-" + numero(inicio.getDate());
}

// CSV compatible con Excel en español. Protege las celdas contra fórmulas.
function celdaCsv(valor) {
  const texto = String(valor ?? "");
  const seguro = /^[=+\-@\t\r]/.test(texto) ? "'" + texto : texto;
  return '"' + seguro.replace(/"/g, '""') + '"';
}

export default function AdminPanel() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [informe, setInforme] = useState(null);
  const [informeHistorico, setInformeHistorico] = useState(null);
  const [periodo, setPeriodo] = useState("todo");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    const recargar = () => {
      Promise.all([
        listarProductos(),
        obtenerInformeVentas({ desde: inicioPeriodo(periodo) }),
        obtenerInformeVentas()
      ])
        .then(([catalogo, ventas, historico]) => {
          if (activo) {
            setProductos(catalogo);
            setInforme(ventas);
            setInformeHistorico(historico);
            setError("");
          }
        })
        .catch((e) => { if (activo) setError(e.message); })
        .finally(() => { if (activo) setCargando(false); });
    };
    const cambioDatos = (evento) => {
      if (["productos", "pedidos"].includes(evento.detail?.tipo)) recargar();
    };
    const cambioStorage = (evento) => {
      if ([CLAVES.productos, CLAVES.pedidos].includes(evento.key)) recargar();
    };
    setCargando(true);
    recargar();
    window.addEventListener(EVENTO_DATOS, cambioDatos);
    window.addEventListener("storage", cambioStorage);
    return () => {
      activo = false;
      window.removeEventListener(EVENTO_DATOS, cambioDatos);
      window.removeEventListener("storage", cambioStorage);
    };
  }, [periodo]);

  function descargarInforme(informeDescarga, nombreArchivo) {
    if (!informeDescarga) return;
    const filas = [["Pedido", "Fecha", "Cliente", "Código", "Producto", "Cantidad", "Precio normal", "Oferta", "Ahorro", "Subtotal"]];
    for (const pedido of informeDescarga.pedidos) {
      for (const item of pedido.items) {
        filas.push([pedido.id, pedido.fecha.slice(0, 10), pedido.clienteNombre,
          item.codigo, item.nombre, item.cantidad, item.precioUnitario, item.oferta || "", item.descuento || 0, item.subtotal]);
      }
    }
    const csv = filas.map((fila) => fila.map(celdaCsv).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const mayorVenta = Math.max(1, ...(informe?.ventasPorDia || []).map((dia) => dia.total));

  return (
    <>
      <h1 className="section-title">Dashboard de administración</h1>
      <p>Bienvenido/a, {usuario?.nombre}. Ventas de demostración registradas en este navegador.</p>
      {error && <p role="alert" className="text-danger">{error}</p>}
      {cargando && <Spinner animation="border" role="status" />}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}><Card body className="h-100"><h2 className="h6">Productos registrados</h2><strong className="display-6">{productos.length}</strong></Card></Col>
        <Col sm={6} lg={3}><Card body className="h-100"><h2 className="h6">Stock crítico</h2><strong className="display-6">{productos.filter((p) => p.stock <= p.stockCritico).length}</strong></Card></Col>
        <Col sm={6} lg={3}><Card body className="h-100"><h2 className="h6">Pedidos históricos</h2><strong className="display-6">{informeHistorico?.cantidadPedidos ?? 0}</strong></Card></Col>
        <Col sm={6} lg={3}><Card body className="h-100"><h2 className="h6">Ventas acumuladas</h2><strong className="h3">{formatearPrecio(informeHistorico?.totalVentas || 0)}</strong></Card></Col>
      </Row>

      <section className="mb-5" aria-labelledby="ventas-historicas-titulo">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h2 id="ventas-historicas-titulo" className="h4 mb-1">Historial completo de ventas</h2>
            <p className="text-muted small mb-0">Incluye todos los pedidos registrados desde el inicio. No depende del filtro por período.</p>
          </div>
          <Button
            variant="outline-info"
            disabled={!informeHistorico || informeHistorico.cantidadPedidos === 0}
            onClick={() => descargarInforme(informeHistorico, "glowlab-historial-completo-ventas.csv")}
          >
            <i className="bi bi-download me-2" />Descargar todas las ventas
          </Button>
        </div>
        <Row className="g-3 mb-3">
          <Col sm={6} lg={4}>
            <Card body className="h-100">
              <h3 className="h6">Total vendido históricamente</h3>
              <strong className="h2">{formatearPrecio(informeHistorico?.totalVentas || 0)}</strong>
            </Card>
          </Col>
          <Col sm={6} lg={4}>
            <Card body className="h-100">
              <h3 className="h6">Pedidos registrados</h3>
              <strong className="h2">{informeHistorico?.cantidadPedidos ?? 0}</strong>
            </Card>
          </Col>
          <Col sm={6} lg={4}>
            <Card body className="h-100">
              <h3 className="h6">Unidades vendidas</h3>
              <strong className="h2">{informeHistorico?.unidadesVendidas ?? 0}</strong>
            </Card>
          </Col>
        </Row>
        {!informeHistorico || informeHistorico.cantidadPedidos === 0 ? (
          <Card body>Aún no hay ventas registradas en el historial.</Card>
        ) : (
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr><th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Unidades</th><th>Total de la venta</th></tr>
            </thead>
            <tbody>
              {informeHistorico.pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{new Date(pedido.fecha).toLocaleDateString("es-CL")}</td>
                  <td>{pedido.clienteNombre}</td>
                  <td>{pedido.unidades ?? pedido.items.reduce((suma, item) => suma + item.cantidad, 0)}</td>
                  <td className="fw-semibold">{formatearPrecio(pedido.total)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 my-4">
        <div>
          <h2 className="h4 mb-1">Informe de ventas</h2>
          <p className="text-muted small mb-0">Los totales se calculan a partir de las compras registradas.</p>
        </div>
        <div className="d-flex flex-wrap align-items-end gap-2">
          <Form.Group>
            <Form.Label>Período del informe</Form.Label>
            <Form.Select aria-label="Período de ventas" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              <option value="todo">Todas las fechas</option>
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
            </Form.Select>
          </Form.Group>
          <Button variant="outline-info" disabled={!informe || informe.cantidadPedidos === 0}
            onClick={() => descargarInforme(informe, "glowlab-informe-ventas-" + periodo + ".csv")}>
            <i className="bi bi-download me-2" />Descargar informe CSV
          </Button>
        </div>
      </div>

      {informe && (
        <>
          <Row className="g-3 mb-4">
            <Col md={6}><Card body><h3 className="h6">Unidades vendidas</h3><strong className="h2">{informe.unidadesVendidas}</strong></Card></Col>
            <Col md={6}><Card body><h3 className="h6">Promedio por pedido</h3><strong className="h2">{formatearPrecio(informe.ticketPromedio)}</strong></Card></Col>
          </Row>
          {informe.cantidadPedidos === 0 ? (
            <Card body className="mb-4">
              No hay ventas simuladas en este período. Para generar un informe, inicia sesión con una cuenta, agrega productos y confirma una compra.
            </Card>
          ) : (
            <>
              <Row className="g-4 mb-4">
                <Col lg={6}>
                  <Card className="h-100"><Card.Body>
                    <h3 className="h5">Ventas por día</h3>
                    {informe.ventasPorDia.slice().reverse().map((dia) => (
                      <div key={dia.fecha} className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span>{dia.fecha}</span><strong>{formatearPrecio(dia.total)}</strong>
                        </div>
                        <ProgressBar now={(dia.total / mayorVenta) * 100} variant="info" />
                      </div>
                    ))}
                  </Card.Body></Card>
                </Col>
                <Col lg={6}>
                  <Card className="h-100"><Card.Body>
                    <h3 className="h5">Productos más vendidos</h3>
                    <Table responsive size="sm">
                      <thead><tr><th>Producto</th><th>Unidades</th><th>Total</th></tr></thead>
                      <tbody>{informe.productosMasVendidos.slice(0, 5).map((p) => (
                        <tr key={p.codigo}><td>{p.nombre}</td><td>{p.unidades}</td><td>{formatearPrecio(p.total)}</td></tr>
                      ))}</tbody>
                    </Table>
                  </Card.Body></Card>
                </Col>
              </Row>
              <h3 className="h5">Últimos pedidos</h3>
              <Table striped responsive size="sm">
                <thead><tr><th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Unidades</th><th>Total</th></tr></thead>
                <tbody>{informe.pedidos.slice(0, 10).map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td><td>{new Date(pedido.fecha).toLocaleDateString("es-CL")}</td>
                    <td>{pedido.clienteNombre}</td><td>{pedido.unidades}</td><td>{formatearPrecio(pedido.total)}</td>
                  </tr>
                ))}</tbody>
              </Table>
            </>
          )}
        </>
      )}
      <p className="mt-4"><Link to="/admin/productos">Gestionar catálogo</Link></p>
    </>
  );
}
