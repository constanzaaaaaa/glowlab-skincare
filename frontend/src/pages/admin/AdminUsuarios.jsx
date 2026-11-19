import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { eliminarUsuario, listarUsuarios } from "../../api/usuariosApi";
import DataTable from "../../components/common/DataTable";
import { confirmarAccion, mostrarError, mostrarExito } from "../../utils/swal";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const cargar = () => listarUsuarios().then(setUsuarios).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  async function borrar(run) {
    if (!await confirmarAccion({ titulo: "¿Eliminar usuario?", texto: run, confirmButtonText: "Eliminar" })) return;
    try { await eliminarUsuario(run); await cargar(); await mostrarExito("Usuario eliminado", run); }
    catch (e) { mostrarError(e.message); }
  }

  return <>
    <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
      <h1 className="h3">Usuarios</h1>
      <Button as={Link} to="/admin/usuarios/nuevo" className="btn-glow">Nuevo usuario</Button>
    </div>
    {error && <p role="alert" className="text-danger">{error}</p>}
    <DataTable datos={usuarios} clave="run" columnas={[
      { campo: "run", titulo: "RUN" }, { campo: "nombre", titulo: "Nombre" },
      { campo: "correo", titulo: "Correo" }, { campo: "rolId", titulo: "Rol" }, { campo: "estado", titulo: "Estado" }
    ]} acciones={(u) => <>
      <Button as={Link} to={"/admin/usuarios/editar/" + u.run} size="sm" variant="outline-primary" className="me-2">Editar</Button>
      <Button size="sm" variant="outline-danger" onClick={() => borrar(u.run)}>Eliminar</Button>
    </>} />
  </>;
}
