// 📄 PÁGINA: obtiene los datos y entrega el catálogo al organismo.
// Conserva la separación pages/ + componentes del ejemplo 033.
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { listarCategorias } from "../api/masterDataApi";
import { listarProductos } from "../api/productosApi";
import ListaProductos from "../components/organisms/ListaProductos.jsx";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listarProductos().then(setProductos).catch((e) => setError(e.message));
    listarCategorias().then(setCategorias).catch((e) => setError(e.message));
  }, []);

  return (
    <Container className="py-5">
      <h1 className="section-title">Catálogo de skincare</h1>
      {error && <p className="text-danger" role="alert">{error}</p>}
      <ListaProductos productos={productos} categorias={categorias} />
    </Container>
  );
}
