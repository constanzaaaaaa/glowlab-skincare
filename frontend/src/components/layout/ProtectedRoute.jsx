import { Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ rolesPermitidos }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="text-center py-5"><Spinner animation="border" /><p>Verificando sesión…</p></div>;
  if (!usuario || !rolesPermitidos.includes(usuario.rolId)) return <Navigate to="/login" replace />;
  return <Outlet />;
}
