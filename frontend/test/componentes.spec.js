import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductoCard from "../src/components/productos/ProductoCard";
import ProductoGrid from "../src/components/productos/ProductoGrid";
import { CartContext } from "../src/context/CartContext";

const producto = {
  codigo: "GL-001", nombre: "Hydra Glow Serum", descripcion: "Sérum",
  imagen: "productos/hidratante1.webp", precio: 15990, stock: 3, estado: "Activo"
};

function renderProducto(productoPrueba, agregar) {
  return render(
    <MemoryRouter>
      <CartContext.Provider value={{ agregar }}>
        <ProductoCard producto={productoPrueba} />
      </CartContext.Provider>
    </MemoryRouter>
  );
}

describe("GlowLab: componentes React y props", () => {
  afterEach(() => cleanup());

  it("01 - renderiza el nombre recibido en props", () => {
    renderProducto(producto, jasmine.createSpy("agregar"));
    expect(screen.getByText("Hydra Glow Serum")).toBeTruthy();
  });
  it("02 - muestra enlace al detalle correcto", () => {
    renderProducto(producto, jasmine.createSpy("agregar"));
    expect(screen.getByRole("link", { name: "Ver detalle" }).getAttribute("href")).toBe("/productos/GL-001");
  });
  it("03 - agrega al carrito utilizando código, cantidad y nombre", () => {
    const agregar = jasmine.createSpy("agregar").and.returnValue(Promise.resolve());
    renderProducto(producto, agregar);
    fireEvent.click(screen.getByRole("button", { name: "Agregar Hydra Glow Serum" }));
    expect(agregar).toHaveBeenCalledWith("GL-001", 1, "Hydra Glow Serum");
  });
  it("04 - deshabilita agregar cuando no hay stock", () => {
    renderProducto({ ...producto, stock: 0 }, jasmine.createSpy("agregar"));
    expect(screen.getByRole("button", { name: "Agregar Hydra Glow Serum" }).disabled).toBeTrue();
  });
  it("05 - muestra mensaje de catálogo vacío", () => {
    render(<ProductoGrid productos={[]} />);
    expect(screen.getByText("No se encontraron productos.")).toBeTruthy();
  });
});
