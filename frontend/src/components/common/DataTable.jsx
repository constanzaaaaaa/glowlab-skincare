import { useMemo, useState } from "react";
import { Form, Table } from "react-bootstrap";

export default function DataTable({ columnas, datos, clave = "codigo", acciones }) {
  const [busqueda, setBusqueda] = useState("");
  const filtrados = useMemo(() => datos.filter((dato) =>
    Object.values(dato).some((valor) => String(valor ?? "").toLowerCase().includes(busqueda.toLowerCase()))
  ), [datos, busqueda]);

  return (
    <>
      <Form.Control className="mb-3" aria-label="Buscar registros" placeholder="Buscar en la tabla…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      <div className="table-responsive">
        <Table striped hover>
          <thead><tr>{columnas.map((col) => <th key={col.campo}>{col.titulo}</th>)}{acciones && <th>Acciones</th>}</tr></thead>
          <tbody>
            {filtrados.map((dato) => <tr key={dato[clave]}>
              {columnas.map((col) => <td key={col.campo}>{col.render ? col.render(dato) : String(dato[col.campo] ?? "")}</td>)}
              {acciones && <td>{acciones(dato)}</td>}
            </tr>)}
          </tbody>
        </Table>
      </div>
      <p className="small text-muted">Registros: {filtrados.length}</p>
    </>
  );
}
