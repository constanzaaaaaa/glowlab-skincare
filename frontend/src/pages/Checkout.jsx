import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { listarComunas, listarRegiones } from "../api/masterDataApi";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { calcularTotalProducto, formatearPrecio } from "../utils/format";
import { mostrarError, mostrarErrores } from "../utils/swal";
import { validarDatosEntrega } from "../utils/validaciones";

const INICIAL = {
  nombre: "", apellidos: "", correo: "", telefono: "",
  direccion: "", departamento: "", regionId: "", comunaId: "", referencia: ""
};

export default function Checkout() {
  const { usuario } = useAuth();
  const { items, total, cargando, finalizarCompra } = useCart();
  const [datos, setDatos] = useState(INICIAL);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [cargandoRegiones, setCargandoRegiones] = useState(true);
  const [errorCatalogos, setErrorCatalogos] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    listarRegiones()
      .then(setRegiones)
      .catch((error) => setErrorCatalogos(error.message))
      .finally(() => setCargandoRegiones(false));
  }, []);

  useEffect(() => {
    if (!usuario) return;
    setDatos((actuales) => ({
      ...actuales,
      nombre: actuales.nombre || usuario.nombre || "",
      apellidos: actuales.apellidos || usuario.apellidos || "",
      correo: actuales.correo || usuario.correo || "",
      direccion: actuales.direccion || usuario.direccion || "",
      regionId: actuales.regionId || (usuario.regionId ? String(usuario.regionId) : ""),
      comunaId: actuales.comunaId || (usuario.comunaId ? String(usuario.comunaId) : "")
    }));
  }, [usuario]);

  useEffect(() => {
    let activo = true;
    if (!datos.regionId) {
      setComunas([]);
      return () => { activo = false; };
    }
    listarComunas(datos.regionId)
      .then((lista) => { if (activo) setComunas(lista); })
      .catch((error) => { if (activo) setErrorCatalogos(error.message); });
    return () => { activo = false; };
  }, [datos.regionId]);

  const cambiar = (campo) => (e) => setDatos((actuales) => ({ ...actuales, [campo]: e.target.value }));

  async function confirmarPedido(e) {
    e.preventDefault();
    if (enviando) return;
    const errores = validarDatosEntrega(datos);
    if (errores.length) {
      await mostrarErrores(errores);
      return;
    }
    if (!comunas.some((comuna) => comuna.id === Number(datos.comunaId))) {
      await mostrarError("La comuna elegida no corresponde a la región de despacho.");
      return;
    }

    setEnviando(true);
    try {
      const pedido = await finalizarCompra(datos);
      if (pedido?.ok) navigate("/mis-compras");
    } catch (error) {
      await mostrarError(error.message);
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) return <Container className="py-5"><p role="status">Cargando carrito…</p></Container>;
  if (items.length === 0) {
    return (
      <Container className="py-5">
        <h1 className="section-title">Finalizar compra</h1>
        <Alert variant="light" className="mt-4">Tu carrito está vacío. <Link to="/productos">Volver al catálogo</Link></Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/carrito">← Volver al carrito</Link>
      <h1 className="section-title mt-3">Datos de despacho</h1>
      <p className="text-muted mb-4">Completa los datos de la persona que recibirá el pedido y la dirección de entrega.</p>
      {errorCatalogos && <Alert variant="danger" role="alert">{errorCatalogos}</Alert>}

      <Row className="g-4 align-items-start">
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Form onSubmit={confirmarPedido} noValidate>
                <h2 className="h5 mb-3">Información de contacto</h2>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label htmlFor="checkout-nombre">Nombre de quien recibe</Form.Label>
                    <Form.Control id="checkout-nombre" value={datos.nombre} onChange={cambiar("nombre")} maxLength={50} required />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="checkout-apellidos">Apellidos</Form.Label>
                    <Form.Control id="checkout-apellidos" value={datos.apellidos} onChange={cambiar("apellidos")} maxLength={100} required />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="checkout-correo">Correo electrónico</Form.Label>
                    <Form.Control id="checkout-correo" type="email" value={datos.correo} onChange={cambiar("correo")} maxLength={100} required />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="checkout-telefono">Teléfono de contacto</Form.Label>
                    <Form.Control id="checkout-telefono" type="tel" inputMode="tel" placeholder="912345678" value={datos.telefono} onChange={cambiar("telefono")} required />
                    <Form.Text>Ingresa un celular chileno de 9 dígitos; también puedes incluir +56.</Form.Text>
                  </Col>
                </Row>

                <h2 className="h5 mt-4 mb-3">Dirección de entrega</h2>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Label htmlFor="checkout-direccion">Calle y número</Form.Label>
                    <Form.Control id="checkout-direccion" value={datos.direccion} onChange={cambiar("direccion")} maxLength={200} placeholder="Ej.: Av. Providencia 1234" required />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="checkout-departamento">Departamento, casa u oficina (opcional)</Form.Label>
                    <Form.Control id="checkout-departamento" value={datos.departamento} onChange={cambiar("departamento")} maxLength={50} />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="checkout-region">Región</Form.Label>
                    <Form.Select id="checkout-region" value={datos.regionId} onChange={(e) =>
                      setDatos((actuales) => ({ ...actuales, regionId: e.target.value, comunaId: "" }))
                    } required disabled={cargandoRegiones}>
                      <option value="">Seleccionar región</option>
                      {regiones.map((region) => <option key={region.id} value={region.id}>{region.nombre}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="checkout-comuna">Comuna</Form.Label>
                    <Form.Select id="checkout-comuna" value={datos.comunaId} onChange={cambiar("comunaId")} required disabled={!datos.regionId}>
                      <option value="">Seleccionar comuna</option>
                      {comunas.map((comuna) => <option key={comuna.id} value={comuna.id}>{comuna.nombre}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={12}>
                    <Form.Label htmlFor="checkout-referencia">Referencia para encontrar la dirección (opcional)</Form.Label>
                    <Form.Control id="checkout-referencia" as="textarea" rows={2} value={datos.referencia} onChange={cambiar("referencia")} maxLength={300} placeholder="Ej.: casa esquina, portón negro, conserjería…" />
                  </Col>
                </Row>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Button type="submit" className="btn-glow" disabled={enviando || Boolean(errorCatalogos)}>
                    {enviando ? "Registrando pedido…" : "Confirmar pedido"}
                  </Button>
                  <Button type="button" variant="outline-secondary" onClick={() => navigate("/carrito")} disabled={enviando}>Volver al carrito</Button>
                </div>
                <p className="small text-muted mt-3 mb-0">
                  La confirmación registra el pedido y sus datos de despacho. No se realiza un cobro en línea.
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h2 className="h5 mb-3">Resumen de tu pedido</h2>
              {items.map((item) => {
                const calculo = calcularTotalProducto(item.producto, item.cantidad);
                return (
                  <div className="d-flex justify-content-between gap-3 border-bottom py-2" key={item.codigo}>
                    <div>
                      <strong>{item.producto.nombre}</strong>
                      <div className="small text-muted">Cantidad: {item.cantidad}</div>
                    </div>
                    <div className="text-end">
                      <strong>{formatearPrecio(calculo.subtotal)}</strong>
                      {calculo.ahorro > 0 && <div className="small text-success">Ahorro {formatearPrecio(calculo.ahorro)}</div>}
                    </div>
                  </div>
                );
              })}
              <div className="d-flex justify-content-between mt-3">
                <span className="fw-semibold">Total del pedido</span>
                <strong className="fs-5">{formatearPrecio(total)}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
