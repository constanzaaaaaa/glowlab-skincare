# GlowLab — Evaluación Parcial 3: estado del desarrollo

**Rama:** `control-3-spring-rest-jwt`. Base: `migracion-react-profesor`. **`main` sin cambios.**

Fuentes: **100 CONTROL 3 - Enunciado (con la rúbrica)** y **101 CONTROL 3 - Anexo 1 Instrucciones.pdf**. Las guías 057 y 058 explican REST e integración en otros entornos; no sustituyen la obligación de usar Spring Boot.

## Requisitos del Anexo 1

1. Backend en Spring Boot con conexión a BD relacional (elegida aquí: MySQL).
2. Entidades `Usuario`, `Boleta`, `DetalleBoleta`, `Producto` y `Categoria`, con relaciones JPA.
3. Lógica de negocio para productos, categorías, usuarios y pedidos.
4. Endpoints REST CRUD versionados `/api/v1` y Swagger.
5. Integración de React con backend REST.
6. Spring Security con roles y JWT.
7. Sesión persistente después de recargar y permisos frontend/backend.

## Permisos según la pauta

| Funcionalidad | Administrador | Vendedor | Cliente |
|---|---|---|---|
| Catálogo de la tienda | Sí | Sí, lectura | Sí |
| Administrar productos/categorías | Sí | No | No |
| Administrar usuarios | Sí | No | No |
| Ver boletas de todas las cuentas | Sí | Sí, lectura | No |
| Ver sus propias boletas | Sí | No | Sí |
| Registrar boleta | Sí | No | Sí |
| Dashboard de ventas | Sí | No | No |

## Implementación en el repositorio

- `backend/pom.xml`: dependencias Spring Boot, JPA, MySQL, Security, Swagger y JWT.
- `backend/src/main/java/cl/glowlab/control3/model`: las cinco entidades de la imagen del Anexo 1.
- `repo`: repositorios Spring Data JPA.
- `service`: CRUD, validación y compra transaccional con descuento de stock.
- `api`: controladores REST y datos serializables para React.
- `security`: JWT, cookies, roles y acceso protegido.
- `frontend/src/api`: llamadas HTTP a Spring Boot con fallback al modo local anterior.
- `frontend/src/pages/admin/AdminOrdenes.jsx`: vista de consulta de órdenes del vendedor.
- `frontend/src/App.jsx`: rutas protegidas, evitando dashboard y formularios administrativos para vendedor.
- `backend/src/test`: pruebas unitarias JWT y prueba de integración REST con H2.

## Validaciones automáticas verificadas el 26-11-2026

La ejecución https://github.com/constanzaaaaaa/glowlab-skincare/actions/runs/45862728133 terminó correctamente: Java 21/Spring Boot con **7 pruebas aprobadas**, React compilado y **10 pruebas Jasmine/Karma aprobadas**. Cobertura JaCoCo: líneas 78,3 % (328/419) y ramas 42,8 % (116/271); Karma (módulos instrumentados): líneas 41,0 % (186/454) y ramas 29,1 % (104/358). Los informes originales se encuentran en los artifacts del workflow.

**Esto verifica compilación y pruebas automatizadas, pero no sustituye la ejecución de MySQL y React en navegador real.**

## Entregables de la rúbrica aún por terminar y evidenciar

- `01-README.txt` con integrantes, RUN, asignatura y enlaces reales de GitHub frontend y backend.
- `02-Documento-ERS.docx` terminado.
- `03-Documento-de-Cobertura-de-Testing.docx` con resultados reales.
- `04-Documentación-de-APIs.xlsx` (usar modelo Anexo 3).
- `05-Documentación-de-APIs-e-Integración.docx` (usar modelo Anexo 2).
- `06-Manual-de-Usuario.docx` con capturas reales (usar modelo Anexo 4).
- `07-Proyecto-frontend-comprimido.zip` y `08-Proyecto-backend-comprimido.zip`.
- `09-Video-de-presentación-del-proyecto.mp4` con participación de todos los integrantes.

**No afirmar que los tests aprobaron ni que la API está desplegada sin haber realizado las comprobaciones.**

## Cómo empezar

Consulta `backend/README.md`: incluye los comandos PowerShell para MySQL con Docker, JWT, backend Maven, frontend Vite y pruebas.
