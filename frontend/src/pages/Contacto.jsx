import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { enviarMensajeContacto } from "../api/contactoApi";
import { mostrarError, mostrarExito } from "../utils/swal";

export default function Contacto() {
  const [datos, setDatos] = useState({ nombre: "", correo: "", mensaje: "" });
  const cambiar = (campo) => (e) => setDatos((anterior) => ({ ...anterior, [campo]: e.target.value }));
  async function enviar(e) {
    e.preventDefault();
    try {
      await enviarMensajeContacto(datos);
      await mostrarExito("Mensaje enviado", "Gracias por contactarnos.");
      setDatos({ nombre: "", correo: "", mensaje: "" });
    } catch (error) { mostrarError(error.message); }
  }
  return <Container className="py-5" style={{ maxWidth: 680 }}>
    <Card className="p-4"><h1 className="h3">Contacto</h1>
      <Form onSubmit={enviar}>
        <Form.Label>Nombre</Form.Label><Form.Control required value={datos.nombre} onChange={cambiar("nombre")} />
        <Form.Label className="mt-3">Correo</Form.Label><Form.Control required type="email" value={datos.correo} onChange={cambiar("correo")} />
        <Form.Label className="mt-3">Mensaje</Form.Label><Form.Control required as="textarea" rows={5} value={datos.mensaje} onChange={cambiar("mensaje")} />
        <Button className="btn-glow mt-4" type="submit">Enviar mensaje</Button>
      </Form>
    </Card>
  </Container>;
}
