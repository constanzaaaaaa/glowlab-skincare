import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ROLES } from "./context/AuthContext";
import Blog from "./pages/Blog";
import BlogDetalle from "./pages/BlogDetalle";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Nosotros from "./pages/Nosotros";
import NotFound from "./pages/NotFound";
import ProductoDetalle from "./pages/ProductoDetalle";
import Productos from "./pages/Productos";
import Registro from "./pages/Registro";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminProductoForm from "./pages/admin/AdminProductoForm";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminUsuarioForm from "./pages/admin/AdminUsuarioForm";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:codigo" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetalle />} />
        <Route path="/contacto" element={<Contacto />} />

        <Route element={<ProtectedRoute rolesPermitidos={[ROLES.ADMINISTRADOR, ROLES.VENDEDOR]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/productos" element={<AdminProductos />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute rolesPermitidos={[ROLES.ADMINISTRADOR]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/productos/nuevo" element={<AdminProductoForm />} />
            <Route path="/admin/productos/editar/:codigo" element={<AdminProductoForm />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioForm />} />
            <Route path="/admin/usuarios/editar/:run" element={<AdminUsuarioForm />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
