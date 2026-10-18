"""Extensión REST del Flask original; no modifica las rutas Jinja existentes."""
import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def configurar_api(app):
    app.config["SECRET_KEY"] = os.environ.get("GLOWLAB_SECRET_KEY", "solo-desarrollo-cambiar-en-produccion")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(app.root_path, "glowlab_react.sqlite")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    from glowlab_api import models  # Registra modelos antes de crear tablas.
    from glowlab_api.seed import sembrar
    from glowlab_api.routes import api_bp
    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()
        sembrar()

    return app
