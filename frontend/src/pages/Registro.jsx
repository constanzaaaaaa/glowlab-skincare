
import { useEffect, useState } from "react";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { listarComunas, listarRegiones } from "../api/masterDataApi";
import { useAuth } from "../hooks/useAuth";
import { mostrarError, mostrarErrores, mostrarExito } from "../utils/swal";
import { validarDatosUsuario } from "../utils/validaciones";

const INICIAL = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  fechaNacimiento: "",
  regionId: "",
  comunaId: "",
  direccion: ""
};

export default function Registro() {
  const [datos, setDatos] = useState(INICIAL);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const { registro } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    listarRegiones()
      .then(setRegiones)
      .catch(() => setRegiones([]));
  }, []);

  useEffect(() => {
    if (!datos.regionId) {
      setComunas([]);
      return;
    }

    listarComunas(datos.regionId)
      .then(setComunas)
      .catch(() => setComunas([]));
  }, [datos.regionId]);

  // Función general para actualizar los campos
  const cambiar = (campo) => (e) => {
    setDatos((anterior) => ({
      ...anterior,
      [campo]: e.target.value
    }));
  };

  // Validación de entrada del RUN
  // Solo números y letra K al final
  const cambiarRun = (e) => {
    const entrada = e.target.value.toUpperCase();

    const numeros = entrada.replace(/\D/g, "").slice(0, 9);

    const permitirK =
      entrada.endsWith("K") &&
      numeros.length >= 6 &&
      numeros.length <= 8;

    const run = numeros + (permitirK ? "K" : "");

    setDatos((anterior) => ({
      ...anterior,
      run: run
    }));
  };

  // NUEVO: permitir solo letras en Nombre y Apellidos
  const cambiarSoloLetras = (campo) => (e) => {
    const texto = e.target.value.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]/g,
      ""
    );

    const limite = campo === "nombre" ? 50 : 100;

    setDatos((anterior) => ({
      ...anterior,
      [campo]: texto.slice(0, limite)
    }));
  };

  // Enviar formulario de registro
  async function enviar(e) {
    e.preventDefault();

    const errores = validarDatosUsuario(datos);

    if (errores.length) {
      await mostrarErrores(errores);
      return;
    }

    if (!comunas.some((c) => c.id === Number(datos.comunaId))) {
      await mostrarError(
        "La comuna elegida no pertenece a la región seleccionada."
      );
      return;
    }

    try {
      await registro({
        ...datos,
        regionId: Number(datos.regionId),
        comunaId: Number(datos.comunaId)
      });

      await mostrarExito(
        "Registro correcto",
        "Ya puedes iniciar sesión."
      );

      navigate("/login");
    } catch (error) {
      mostrarError(error.message);
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: 820 }}>
      <Card className="p-4">
        <h1 className="h3">Crear cuenta GlowLab</h1>

        <Form onSubmit={enviar} noValidate>
          <Row className="g-3">
            {[
              ["run", "RUN con dígito verificador (sin puntos ni guion)"],
              ["nombre", "Nombre"],
              ["apellidos", "Apellidos"],
              ["correo", "Correo electrónico (@gmail.com o @duocuc.cl)"],
              ["password", "Contraseña (4 a 10 caracteres)"],
              ["fechaNacimiento", "Fecha de nacimiento"]
            ].map(([campo, etiqueta]) => (
              <Col md={6} key={campo}>
                <Form.Label htmlFor={"registro-" + campo}>
                  {etiqueta}
                </Form.Label>

                <Form.Control
                  id={"registro-" + campo}
                  type={
                    campo === "password"
                      ? "password"
                      : campo === "correo"
                        ? "email"
                        : campo === "fechaNacimiento"
                          ? "date"
                          : "text"
                  }
                  required={campo !== "fechaNacimiento"}
                  value={datos[campo]}

                  // Límites de caracteres
                  maxLength={
                    campo === "run"
                      ? 9
                      : campo === "nombre"
                        ? 50
                        : campo === "apellidos"
                          ? 100
                          : undefined
                  }

                  // Función según el campo
                  onChange={
                    campo === "run"
                      ? cambiarRun
                      : campo === "nombre" || campo === "apellidos"
                        ? cambiarSoloLetras(campo)
                        : cambiar(campo)
                  }
                />
              </Col>
            ))}

            <Col md={6}>
              <Form.Label>Región</Form.Label>
              <Form.Select
                aria-label="Región"
                value={datos.regionId}
                onChange={(e) =>
                  setDatos((anterior) => ({
                    ...anterior,
                    regionId: e.target.value,
                    comunaId: ""
                  }))
                }
                required
              >
                <option value="">Seleccione una región</option>
                {regiones.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Comuna</Form.Label>
              <Form.Select
                aria-label="Comuna"
                value={datos.comunaId}
                onChange={cambiar("comunaId")}
                required
              >
                <option value="">Seleccione una comuna</option>
                {comunas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12}>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                aria-label="Dirección"
                value={datos.direccion}
                onChange={cambiar("direccion")}
                required
              />
            </Col>
          </Row>

          <Button type="submit" className="btn-glow mt-4">
            Registrarme
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
