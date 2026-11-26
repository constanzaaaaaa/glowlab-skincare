import { Container, Card, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { actualizarMiPerfil } from "../api/usuariosApi";
import { mostrarError, mostrarExito } from "../utils/swal";


export default function MiPerfil() {

  // 1. Obtener el usuario que inició sesión
  const { usuario } = useAuth();

  // 2. Variables para guardar temporalmente los datos
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [direccion, setDireccion] = useState("");

  // 3. Cargar los datos del usuario en los campos
  useEffect(() => {
    setNombre(usuario?.nombre || "");
    setApellidos(usuario?.apellidos || "");
    setDireccion(usuario?.direccion || "");
  }, [usuario?.nombre, usuario?.apellidos, usuario?.direccion]);

async function guardarCambios() {
  try {
    await actualizarMiPerfil({
      nombre,
      apellidos,
      direccion
    });

    await mostrarExito(
      "Perfil actualizado",
      "Tus cambios se guardaron correctamente."
    );

  } catch (error) {
    await mostrarError(error.message);
  }
}


  // 4. Mostrar el formulario
  return (
    <Container className="py-5" style={{ maxWidth: 750 }}>

      <h1 className="h3 mb-4">Mi perfil</h1>

      <Card className="p-4">

        <h2 className="h5 mb-3">Datos personales</h2>

        {/* RUN: no se puede modificar */}
        <Form.Label>RUN (no modificable)</Form.Label>
        <Form.Control
          value={usuario?.run || ""}
          disabled
        />

        {/* Nombre */}
        <Form.Label className="mt-3">Nombre</Form.Label>
        <Form.Control
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        {/* Apellidos */}
        <Form.Label className="mt-3">Apellidos</Form.Label>
        <Form.Control
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />

        {/* Dirección */}
        <Form.Label className="mt-3">Dirección</Form.Label>
        <Form.Control
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        
        <Button
    className="btn-glow mt-4"
      onClick={guardarCambios}
            >
     Guardar cambios
     </Button>

      </Card>
    </Container>
  );
}
