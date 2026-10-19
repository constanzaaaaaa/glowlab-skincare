// 🦠 ORGANISMO: reúne una molécula de filtros y las tarjetas de productos.
// Igual que ListaRecetas del ejemplo 034, mantiene el estado de la búsqueda.
import { useState } from "react";
import FiltrosProductos from "../molecules/FiltrosProductos.jsx";
import ProductoGrid from "../productos/ProductoGrid.jsx";
import { filtrarProductos } from "../../utils/format";
import "./organisms.css";

export default function ListaProductos({ productos, categorias }) {
  // Cada cambio de estado vuelve a calcular los productos mostrados.
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const filtrados = filtrarProductos(productos, busqueda, categoriaId);

  return (
    <section className="lista-productos">
      <FiltrosProductos
        categorias={categorias}
        busqueda={busqueda}
        onBuscar={setBusqueda}
        categoriaId={categoriaId}
        onCategoria={setCategoriaId}
      />
      <ProductoGrid productos={filtrados} />
    </section>
  );
}
