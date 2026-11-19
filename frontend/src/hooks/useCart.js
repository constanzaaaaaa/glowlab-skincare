import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error("useCart debe usarse dentro de un CartProvider.");
  return contexto;
}
