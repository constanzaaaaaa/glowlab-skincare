import { Form } from "react-bootstrap";

// Átomo: recibe valor y notifica cambios mediante una prop, como 034 React Atomic.
export default function Buscador({ valor, onBuscar, placeholder = "Buscar…" }) {
  return (
    <Form.Control
      className="buscador-glow"
      aria-label="Buscar productos"
      placeholder={placeholder}
      value={valor}
      onChange={(evento) => onBuscar(evento.target.value)}
    />
  );
}
