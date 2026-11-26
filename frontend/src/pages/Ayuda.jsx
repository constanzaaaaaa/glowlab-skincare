import { Accordion, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const preguntas = [
  {
    titulo: "¿Cómo puedo encontrar un producto?",
    respuesta: <>Entra al <Link to="/productos">catálogo</Link> y utiliza el buscador o el filtro por categoría. También puedes visitar la sección de <Link to="/ofertas">ofertas</Link>.</>
  },
  {
    titulo: "¿Cómo funcionan las promociones 2x1 y los descuentos?",
    respuesta: <>En un 2x1 de un mismo producto, llevas dos unidades y pagas una; si llevas tres, pagas dos. Los descuentos porcentuales se aplican automáticamente al carrito. Revisa nuestras <Link to="/ofertas">ofertas disponibles</Link>.</>
  },
  {
    titulo: "¿Necesito una cuenta para confirmar una compra?",
    respuesta: <>Sí. Puedes <Link to="/registro">registrarte</Link> o <Link to="/login">iniciar sesión</Link> antes de confirmar tu carrito. Las compras se simulan para la demostración de GlowLab; no se realizan cobros reales.</>
  },
  {
    titulo: "¿Dónde puedo revisar mis compras?",
    respuesta: <>Después de iniciar sesión, entra a <Link to="/mis-compras">Mis compras</Link>. Allí verás la fecha, los productos y el total de cada pedido simulado registrado desde ese navegador.</>
  },
  {
    titulo: "¿Realizan envíos o pagos en línea?",
    respuesta: <>Por ahora GlowLab funciona como tienda de demostración. No procesa pagos ni gestiona envíos reales.</>
  },
  {
    titulo: "¿Cómo me pongo en contacto?",
    respuesta: <>Puedes enviarnos un mensaje utilizando el <Link to="/contacto">formulario de contacto</Link> de GlowLab. En esta versión demostrativa, los mensajes se guardan localmente en el navegador.</>
  }
];

export default function Ayuda() {
  return (
    <Container className="py-5" style={{ maxWidth: 940 }}>
      <h1 className="section-title">Centro de ayuda</h1>
      <p className="text-muted mb-4">
        Encuentra respuestas sobre productos, ofertas, cuentas y compras en GlowLab Skincare.
      </p>
      <h2 className="h4 mb-3">Preguntas frecuentes</h2>
      <Accordion alwaysOpen>
        {preguntas.map((pregunta, indice) => (
          <Accordion.Item eventKey={String(indice)} key={pregunta.titulo}>
            <Accordion.Header>{pregunta.titulo}</Accordion.Header>
            <Accordion.Body>{pregunta.respuesta}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <div className="mt-4 p-4 rounded" style={{ backgroundColor: "#f1fbfc" }}>
        <h2 className="h5">¿Necesitas otra información?</h2>
        <p className="mb-2">Visita nuestra sección de contacto para dejarnos tu consulta.</p>
        <Link className="btn btn-glow" to="/contacto">Ir a contacto</Link>
      </div>
    </Container>
  );
}
