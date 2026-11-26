// Página de ofertas: muestra únicamente productos con promociones activas.
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listarProductos } from "../api/productosApi";
import ProductoGrid from "../components/productos/ProductoGrid";
import { esProductoEnOferta } from "../utils/format";
import { CLAVES, EVENTO_DATOS } from "../storage/persistencia";

export default function Ofertas() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    const cargar = () => listarProductos()
      .then((datos) => {
        if (activo) {
          setProductos(datos.filter((producto) => esProductoEnOferta(producto) && producto.stock > 0));
          setError("");
        }
      })
      .catch((e) => { if (activo) setError(e.message); });
    const alCambiar = (evento) => { if (evento.detail?.tipo === "productos") cargar(); };
    const entrePestanas = (evento) => { if (evento.key === CLAVES.productos) cargar(); };
    cargar();
    window.addEventListener(EVENTO_DATOS, alCambiar);
    window.addEventListener("storage", entrePestanas);
    return () => {
      activo = false;
      window.removeEventListener(EVENTO_DATOS, alCambiar);
      window.removeEventListener("storage", entrePestanas);
    };
  }, []);

  return (
    <Container className="py-5">
      <h1 className="section-title">Ofertas especiales GlowLab</h1>
      <p className="text-muted">Aprovecha descuentos y promociones 2x1 en productos seleccionados.</p>
      <p className="small text-success">En el 2x1, agrega dos unidades del mismo producto al carrito: ¡la segunda es gratis!</p>
      {error && <p role="alert" className="text-danger">{error}</p>}
      {!error && <ProductoGrid productos={productos} mensajeVacio="Por ahora no hay productos disponibles en oferta." />}
      <p className="mt-4"><Link to="/productos">Ver todo el catálogo</Link></p>
    </Container>
  );
}
