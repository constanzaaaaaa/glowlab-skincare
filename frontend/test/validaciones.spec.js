import { DOMINIOS_CORREO_VALIDOS, enteroEnRango, textoRequerido, validarCorreo, validarPassword, validarRun } from "../src/utils/validaciones";

describe("GlowLab: validaciones de formularios", () => {
  it("10 - acepta correo de dominio DUOC", () => {
    expect(validarCorreo("alumna@duoc.cl")).toBeTrue();
  });
  it("11 - rechaza dominio de correo no permitido", () => {
    expect(validarCorreo("alumna@correo.com")).toBeFalse();
  });
  it("12 - declara los dominios válidos de GlowLab", () => {
    expect(DOMINIOS_CORREO_VALIDOS).toContain("@gmail.com");
  });
  it("13 - acepta contraseñas dentro del rango", () => {
    expect(validarPassword("abc123")).toBeTrue();
  });
  it("14 - rechaza contraseñas demasiado cortas", () => {
    expect(validarPassword("abc")).toBeFalse();
  });
  it("15 - valida el dígito verificador de RUN", () => {
    expect(validarRun("123456785")).toBeTrue();
    expect(validarRun("123456781")).toBeFalse();
  });
  it("16 - rechaza campos de texto vacíos", () => {
    expect(textoRequerido("  ", 50)).toBeFalse();
  });
  it("17 - limita longitud de texto", () => {
    expect(textoRequerido("Producto largo", 5)).toBeFalse();
  });
  it("18 - acepta enteros no negativos para stock", () => {
    expect(enteroEnRango(0, 0)).toBeTrue();
    expect(enteroEnRango(4, 0)).toBeTrue();
  });
  it("19 - rechaza stock decimal y negativo", () => {
    expect(enteroEnRango(1.5, 0)).toBeFalse();
    expect(enteroEnRango(-1, 0)).toBeFalse();
  });
});
