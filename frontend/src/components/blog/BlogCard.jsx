import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { rutaImagen } from "../../api/axiosClient";
export default function BlogCard({ noticia }) {
  return (
    <Card className="h-100 card-glow">
      <Card.Img variant="top" className="product-img" src={rutaImagen(noticia.imagen)} alt={noticia.titulo} />
      <Card.Body className="d-flex flex-column">
        <small className="text-muted mb-2">{noticia.fecha}</small>
        <Card.Title>{noticia.titulo}</Card.Title>
        <p>{noticia.resumen}</p>
        <Button as={Link} to={"/blog/" + noticia.id} className="mt-auto" variant="outline-info">Leer noticia</Button>
      </Card.Body>
    </Card>
  );
}
