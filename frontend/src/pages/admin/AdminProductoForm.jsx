import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { actualizarProducto, crearProducto, obtenerProducto } from "../../api/productosApi";
import { listarCategorias } from "../../api/masterDataApi";
import { mostrarError, mostrarExito } from "../../utils/swal";
import { enteroEnRango, textoRequerido } from "../../utils/validaciones";

const INICIAL = { codigo: "", nombre: "", descripcion: "", precio: "", stock: "", stockCritico: "", categoriaId: "", imagen: "", estado: "Activo" };
export default function AdminProductoForm() {
  const { codigo } = useParams();
  const [datos, setDatos] = useState(INICIAL);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  useEffect(() => { listarCategorias().then(setCategorias).catch((e) => mostrarError(e.message)); }, []);
  useEffect(() => { if (codigo) obtenerProducto(codigo).then(setDatos).catch((e) => mostrarError(e.message)); }, [codigo]);
  const cambiar = (campo) => (e) => setDatos((antes) => ({ ...antes, [campo]: e.target.value }));

  async function guardar(e) {
    e.preventDefault();
    if (!textoRequerido(datos.codigo, 20) || !textoRequerido(datos.nombre, 100) || !textoRequerido(datos.descripcion, 800) ||
      !enteroEnRango(datos.precio, 0) || !enteroEnRango(datos.stock, 0) || !enteroEnRango(datos.stockCritico, 0) || !datos.categoriaId) {
      mostrarError("Revisa los campos obligatorios del producto."); return;
    }
    const producto = { ...datos, precio: Number(datos.precio), stock: Number(datos.stock), stockCritico: Number(datos.stockCritico), categoriaId: Number(datos.categoriaId) };
    try {
      if (codigo) await actualizarProducto(codigo, producto);
      else await crearProducto(producto);
      await mostrarExito("Guardado", "Producto actualizado correctamente.");
      navigate("/admin/productos");
    } catch (error) { mostrarError(error.message); }
  }

  return <><h1 className="h3 mb-4">{codigo ? "Editar producto" : "Crear producto"}</h1>
    <Form onSubmit={guardar}><Row className="g-3">
      {[["codigo", "Código"], ["nombre", "Nombre"], ["descripcion", "Descripción"], ["precio", "Precio"], ["stock", "Stock"], ["stockCritico", "Stock crítico"], ["imagen", "Imagen (ruta desde static/img)"]].map(([campo, etiqueta]) =>
        <Col md={campo === "descripcion" ? 12 : 6} key={campo}>
          <Form.Label htmlFor={"producto-" + campo}>{etiqueta}</Form.Label>
          <Form.Control id={"producto-" + campo} as={campo === "descripcion" ? "textarea" : "input"} rows={campo === "descripcion" ? 3 : undefined}
            disabled={campo === "codigo" && Boolean(codigo)} type={["precio", "stock", "stockCritico"].includes(campo) ? "number" : "text"} required={!["imagen"].includes(campo)} value={datos[campo]} onChange={cambiar(campo)} />
        </Col>)}
      <Col md={6}><Form.Label>Categoría</Form.Label><Form.Select aria-label="Categoría" required value={datos.categoriaId} onChange={cambiar("categoriaId")}>
        <option value="">Seleccionar</option>{categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
      </Form.Select></Col>
      <Col md={6}><Form.Label>Estado</Form.Label><Form.Select aria-label="Estado" value={datos.estado} onChange={cambiar("estado")}><option>Activo</option><option>Inactivo</option></Form.Select></Col>
    </Row><Button className="btn-glow mt-4" type="submit">Guardar producto</Button></Form>
  </>;
}
