import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { actualizarProducto, crearProducto, obtenerProducto } from "../../api/productosApi";
import { crearCategoria, listarCategorias } from "../../api/masterDataApi";
import { mostrarError, mostrarErrores, mostrarExito } from "../../utils/swal";
import { validarDatosProducto } from "../../utils/validaciones";

const INICIAL = { codigo: "", nombre: "", descripcion: "", precio: "", stock: "", stockCritico: "", categoriaId: "", imagen: "", estado: "Activo", ofertaTipo: "ninguna", descuentoPorcentaje: 0 };

export default function AdminProductoForm() {
  const { codigo } = useParams();
  const [datos, setDatos] = useState(INICIAL);
  const [categorias, setCategorias] = useState([]);
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [creandoCategoria, setCreandoCategoria] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    listarCategorias().then(setCategorias).catch((e) => mostrarError(e.message));
  }, []);
  useEffect(() => {
    if (codigo) obtenerProducto(codigo).then(setDatos).catch((e) => mostrarError(e.message));
  }, [codigo]);

  const cambiar = (campo) => (e) => setDatos((antes) => ({ ...antes, [campo]: e.target.value }));

  function cambiarCategoria(e) {
    if (e.target.value === "__crear__") {
      setMostrarNuevaCategoria(true);
      return;
    }
    setDatos((antes) => ({ ...antes, categoriaId: e.target.value }));
  }

  async function guardarCategoria() {
    if (creandoCategoria) return;
    setCreandoCategoria(true);
    try {
      const categoria = await crearCategoria(nuevaCategoria);
      setCategorias((anteriores) => [...anteriores, categoria]);
      setDatos((anteriores) => ({ ...anteriores, categoriaId: String(categoria.id) }));
      setNuevaCategoria("");
      setMostrarNuevaCategoria(false);
      await mostrarExito("Categoría creada", "La categoría " + categoria.nombre + " ya está disponible para este producto.");
    } catch (error) {
      await mostrarError(error.message);
    } finally {
      setCreandoCategoria(false);
    }
  }

  async function guardar(e) {
    e.preventDefault();
    const errores = validarDatosProducto(datos);
    if (errores.length) { await mostrarErrores(errores); return; }
    if (!categorias.some((c) => c.id === Number(datos.categoriaId))) {
      await mostrarError("La categoría seleccionada no existe.");
      return;
    }
    const producto = {
      ...datos,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      stockCritico: Number(datos.stockCritico),
      categoriaId: Number(datos.categoriaId)
    };
    try {
      if (codigo) await actualizarProducto(codigo, producto);
      else await crearProducto(producto);
      await mostrarExito("Guardado", codigo ? "Producto actualizado correctamente." : "Producto creado correctamente.");
      navigate("/admin/productos");
    } catch (error) {
      mostrarError(error.message);
    }
  }

  return (
    <>
      <h1 className="h3 mb-4">{codigo ? "Editar producto" : "Crear producto"}</h1>
      <Form onSubmit={guardar} noValidate>
        <Row className="g-3">
          {[["codigo", "Código"], ["nombre", "Nombre"], ["descripcion", "Descripción"], ["precio", "Precio"], ["stock", "Stock"], ["stockCritico", "Stock crítico"], ["imagen", "Imagen (ruta desde static/img)"]].map(([campo, etiqueta]) => (
            <Col md={campo === "descripcion" ? 12 : 6} key={campo}>
              <Form.Label htmlFor={"producto-" + campo}>{etiqueta}</Form.Label>
              <Form.Control
                id={"producto-" + campo}
                as={campo === "descripcion" ? "textarea" : "input"}
                rows={campo === "descripcion" ? 3 : undefined}
                disabled={campo === "codigo" && Boolean(codigo)}
                type={["precio", "stock", "stockCritico"].includes(campo) ? "number" : "text"}
                min={campo === "precio" ? 1 : ["stock", "stockCritico"].includes(campo) ? 0 : undefined}
                step={["precio", "stock", "stockCritico"].includes(campo) ? 1 : undefined}
                inputMode={["precio", "stock", "stockCritico"].includes(campo) ? "numeric" : undefined}
                required={campo !== "imagen"}
                value={datos[campo]}
                onChange={cambiar(campo)}
              />
            </Col>
          ))}

          <Col md={6}>
            <Form.Label htmlFor="producto-categoria">Categoría</Form.Label>
            <Form.Select id="producto-categoria" aria-label="Categoría" required value={datos.categoriaId} onChange={cambiarCategoria}>
              <option value="">Seleccionar</option>
              {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}
              <option value="__crear__">+ Crear nueva categoría</option>
            </Form.Select>
          </Col>

          {mostrarNuevaCategoria && (
            <Col md={12}>
              <Form.Label htmlFor="producto-nueva-categoria">Nombre de la nueva categoría</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                <Form.Control
                  id="producto-nueva-categoria"
                  className="flex-grow-1"
                  style={{ minWidth: 220 }}
                  maxLength={50}
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  placeholder="Ej.: Kits de cuidado facial"
                />
                <Button type="button" className="btn-glow" onClick={guardarCategoria} disabled={creandoCategoria}>
                  {creandoCategoria ? "Creando…" : "Crear categoría"}
                </Button>
                <Button type="button" variant="outline-secondary" onClick={() => { setMostrarNuevaCategoria(false); setNuevaCategoria(""); }}>
                  Cancelar
                </Button>
              </div>
              <Form.Text>La categoría se guardará y quedará seleccionada para este producto.</Form.Text>
            </Col>
          )}

          <Col md={6}>
            <Form.Label>Estado</Form.Label>
            <Form.Select aria-label="Estado" value={datos.estado} onChange={cambiar("estado")}>
              <option>Activo</option><option>Inactivo</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Promoción del producto</Form.Label>
            <Form.Select aria-label="Tipo de oferta" value={datos.ofertaTipo || "ninguna"} onChange={(e) =>
              setDatos((anterior) => ({
                ...anterior,
                ofertaTipo: e.target.value,
                descuentoPorcentaje: e.target.value === "porcentaje" ? (Number(anterior.descuentoPorcentaje) || 20) : 0
              }))
            }>
              <option value="ninguna">Sin oferta</option>
              <option value="2x1">2x1 (lleva dos y paga uno)</option>
              <option value="porcentaje">Descuento porcentual</option>
            </Form.Select>
          </Col>
          {datos.ofertaTipo === "porcentaje" && (
            <Col md={6}>
              <Form.Label>Descuento (%)</Form.Label>
              <Form.Control aria-label="Porcentaje de descuento" type="number" min={1} max={90} step={1} required
                value={datos.descuentoPorcentaje} onChange={cambiar("descuentoPorcentaje")} />
            </Col>
          )}
        </Row>
        <Button className="btn-glow mt-4" type="submit">Guardar producto</Button>
      </Form>
    </>
  );
}
