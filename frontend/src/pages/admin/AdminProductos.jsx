import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { eliminarProducto, listarProductos } from "../../api/productosApi";
import DataTable from "../../components/common/DataTable";
import { formatearPrecio } from "../../utils/format";
import { confirmarAccion, mostrarError, mostrarExito } from "../../utils/swal";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const cargar = () => listarProductos().then(setProductos).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  async function borrar(codigo) {
    if (!await confirmarAccion({ titulo: "¿Eliminar producto?", texto: codigo, confirmButtonText: "Eliminar" })) return;
    try { await eliminarProducto(codigo); await cargar(); await mostrarExito("Producto eliminado", codigo); }
    catch (e) { mostrarError(e.message); }
  }

  return <>
    <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
      <h1 className="h3">Productos</h1>
      <Button as={Link} to="/admin/productos/nuevo" className="btn-glow">Nuevo producto</Button>
    </div>
    {error && <p role="alert" className="text-danger">{error}</p>}
    <DataTable datos={productos} clave="codigo" columnas={[
      { campo: "codigo", titulo: "Código" }, { campo: "nombre", titulo: "Nombre" },
      { campo: "precio", titulo: "Precio", render: (p) => formatearPrecio(p.precio) },
      { campo: "stock", titulo: "Stock" }, { campo: "estado", titulo: "Estado" }
    ]} acciones={(p) => <>
      <Button as={Link} to={"/admin/productos/editar/" + p.codigo} size="sm" variant="outline-primary" className="me-2">Editar</Button>
      <Button size="sm" variant="outline-danger" onClick={() => borrar(p.codigo)}>Eliminar</Button>
    </>} />
  </>;
}
