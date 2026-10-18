import { useEffect, useState } from "react";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { listarComunas, listarRegiones } from "../api/masterDataApi";
import { useAuth } from "../hooks/useAuth";
import { mostrarError, mostrarExito } from "../utils/swal";
import { textoRequerido, validarCorreo, validarPassword, validarRun } from "../utils/validaciones";

const INICIAL = { run: "", nombre: "", apellidos: "", correo: "", password: "", fechaNacimiento: "", regionId: "", comunaId: "", direccion: "" };
export default function Registro() {
  const [datos, setDatos] = useState(INICIAL);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const { registro } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { listarRegiones().then(setRegiones).catch(() => setRegiones([])); }, []);
  useEffect(() => {
    if (!datos.regionId) { setComunas([]); return; }
    listarComunas(datos.regionId).then(setComunas).catch(() => setComunas([]));
  }, [datos.regionId]);
  const cambiar = (campo) => (e) => setDatos((anterior) => ({ ...anterior, [campo]: e.target.value }));

  async function enviar(e) {
    e.preventDefault();
    if (!validarRun(datos.run) || !textoRequerido(datos.nombre, 50) || !textoRequerido(datos.apellidos, 100) ||
      !validarCorreo(datos.correo) || !validarPassword(datos.password) || !datos.regionId || !datos.comunaId || !textoRequerido(datos.direccion, 300)) {
      mostrarError("Revisa los campos del formulario (RUN sin puntos ni guion).");
      return;
    }
    try {
      await registro({ ...datos, regionId: Number(datos.regionId), comunaId: Number(datos.comunaId) });
      await mostrarExito("Registro correcto", "Ya puedes iniciar sesión.");
      navigate("/login");
    } catch (error) { mostrarError(error.message); }
  }
  return (
    <Container className="py-5" style={{ maxWidth: 820 }}>
      <Card className="p-4"><h1 className="h3">Crear cuenta GlowLab</h1>
        <Form onSubmit={enviar}>
          <Row className="g-3">
            {[
              ["run", "RUN (sin puntos ni guion)"], ["nombre", "Nombre"], ["apellidos", "Apellidos"],
              ["correo", "Correo electrónico"], ["password", "Contraseña (4 a 10 caracteres)"],
              ["fechaNacimiento", "Fecha de nacimiento"]
            ].map(([campo, etiqueta]) =>
              <Col md={6} key={campo}><Form.Label htmlFor={"registro-" + campo}>{etiqueta}</Form.Label>
                <Form.Control id={"registro-" + campo} type={campo === "password" ? "password" : campo === "correo" ? "email" : campo === "fechaNacimiento" ? "date" : "text"} required={campo !== "fechaNacimiento"} value={datos[campo]} onChange={cambiar(campo)} />
              </Col>
            )}
            <Col md={6}><Form.Label>Región</Form.Label><Form.Select aria-label="Región" value={datos.regionId} onChange={(e) => setDatos((anterior) => ({ ...anterior, regionId: e.target.value, comunaId: "" }))} required>
              <option value="">Seleccione una región</option>{regiones.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </Form.Select></Col>
            <Col md={6}><Form.Label>Comuna</Form.Label><Form.Select aria-label="Comuna" value={datos.comunaId} onChange={cambiar("comunaId")} required>
              <option value="">Seleccione una comuna</option>{comunas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </Form.Select></Col>
            <Col xs={12}><Form.Label>Dirección</Form.Label><Form.Control aria-label="Dirección" value={datos.direccion} onChange={cambiar("direccion")} required /></Col>
          </Row>
          <Button type="submit" className="btn-glow mt-4">Registrarme</Button>
        </Form>
      </Card>
    </Container>
  );
}
