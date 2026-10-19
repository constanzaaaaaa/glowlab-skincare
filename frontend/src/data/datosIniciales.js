// Datos de demostración para la evaluación 2 (basados en el Flask original).
// NO utilizar estas credenciales de prueba en un sistema real.
export const ROLES = [{ id: 1, nombre: "Administrador" }, { id: 2, nombre: "Vendedor" }, { id: 3, nombre: "Cliente" }];
export const CATEGORIAS = ["Limpiadores", "Sueros", "Hidratantes", "Protector Solar", "Exfoliantes", "Mascarillas", "Contorno de Ojos"].map((nombre, i) => ({ id: i + 1, nombre }));
export const REGIONES = ["Región Metropolitana", "Valparaíso", "Biobío"].map((nombre, i) => ({ id: i + 1, nombre }));
export const COMUNAS = [{ id: 1, regionId: 1, nombre: "Santiago" }, { id: 2, regionId: 1, nombre: "Providencia" }, { id: 3, regionId: 1, nombre: "Maipú" }, { id: 4, regionId: 2, nombre: "Valparaíso" }, { id: 5, regionId: 2, nombre: "Viña del Mar" }, { id: 6, regionId: 3, nombre: "Concepción" }, { id: 7, regionId: 3, nombre: "Talcahuano" }];
