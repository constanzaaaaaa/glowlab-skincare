// Pruebas atómicas y de composición, siguiendo el ejemplo 034 y Jasmine/Karma del 047.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Buscador from "../src/components/atoms/Buscador";
import FiltrosProductos from "../src/components/molecules/FiltrosProductos";
import ListaProductos from "../src/components/organisms/ListaProductos";
import { CartContext } from "../src/context/CartContext";

const productos = [
  { codigo: "GL-001", nombre: "Hydra Glow Serum", categoriaId: 2, stock: 5, estado: "Activo", precio: 15990 },
  { codigo: "GL-002", nombre: "Pure Clay Cleanser", categoriaId: 1, stock: 3, estado: "Activo", precio: 9990 },
  { codigo: "GL-003", nombre: "Producto oculto", categoriaId: 1, stock: 2, estado: "Inactivo", precio: 1000 }
];
const categorias = [{ id: 1, nombre: "Limpiadores" }, { id: 2, nombre: "Sueros" }];

function mostrarOrganismo() {
  return render(
    <MemoryRouter>
      <CartContext.Provider value={{ agregar: jasmine.createSpy("agregar") }}>
        <ListaProductos productos={productos} categorias={categorias} />
      </CartContext.Provider>
    </MemoryRouter>
  );
}

describe("GlowLab: Atomic Design, siguiendo 034 React Atomic", () => {
  afterEach(() => cleanup());

  it("36 - átomo Buscador recibe props y notifica cambios", () => {
    const onBuscar = jasmine.createSpy("onBuscar");
    render(<Buscador valor="" onBuscar={onBuscar} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Buscar productos" }), { target: { value: "serum" } });
    expect(onBuscar).toHaveBeenCalledWith("serum");
  });

  it("37 - molécula combina buscador y selector de categorías", () => {
    const onBuscar = jasmine.createSpy("onBuscar");
    const onCategoria = jasmine.createSpy("onCategoria");
    render(<FiltrosProductos categorias={categorias} busqueda="" onBuscar={onBuscar} categoriaId="" onCategoria={onCategoria} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Filtrar por categoría" }), { target: { value: "2" } });
    expect(onCategoria).toHaveBeenCalledWith("2");
    expect(screen.getByRole("textbox", { name: "Buscar productos" })).toBeTruthy();
  });

  it("38 - organismo aplica filtros al cambiar su estado", () => {
    mostrarOrganismo();
    expect(screen.getByText("Hydra Glow Serum")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "Buscar productos" }), { target: { value: "sin coincidencias" } });
    expect(screen.getByText("No se encontraron productos.")).toBeTruthy();
  });

  it("40 - organismo filtra productos por categoría", () => {
    mostrarOrganismo();
    fireEvent.change(screen.getByRole("combobox", { name: "Filtrar por categoría" }), { target: { value: "2" } });
    expect(screen.getByText("Hydra Glow Serum")).toBeTruthy();
    expect(screen.queryByText("Pure Clay Cleanser")).toBeNull();
  });

  it("39 - organismo no muestra productos inactivos", () => {
    mostrarOrganismo();
    expect(screen.queryByText("Producto oculto")).toBeNull();
    expect(screen.getByText("Pure Clay Cleanser")).toBeTruthy();
  });
});
