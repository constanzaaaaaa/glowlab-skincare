import { obtenerErrorRun, validarCorreo, validarRun } from "../src/utils/validaciones";

describe("GlowLab: validaciones de formularios", () => {
  it("06 - acepta correo de dominio DUOC", () => {
    expect(validarCorreo("alumna@duocuc.cl")).toBeTrue();
    expect(validarCorreo("alumna@gmail.com")).toBeTrue();
    expect(validarCorreo("alumna@gmail.com.falso")).toBeFalse();
    expect(validarCorreo("alumna@otro.cl")).toBeFalse();
  });
  it("07 - valida el dígito verificador de RUN", () => {
    expect(validarRun("123456785")).toBeTrue();
    expect(validarRun("123456781")).toBeFalse();
    expect(validarRun("12345678")).toBeFalse();
    expect(obtenerErrorRun("12345678")).toContain("no es válido");
    expect(obtenerErrorRun("12345")).toContain("incompleto");
    expect(obtenerErrorRun("123456781")).toContain("no es válido");
    expect(obtenerErrorRun("123456781")).not.toContain("corresponde");
    expect(obtenerErrorRun("123456781")).not.toContain("5");
  });
});
