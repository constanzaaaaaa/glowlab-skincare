import { validarCorreo, validarRun } from "../src/utils/validaciones";

describe("GlowLab: validaciones de formularios", () => {
  it("06 - acepta correo de dominio DUOC", () => {
    expect(validarCorreo("alumna@duoc.cl")).toBeTrue();
  });
  it("07 - valida el dígito verificador de RUN", () => {
    expect(validarRun("123456785")).toBeTrue();
    expect(validarRun("123456781")).toBeFalse();
  });
});
