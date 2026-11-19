"""Datos iniciales de GLOWLAB tomados de static/js/storage.js."""
from glowlab_api import db
from glowlab_api.models import Noticia, Producto, Usuario

ROLES = [{"id": 1, "nombre": "Administrador"}, {"id": 2, "nombre": "Vendedor"}, {"id": 3, "nombre": "Cliente"}]
CATEGORIAS = [
    {"id": 1, "nombre": "Limpiadores"}, {"id": 2, "nombre": "Sueros"},
    {"id": 3, "nombre": "Hidratantes"}, {"id": 4, "nombre": "Protector Solar"},
    {"id": 5, "nombre": "Exfoliantes"}, {"id": 6, "nombre": "Mascarillas"},
    {"id": 7, "nombre": "Contorno de Ojos"}
]
REGIONES = [{"id": 1, "nombre": "Región Metropolitana"}, {"id": 2, "nombre": "Valparaíso"}, {"id": 3, "nombre": "Biobío"}]
COMUNAS = [
    {"id": 1, "regionId": 1, "nombre": "Santiago"}, {"id": 2, "regionId": 1, "nombre": "Providencia"},
    {"id": 3, "regionId": 1, "nombre": "Maipú"}, {"id": 4, "regionId": 2, "nombre": "Valparaíso"},
    {"id": 5, "regionId": 2, "nombre": "Viña del Mar"}, {"id": 6, "regionId": 3, "nombre": "Concepción"},
    {"id": 7, "regionId": 3, "nombre": "Talcahuano"}
]
PRODUCTOS = [
    ("GL-001", "Hydra Glow Serum", "Sérum concentrado en ácido hialurónico para hidratar la piel.", 15990, 18, 4, 2, "productos/hidratante1.webp"),
    ("GL-002", "Pure Clay Cleanser", "Limpiador facial con arcilla blanca que remueve impurezas.", 9990, 25, 5, 1, "productos/limpiador1.jpg"),
    ("GL-003", "Velvet Repair Cream", "Crema reparadora para restaurar la barrera cutánea.", 18990, 14, 3, 3, "productos/crema.webp"),
    ("GL-004", "Sun Shield SPF50", "Protector solar facial de amplio espectro.", 13990, 20, 5, 4, "productos/bloqueador1.jpg"),
    ("GL-005", "Gentle Glow Scrub", "Exfoliante suave que renueva la piel.", 11990, 16, 4, 5, "productos/exfoliante1.jpg"),
    ("GL-006", "Rose Clay Mask", "Mascarilla purificante de arcilla rosada.", 12990, 12, 3, 6, "productos/mascarilla.jfif"),
    ("GL-007", "Bright Eye Contour", "Contorno de ojos con cafeína y vitamina E.", 14990, 3, 4, 7, "productos/contorno1.webp"),
    ("GL-008", "Vitamin C Radiance Serum", "Sérum antioxidante con vitamina C.", 16990, 9, 3, 2, "productos/suero1.webp")
]
USUARIOS = [
    ("123456785", "Admin", "Glowlab", "admin@gmail.com", "admin123", 1, 1, 1, "Av. Principal 123"),
    ("987654325", "Vendedor", "Glowlab", "vendedor@gmail.com", "vend1234", 2, 1, 2, "Calle Venta 456"),
    ("112223339", "Camila", "Soto Perez", "camila@gmail.com", "cliente1", 3, 2, 4, "Los Aromos 789"),
    ("201113334", "Diego", "Fernandez Rojas", "diego@duoc.cl", "diego123", 3, 3, 6, "Las Rosas 321")
]
NOTICIAS = [
    ("GLOWLAB abre sus puertas", "Nace una tienda online dedicada al cuidado de la piel.", "blog/apertura.jpeg", "2026-08-01"),
    ("Las tendencias skincare más esperadas del año", "Ingredientes y rutinas para tu piel.", "blog/tendencia.jpeg", "2026-08-10"),
    ("5 curiosidades sobre el cuidado de la piel", "Conoce algunos datos sobre skincare.", "blog/curiosidades.jpeg", "2026-08-20")
]


def sembrar():
    if Producto.query.count() == 0:
        for codigo, nombre, descripcion, precio, stock, critico, categoria, imagen in PRODUCTOS:
            db.session.add(Producto(codigo=codigo, nombre=nombre, descripcion=descripcion, precio=precio,
                                    stock=stock, stock_critico=critico, categoria_id=categoria, imagen=imagen))
    if Usuario.query.count() == 0:
        for run, nombre, apellidos, correo, password, rol, region, comuna, direccion in USUARIOS:
            usuario = Usuario(run=run, nombre=nombre, apellidos=apellidos, correo=correo,
                              rol_id=rol, region_id=region, comuna_id=comuna, direccion=direccion)
            usuario.set_password(password)
            db.session.add(usuario)
    if Noticia.query.count() == 0:
        for titulo, resumen, imagen, fecha in NOTICIAS:
            db.session.add(Noticia(titulo=titulo, resumen=resumen, imagen=imagen, fecha=fecha,
                                  contenido=resumen + "\n\nConoce más sobre el cuidado de tu piel con GlowLab Skincare."))
    db.session.commit()
