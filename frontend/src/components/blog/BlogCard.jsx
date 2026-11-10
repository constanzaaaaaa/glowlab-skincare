import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { rutaImagen } from "../../api/axiosClient";

export default function BlogCard({ noticia }) {
  return (
    <Card className="h-100 card-glow">
      <Card.Img variant="top" className="product-img" src={rutaImagen(noticia.imagen)} alt={noticia.titulo} />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
          {noticia.categoria && <Badge bg="info">{noticia.categoria}</Badge>}
          <small className="text-muted">{noticia.fecha}</small>
        </div>
        <Card.Title>{noticia.titulo}</Card.Title>
        <Card.Text>{noticia.resumen}</Card.Text>
        <small className="text-muted mb-3"><i className="bi bi-clock me-1" />{noticia.lecturaMinutos || 3} min de lectura</small>
        <Button as={Link} to={"/blog/" + noticia.id} className="mt-auto" variant="outline-info">Leer artículo</Button>
      </Card.Body>
    </Card>
  );
}
