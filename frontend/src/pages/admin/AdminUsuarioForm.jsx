import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { listarRegiones, listarComunas, listarRoles } from "../../api/masterDataApi";
import { actualizarUsuario, crearUsuario, obtenerUsuario } from "../../api/usuariosApi";
import { mostrarError, mostrarErrores, mostrarExito, mostrarInfo } from "../../utils/swal";
import { validarCorreo, validarDatosUsuario } from "../../utils/validaciones";

const INICIAL = { run: "", nombre: "", apellidos: "", correo: "", fechaNacimiento: "", rolId: 3, regionId: "", comunaId: "", direccion: "", estado: "Activo" };

export default function AdminUsuarioForm() {
  const { run } = useParams();
  const [datos, setDatos] = useState(INICIAL);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listarRegiones().then(setRegiones).catch(() => {});
    listarRoles().then(setRoles).catch(() => {});
  }, []);
  useEffect(() => {
    if (run) obtenerUsuario(run).then(setDatos).catch((e) => mostrarError(e.message));
  }, [run]);
  useEffect(() => {
    if (datos.regionId) listarComunas(datos.regionId).then(setComunas).catch(() => setComunas([]));
    else setComunas([]);
  }, [datos.regionId]);

  const cambiar = (campo) => (e) => setDatos((antes) => ({ ...antes, [campo]: e.target.value }));

  async function solicitarRecuperacion() {
    const correo = datos.correo?.trim();
    if (!correo) {
      await mostrarError("Primero ingresa el correo electrónico del usuario.");
      return;
    }
    if (!validarCorreo(correo)) {
      await mostrarError("El correo debe terminar exactamente en @gmail.com o @duocuc.cl.");
      return;
    }
    await mostrarInfo("Recuperación de contraseña", "Solicitud preparada para el correo " + correo + ".");
  }

  async function guardar(e) {
    e.preventDefault();
    const errores = validarDatosUsuario(datos, { edicion: Boolean(run), administrador: true, omitirPassword: true });
    if (errores.length) { await mostrarErrores(errores); return; }
    if (!comunas.some((c) => c.id === Number(datos.comunaId))) {
      await mostrarError("La comuna elegida no corresponde a la región seleccionada.");
      return;
    }
    const usuario = { ...datos, rolId: Number(datos.rolId), regionId: Number(datos.regionId), comunaId: Number(datos.comunaId) };
    try {
      if (run) await actualizarUsuario(run, usuario);
      else await crearUsuario(usuario);
      await mostrarExito("Guardado", "Usuario guardado correctamente.");
      navigate("/admin/usuarios");
    } catch (error) {
      mostrarError(error.message);
    }
  }

  return (
    <>
      <h1 className="h3 mb-4">{run ? "Editar usuario" : "Crear usuario"}</h1>
      <Form onSubmit={guardar} noValidate>
        <Row className="g-3">
          {[["run", "RUN con dígito verificador (sin puntos ni guion)"], ["nombre", "Nombre"], ["apellidos", "Apellidos"], ["correo", "Correo"],
            ["fechaNacimiento", "Fecha nacimiento"], ["direccion", "Dirección"]].map(([campo, etiqueta]) => (
            <Col md={6} key={campo}>
              <Form.Label htmlFor={"usuario-" + campo}>{etiqueta}</Form.Label>
              <Form.Control id={"usuario-" + campo} value={datos[campo] || ""} onChange={cambiar(campo)}
                type={campo === "correo" ? "email" : campo === "fechaNacimiento" ? "date" : "text"}
                disabled={campo === "run" && Boolean(run)} required={campo !== "fechaNacimiento"} />
            </Col>
          ))}
          <Col md={6}>
            <Form.Label>Región</Form.Label>
            <Form.Select aria-label="Región" value={datos.regionId} onChange={(e) =>
              setDatos((antes) => ({ ...antes, regionId: e.target.value, comunaId: "" }))
            } required>
              <option value="">Seleccionar</option>
              {regiones.map((region) => <option key={region.id} value={region.id}>{region.nombre}</option>)}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Comuna</Form.Label>
            <Form.Select aria-label="Comuna" value={datos.comunaId} onChange={cambiar("comunaId")} required>
              <option value="">Seleccionar</option>
              {comunas.map((comuna) => <option key={comuna.id} value={comuna.id}>{comuna.nombre}</option>)}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Rol</Form.Label>
            <Form.Select aria-label="Rol" value={datos.rolId} onChange={cambiar("rolId")}>
              {roles.map((rol) => <option key={rol.id} value={rol.id}>{rol.nombre}</option>)}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Estado</Form.Label>
            <Form.Select aria-label="Estado" value={datos.estado} onChange={cambiar("estado")}>
              <option>Activo</option><option>Inactivo</option>
            </Form.Select>
          </Col>
          <Col md={12}>
            <div className="border-top pt-3 mt-2">
              <Form.Label className="fw-semibold">Contraseña</Form.Label>
              <div>
                <Button type="button" variant="outline-info" onClick={solicitarRecuperacion}>
                  <i className="bi bi-envelope-lock me-2" />Enviar código al correo
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <div className="mt-4">
          <Button type="submit" className="btn-glow">Guardar usuario</Button>
        </div>
      </Form>
    </>
  );
}
