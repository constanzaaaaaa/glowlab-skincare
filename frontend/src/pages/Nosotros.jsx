import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const VALORES = [
  { icono: "bi-heart", titulo: "Cuidado consciente", texto: "Promovemos decisiones informadas y rutinas realistas, sin presionar a utilizar más productos de los necesarios." },
  { icono: "bi-info-circle", titulo: "Información clara", texto: "Queremos que cada persona pueda revisar las características, el uso y las condiciones de los productos antes de elegir." },
  { icono: "bi-stars", titulo: "Bienestar cotidiano", texto: "Entendemos el skincare como un hábito de cuidado personal que debe adaptarse a las preferencias y necesidades individuales." }
];

export default function Nosotros() {
  return (
    <Container className="py-5">
      <header className="text-center mx-auto mb-5" style={{ maxWidth: 820 }}>
        <span className="text-uppercase text-info fw-semibold small">Nuestra esencia</span>
        <h1 className="section-title mt-2">Sobre GLOWLAB</h1>
        <p className="lead">Creemos que cuidar tu piel puede ser una experiencia simple, cercana y consciente. Queremos ayudarte a encontrar productos que tengan sentido para tu rutina.</p>
      </header>
      <Row className="align-items-center g-4 mb-5">
        <Col lg={6}><img src="/static/img/about.webp" alt="Cuidado personal y productos de skincare GlowLab" className="img-fluid rounded-4 shadow-sm w-100" /></Col>
        <Col lg={6}>
          <h2 className="h3">Una propuesta creada para acompañarte</h2>
          <p className="lh-lg">GLOWLAB Skincare nace como una tienda online dedicada al cuidado facial y a las personas que quieren conocer mejor los productos que incorporan a su día a día. Reunimos distintas categorías en un solo lugar para que puedas explorar opciones de limpieza, hidratación, sueros, protección solar y tratamientos complementarios.</p>
          <p className="lh-lg">Sabemos que cada piel es diferente. Por eso, nuestra propuesta es entregarte información clara sobre los productos y facilitar una experiencia de compra ordenada, desde la búsqueda en el catálogo hasta la revisión de tus pedidos.</p>
          <Button as={Link} to="/productos" className="btn-glow mt-2">Explorar productos</Button>
        </Col>
      </Row>
      <section className="py-4">
        <div className="text-center mb-4"><h2 className="h3">Lo que nos mueve</h2><p className="text-muted">El propósito detrás de cada experiencia GlowLab.</p></div>
        <Row className="g-4">
          <Col md={6}><Card className="h-100 border-0 shadow-sm"><Card.Body className="p-4">
            <span className="text-info fs-3"><i className="bi bi-bullseye" /></span><h3 className="h5 mt-3">Nuestra misión</h3>
            <p className="mb-0 lh-lg">Acercar productos de cuidado facial a través de una plataforma sencilla, con información útil que ayude a las personas a comparar alternativas y tomar decisiones de compra más conscientes.</p>
          </Card.Body></Card></Col>
          <Col md={6}><Card className="h-100 border-0 shadow-sm"><Card.Body className="p-4">
            <span className="text-info fs-3"><i className="bi bi-eye" /></span><h3 className="h5 mt-3">Nuestra visión</h3>
            <p className="mb-0 lh-lg">Ser un espacio digital de referencia para quienes buscan una experiencia de skincare cercana, clara y organizada, donde el cuidado personal se viva sin complicaciones ni promesas poco realistas.</p>
          </Card.Body></Card></Col>
        </Row>
      </section>
      <section className="py-5">
        <div className="text-center mb-4"><h2 className="h3">Nuestros valores</h2><p className="text-muted">Principios que orientan la experiencia que queremos entregar.</p></div>
        <Row className="g-4">
          {VALORES.map((valor) => <Col md={4} key={valor.titulo}><Card className="h-100 text-center border-0 shadow-sm"><Card.Body className="p-4">
            <span className="text-info fs-2"><i className={"bi " + valor.icono} /></span><h3 className="h5 mt-3">{valor.titulo}</h3><p className="text-muted mb-0">{valor.texto}</p>
          </Card.Body></Card></Col>)}
        </Row>
      </section>
      <section className="rounded-4 p-4 p-md-5 text-center" style={{ background: "var(--bs-tertiary-bg)" }}>
        <h2 className="h3">Tu rutina comienza con una buena elección</h2>
        <p className="mx-auto text-muted" style={{ maxWidth: 700 }}>Explora el catálogo, conoce las características de cada producto y arma una rutina que se adapte a ti. Estamos aquí para hacer más sencilla tu experiencia GlowLab.</p>
        <div className="d-flex justify-content-center flex-wrap gap-2">
          <Button as={Link} to="/productos" className="btn-glow">Ver catálogo</Button>
          <Button as={Link} to="/contacto" variant="outline-info">Contáctanos</Button>
        </div>
      </section>
    </Container>
  );
}
