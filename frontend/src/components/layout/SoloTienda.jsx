import { Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Un vendedor solo puede consultar productos y órdenes, como exige el Anexo 1.
export default function SoloTienda() {
  const { esVendedor, cargando } = useAuth();
  if (cargando) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (esVendedor) return <Navigate to="/admin/productos" replace />;
  return <Outlet />;
}
