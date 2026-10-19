// Datos de demostración para la evaluación 2 (basados en el Flask original).
// NO utilizar estas credenciales de prueba en un sistema real.
export const ROLES = [{ id: 1, nombre: "Administrador" }, { id: 2, nombre: "Vendedor" }, { id: 3, nombre: "Cliente" }];
export const CATEGORIAS = ["Limpiadores", "Sueros", "Hidratantes", "Protector Solar", "Exfoliantes", "Mascarillas", "Contorno de Ojos"].map((nombre, i) => ({ id: i + 1, nombre }));
export const REGIONES = ["Región Metropolitana", "Valparaíso", "Biobío"].map((nombre, i) => ({ id: i + 1, nombre }));
export const COMUNAS = [{ id: 1, regionId: 1, nombre: "Santiago" }, { id: 2, regionId: 1, nombre: "Providencia" }, { id: 3, regionId: 1, nombre: "Maipú" }, { id: 4, regionId: 2, nombre: "Valparaíso" }, { id: 5, regionId: 2, nombre: "Viña del Mar" }, { id: 6, regionId: 3, nombre: "Concepción" }, { id: 7, regionId: 3, nombre: "Talcahuano" }];

export const PRODUCTOS = [
  ["GL-001", "Hydra Glow Serum", "Sérum concentrado en ácido hialurónico para hidratar la piel.", 15990, 18, 4, 2, "productos/hidratante1.webp"],
  ["GL-002", "Pure Clay Cleanser", "Limpiador facial con arcilla blanca que remueve impurezas.", 9990, 25, 5, 1, "productos/limpiador1.jpg"],
  ["GL-003", "Velvet Repair Cream", "Crema reparadora para restaurar la barrera cutánea.", 18990, 14, 3, 3, "productos/crema.webp"],
  ["GL-004", "Sun Shield SPF50", "Protector solar facial de amplio espectro.", 13990, 20, 5, 4, "productos/bloqueador1.jpg"],
  ["GL-005", "Gentle Glow Scrub", "Exfoliante suave que renueva la piel.", 11990, 16, 4, 5, "productos/exfoliante1.jpg"],
  ["GL-006", "Rose Clay Mask", "Mascarilla purificante de arcilla rosada.", 12990, 12, 3, 6, "productos/mascarilla.jfif"],
  ["GL-007", "Bright Eye Contour", "Contorno de ojos con cafeína y vitamina E.", 14990, 3, 4, 7, "productos/contorno1.webp"],
  ["GL-008", "Vitamin C Radiance Serum", "Sérum antioxidante con vitamina C.", 16990, 9, 3, 2, "productos/suero1.webp"]
].map(([codigo, nombre, descripcion, precio, stock, stockCritico, categoriaId, imagen]) =>
  ({ codigo, nombre, descripcion, precio, stock, stockCritico, categoriaId, imagen, estado: "Activo" })
);

export const USUARIOS = [
  ["123456785", "Admin", "Glowlab", "admin@gmail.com", "64b0a321b02670fea07b462dd501b4ddbf6e5c6ee267b6bb2c215db99c83eb05", 1, 1, 1, "Av. Principal 123"],
  ["987654325", "Vendedor", "Glowlab", "vendedor@gmail.com", "ab4b6e5e2773dec4102756cdd2b682fb937e1537c07f3cf7d768411b0b75a638", 2, 1, 2, "Calle Venta 456"],
  ["112223339", "Camila", "Soto Perez", "camila@gmail.com", "2f35efddce00511b6e1ba5b4875601fbebd0616002c8b3382c704f7de2ebc13c", 3, 2, 4, "Los Aromos 789"],
  ["201113334", "Diego", "Fernandez Rojas", "diego@duoc.cl", "d663f952a85991ff6c9540be310147f829e798ede49131cd0c5ef847d171d310", 3, 3, 6, "Las Rosas 321"]
].map(([run, nombre, apellidos, correo, claveHash, rolId, regionId, comunaId, direccion]) =>
  ({ run, nombre, apellidos, correo, claveHash, fechaNacimiento: "", rolId, regionId, comunaId, direccion, estado: "Activo" })
);

export const NOTICIAS = [
  ["GLOWLAB abre sus puertas", "Nace una tienda online dedicada al cuidado de la piel.", "blog/apertura.jpeg", "2026-08-01"],
  ["Las tendencias skincare más esperadas del año", "Ingredientes y rutinas para tu piel.", "blog/tendencia.jpeg", "2026-08-10"],
  ["5 curiosidades sobre el cuidado de la piel", "Conoce algunos datos sobre skincare.", "blog/curiosidades.jpeg", "2026-08-20"]
].map(([titulo, resumen, imagen, fecha], indice) =>
  ({ id: indice + 1, titulo, resumen, imagen, fecha,
    contenido: [resumen, "Conoce más sobre el cuidado de tu piel con GlowLab Skincare."] })
);
