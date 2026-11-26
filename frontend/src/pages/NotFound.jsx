import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function NotFound() {
  return <Container className="py-5 text-center"><h1>404</h1><p>La página solicitada no existe.</p><Link to="/">Ir al inicio</Link></Container>;
}
