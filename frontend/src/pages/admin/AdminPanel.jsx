import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listarProductos } from "../../api/productosApi";
import { useAuth } from "../../hooks/useAuth";

export default function AdminPanel() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => { listarProductos().then(setProductos).catch((e) => setError(e.message)); }, []);

  return (
    <>
      <h1 className="section-title">Panel de administración</h1>
      <p>Bienvenido/a, {usuario?.nombre}.</p>
      {error && <p role="alert" className="text-danger">{error}</p>}
      <Row className="g-3">
        <Col sm={6}><Card body><h2 className="h6">Productos registrados</h2><strong className="display-6">{productos.length}</strong></Card></Col>
        <Col sm={6}><Card body><h2 className="h6">Productos con stock crítico</h2><strong className="display-6">{productos.filter((p) => p.stock <= p.stockCritico).length}</strong></Card></Col>
      </Row>
      <p className="mt-4"><Link to="/admin/productos">Gestionar catálogo</Link></p>
    </>
  );
}
