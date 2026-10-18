"""Ejecuta GlowLab Flask original junto a la API para React (ejemplo 033)."""
from app import app
from glowlab_api import configurar_api

configurar_api(app)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
