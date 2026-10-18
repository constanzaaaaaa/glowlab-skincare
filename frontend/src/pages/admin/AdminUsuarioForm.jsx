import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { listarRegiones, listarComunas, listarRoles } from "../../api/masterDataApi";
import { actualizarUsuario, crearUsuario, obtenerUsuario } from "../../api/usuariosApi";
import { mostrarError, mostrarExito } from "../../utils/swal";
import { textoRequerido, validarCorreo, validarPassword, validarRun } from "../../utils/validaciones";

const INICIAL = { run: "", nombre: "", apellidos: "", correo: "", password: "", fechaNacimiento: "", rolId: 3, regionId: "", comunaId: "", direccion: "", estado: "Activo" };
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
  useEffect(() => { if (run) obtenerUsuario(run).then((u) => setDatos({ ...u, password: "" })).catch((e) => mostrarError(e.message)); }, [run]);
  useEffect(() => {
    if (datos.regionId) listarComunas(datos.regionId).then(setComunas).catch(() => setComunas([]));
    else setComunas([]);
  }, [datos.regionId]);
  const cambiar = (campo) => (e) => setDatos((antes) => ({ ...antes, [campo]: e.target.value }));

  async function guardar(e) {
    e.preventDefault();
    if (!validarRun(datos.run) || !textoRequerido(datos.nombre, 50) || !textoRequerido(datos.apellidos, 100) ||
      !validarCorreo(datos.correo) || (!run && !validarPassword(datos.password)) ||
      (run && datos.password && !validarPassword(datos.password)) ||
      !datos.regionId || !datos.comunaId || !textoRequerido(datos.direccion, 300)) {
      mostrarError("Revisa los campos obligatorios."); return;
    }
    const usuario = { ...datos, rolId: Number(datos.rolId), regionId: Number(datos.regionId), comunaId: Number(datos.comunaId) };
    if (run && !usuario.password) delete usuario.password;
    try {
      if (run) await actualizarUsuario(run, usuario);
      else await crearUsuario(usuario);
      await mostrarExito("Guardado", "Usuario guardado correctamente.");
      navigate("/admin/usuarios");
    } catch (error) { mostrarError(error.message); }
  }

  return <><h1 className="h3 mb-4">{run ? "Editar usuario" : "Crear usuario"}</h1>
    <Form onSubmit={guardar}><Row className="g-3">
      {[["run", "RUN"], ["nombre", "Nombre"], ["apellidos", "Apellidos"], ["correo", "Correo"],
        ["password", run ? "Nueva contraseña (opcional)" : "Contraseña"], ["fechaNacimiento", "Fecha nacimiento"],
        ["direccion", "Dirección"]].map(([campo, etiqueta]) =>
        <Col md={6} key={campo}><Form.Label htmlFor={"usuario-" + campo}>{etiqueta}</Form.Label>
          <Form.Control id={"usuario-" + campo} value={datos[campo] || ""} onChange={cambiar(campo)}
            type={campo === "password" ? "password" : campo === "correo" ? "email" : campo === "fechaNacimiento" ? "date" : "text"}
            disabled={campo === "run" && Boolean(run)} required={!["fechaNacimiento"].includes(campo) && (campo !== "password" || !run)} />
        </Col>)}
      <Col md={6}><Form.Label>Región</Form.Label><Form.Select aria-label="Región" value={datos.regionId} onChange={(e) => setDatos((antes) => ({ ...antes, regionId: e.target.value, comunaId: "" }))} required>
        <option value="">Seleccionar</option>{regiones.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
      </Form.Select></Col>
      <Col md={6}><Form.Label>Comuna</Form.Label><Form.Select aria-label="Comuna" value={datos.comunaId} onChange={cambiar("comunaId")} required>
        <option value="">Seleccionar</option>{comunas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
      </Form.Select></Col>
      <Col md={6}><Form.Label>Rol</Form.Label><Form.Select aria-label="Rol" value={datos.rolId} onChange={cambiar("rolId")}>{roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}</Form.Select></Col>
      <Col md={6}><Form.Label>Estado</Form.Label><Form.Select aria-label="Estado" value={datos.estado} onChange={cambiar("estado")}><option>Activo</option><option>Inactivo</option></Form.Select></Col>
    </Row><Button type="submit" className="btn-glow mt-4">Guardar usuario</Button></Form>
  </>;
}
