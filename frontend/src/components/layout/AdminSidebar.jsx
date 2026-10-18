import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminSidebar() {
  const { esAdmin } = useAuth();
  return (
    <aside className="admin-sidebar rounded p-3">
      <h2 className="h5">Administración</h2>
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/admin" end>Panel</Nav.Link>
        <Nav.Link as={NavLink} to="/admin/productos">Productos</Nav.Link>
        {esAdmin && <Nav.Link as={NavLink} to="/admin/usuarios">Usuarios</Nav.Link>}
        <Nav.Link as={NavLink} to="/">Volver a tienda</Nav.Link>
      </Nav>
    </aside>
  );
}
