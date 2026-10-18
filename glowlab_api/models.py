from werkzeug.security import generate_password_hash, check_password_hash
from glowlab_api import db


class Producto(db.Model):
    __tablename__ = "react_productos"
    codigo = db.Column(db.String(20), primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(800), nullable=False, default="")
    precio = db.Column(db.Integer, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    stock_critico = db.Column(db.Integer, nullable=False, default=0)
    categoria_id = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(200), nullable=False, default="")
    estado = db.Column(db.String(20), nullable=False, default="Activo")

    def to_dict(self):
        return {"codigo": self.codigo, "nombre": self.nombre, "descripcion": self.descripcion,
                "precio": self.precio, "stock": self.stock, "stockCritico": self.stock_critico,
                "categoriaId": self.categoria_id, "imagen": self.imagen, "estado": self.estado}


class Usuario(db.Model):
    __tablename__ = "react_usuarios"
    run = db.Column(db.String(9), primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    fecha_nacimiento = db.Column(db.String(20), default="")
    rol_id = db.Column(db.Integer, nullable=False, default=3)
    region_id = db.Column(db.Integer, nullable=False)
    comuna_id = db.Column(db.Integer, nullable=False)
    direccion = db.Column(db.String(300), nullable=False)
    estado = db.Column(db.String(20), nullable=False, default="Activo")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"run": self.run, "nombre": self.nombre, "apellidos": self.apellidos, "correo": self.correo,
                "fechaNacimiento": self.fecha_nacimiento or "", "rolId": self.rol_id,
                "regionId": self.region_id, "comunaId": self.comuna_id,
                "direccion": self.direccion, "estado": self.estado}


class Noticia(db.Model):
    __tablename__ = "react_blog"
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    resumen = db.Column(db.String(600), nullable=False, default="")
    imagen = db.Column(db.String(200), default="")
    fecha = db.Column(db.String(20), default="")
    contenido = db.Column(db.Text, default="")

    def to_dict(self):
        return {"id": self.id, "titulo": self.titulo, "resumen": self.resumen,
                "imagen": self.imagen, "fecha": self.fecha,
                "contenido": self.contenido.split("\n\n") if self.contenido else []}


class CarritoItem(db.Model):
    __tablename__ = "react_carrito"
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.String(40), nullable=False, index=True)
    producto_codigo = db.Column(db.String(20), db.ForeignKey("react_productos.codigo"), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    producto = db.relationship("Producto")

    def to_dict(self):
        return {"codigo": self.producto_codigo, "cantidad": self.cantidad, "producto": self.producto.to_dict()}


class Contacto(db.Model):
    __tablename__ = "react_contactos"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
