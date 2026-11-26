import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../../api/productosApi";
import { listarCategorias } from "../../api/masterDataApi";
import { formatearPrecio, etiquetaOferta } from "../../utils/format";
import { useAuth } from "../../hooks/useAuth";

export default function AdminProductoDetalle() {
  const { codigo } = useParams();
  const { esAdmin } = useAuth();
  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    Promise.all([obtenerProducto(codigo), listarCategorias()])
      .then(([p, c]) => { if (activo) { setProducto(p); setCategorias(c); } })
      .catch((e) => { if (activo) setError(e.message); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [codigo]);

  if (cargando) return <p role="status"><Spinner size="sm" animation="border" /> Cargando producto…</p>;
  if (error) return <Alert variant="danger" role="alert">{error}</Alert>;
  if (!producto) return <Alert variant="warning">No se encontró el producto.</Alert>;

  return <div>
    <h1 className="h3 mb-3">Detalle del producto</h1>
    <Card className="shadow-sm">
      <Card.Body>
        <Row className="g-3">
          <Col md={6}><strong>Código:</strong> {producto.codigo}</Col>
          <Col md={6}><strong>Nombre:</strong> {producto.nombre}</Col>
          <Col md={12}><strong>Descripción:</strong> {producto.descripcion}</Col>
          <Col md={6}><strong>Precio:</strong> {formatearPrecio(producto.precio)}</Col>
          <Col md={6}><strong>Stock:</strong> {producto.stock}</Col>
          <Col md={6}><strong>Stock crítico:</strong> {producto.stockCritico}</Col>
          <Col md={6}><strong>Categoría:</strong> {categorias.find((c) => c.id === producto.categoriaId)?.nombre || "Sin categoría"}</Col>
          <Col md={6}><strong>Estado:</strong> {producto.estado}</Col>
          <Col md={6}><strong>Promoción:</strong> {etiquetaOferta(producto) || "Sin oferta"}</Col>
        </Row>
      </Card.Body>
    </Card>
    <div className="d-flex gap-2 mt-3">
      <Button as={Link} to="/admin/productos" variant="outline-secondary">Volver al listado</Button>
      {esAdmin && <Button as={Link} to={"/admin/productos/editar/" + codigo} className="btn-glow">Editar producto</Button>}
    </div>
  </div>;
}
