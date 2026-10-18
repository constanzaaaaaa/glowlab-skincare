import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { mostrarError } from "../../utils/swal";

export default function NavBar() {
  const { usuario, logout, esAdmin, esVendedor } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  async function salir() {
    try { await logout(); navigate("/login"); }
    catch (error) { mostrarError(error.message); }
  }

  return (
    <Navbar expand="lg" className="glow-navbar sticky-top" collapseOnSelect>
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="glow-brand">GLOWLAB Skincare</Navbar.Brand>
        <Navbar.Toggle aria-controls="glow-menu" />
        <Navbar.Collapse id="glow-menu">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            {(esAdmin || esVendedor) && <Nav.Link as={NavLink} to="/admin">Administración</Nav.Link>}
          </Nav>
          <Nav>
            <Nav.Link as={NavLink} to="/carrito" aria-label="Ver carrito">
              <i className="bi bi-cart3 me-1" /> Carrito {totalItems > 0 && <Badge bg="info">{totalItems}</Badge>}
            </Nav.Link>
            {usuario ? (
              <NavDropdown title={usuario.nombre} align="end">
                <NavDropdown.Item onClick={salir}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={NavLink} to="/registro">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
