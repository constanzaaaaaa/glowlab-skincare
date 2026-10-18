import { filtrarProductos, formatearPrecio, stockDisponible, totalCarrito } from "../src/utils/format";

describe("GlowLab: utilidades de productos y carrito", () => {
  const productos = [
    { codigo: "GL-001", nombre: "Hydra Serum", categoriaId: 2, estado: "Activo", stock: 3 },
    { codigo: "GL-002", nombre: "Crema suave", categoriaId: 3, estado: "Activo", stock: 0 },
    { codigo: "GL-003", nombre: "Serum inactivo", categoriaId: 2, estado: "Inactivo", stock: 4 }
  ];

  it("01 - muestra solo productos activos", () => {
    expect(filtrarProductos(productos).map((p) => p.codigo)).toEqual(["GL-001", "GL-002"]);
  });
  it("02 - filtra por nombre sin diferenciar mayúsculas", () => {
    expect(filtrarProductos(productos, "HYDRA").length).toBe(1);
  });
  it("03 - filtra por categoría", () => {
    expect(filtrarProductos(productos, "", 3)[0].codigo).toBe("GL-002");
  });
  it("04 - combina nombre y categoría", () => {
    expect(filtrarProductos(productos, "crema", 2)).toEqual([]);
  });
  it("05 - informa disponibilidad solo con stock positivo", () => {
    expect(stockDisponible(productos[0])).toBeTrue();
    expect(stockDisponible(productos[1])).toBeFalse();
  });
  it("06 - excluye productos inactivos aunque tengan stock", () => {
    expect(stockDisponible(productos[2])).toBeFalse();
  });
  it("07 - muestra precios en pesos chilenos", () => {
    expect(formatearPrecio(15990)).toContain("15.990");
  });
  it("08 - calcula el total de varias líneas", () => {
    const items = [
      { cantidad: 2, producto: { precio: 15990 } },
      { cantidad: 1, producto: { precio: 9990 } }
    ];
    expect(totalCarrito(items)).toBe(41970);
  });
  it("09 - devuelve cero para carrito vacío", () => {
    expect(totalCarrito([])).toBe(0);
  });
});
