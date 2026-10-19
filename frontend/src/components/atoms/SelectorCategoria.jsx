// ⚛️ ÁTOMO: solo muestra el selector y avisa al componente padre del cambio.
import { Form } from "react-bootstrap";

export default function SelectorCategoria({ categorias, valor, onCambiar }) {
  return (
    <Form.Select aria-label="Filtrar por categoría" value={valor} onChange={(evento) => onCambiar(evento.target.value)}>
      <option value="">Todas las categorías</option>
      {categorias.map((categoria) => (
        <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
      ))}
    </Form.Select>
  );
}
