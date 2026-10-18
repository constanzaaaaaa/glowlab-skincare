import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { mostrarError, mostrarExito } from "../utils/swal";
import { validarCorreo, validarPassword } from "../utils/validaciones";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function enviar(e) {
    e.preventDefault();
    if (!validarCorreo(correo) || !validarPassword(password)) {
      mostrarError("Revisa el correo y la contraseña.");
      return;
    }
    setOcupado(true);
    try {
      const usuario = await login(correo, password);
      await mostrarExito("Bienvenido", "Inicio de sesión correcto.");
      navigate(usuario.rolId === 1 || usuario.rolId === 2 ? "/admin" : "/");
    } catch (error) { mostrarError(error.message); }
    finally { setOcupado(false); }
  }

  return (
    <Container className="py-5" style={{ maxWidth: 540 }}>
      <Card className="p-4"><h1 className="h3">Iniciar sesión</h1>
        <Form onSubmit={enviar}>
          <Form.Group className="my-3"><Form.Label>Correo</Form.Label><Form.Control aria-label="Correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required /></Form.Group>
          <Form.Group className="my-3"><Form.Label>Contraseña</Form.Label><Form.Control aria-label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Form.Group>
          <Button disabled={ocupado} type="submit" className="btn-glow">Ingresar</Button>
        </Form>
        <p className="mt-3">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </Card>
    </Container>
  );
}
