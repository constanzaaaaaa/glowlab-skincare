// Átomo: solo muestra una prop; el comportamiento queda en la tarjeta.
export default function TituloProducto({ nombre }) {
  return <h3 className="h6">{nombre}</h3>;
}
