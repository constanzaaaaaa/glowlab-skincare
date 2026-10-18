# GLOWLAB Skincare — complemento ERS React

> Documento complementario al archivo original `docs/Especificacion-GLOWLAB.md`. Refleja la rama `migracion-react-profesor`; no reemplaza la especificación de Flask.

## Objetivo

Transformar las vistas HTML/Jinja del frontend original en páginas y componentes React, manteniendo el contexto de catálogo skincare, navegación, carrito, usuarios y administración, conforme a los ejemplos 033, 034 y 047 del profesor.

## Arquitectura

- **Frontend:** Vite + React, `react-router-dom` para rutas, `react-bootstrap` para diseño adaptable, contextos para estado compartido.
- **HTTP:** `axios` en `src/api/`, sin modificar las llamadas en las páginas; Vite ofrece proxy local hacia Flask.
- **Backend:** Flask + Flask-SQLAlchemy (`run_react_api.py`, `glowlab_api/`). Conserva `app.py`, `templates/` y `static/`.
- **Datos:** SQLite inicializada con productos/categorías/usuarios/blog de GlowLab; independiente del almacenamiento en navegador del frontend original.
- **Pruebas:** Jasmine + Karma en ChromeHeadless. Webpack + Babel empaquetan specs como en el 047.
- **Componentes reutilizables:** `ProductoCard`, `ProductoGrid`, `BlogCard`, `DataTable`, `NavBar`, `Layout`, `AdminLayout` con props, contexto y estado.

## Requisitos funcionales implementados

| ID | Requisito | Implementación |
|---|---|---|
| RF-01 | Ver catálogo | `pages/Productos.jsx` |
| RF-02 | Buscar y filtrar productos | `pages/Productos.jsx`, `utils/format.js` |
| RF-03 | Consultar detalle y stock | `pages/ProductoDetalle.jsx` |
| RF-04 | Añadir/eliminar/cambiar cantidad del carrito | `context/CartContext.jsx`, `pages/Carrito.jsx` |
| RF-05 | Simular confirmación de compra | `glowlab_api/routes.py` y carrito |
| RF-06 | Registrarse e iniciar/cerrar sesión | `pages/Registro.jsx`, `pages/Login.jsx`, `context/AuthContext.jsx` |
| RF-07 | Proteger área administrativa por rol | `components/layout/ProtectedRoute.jsx` y API |
| RF-08 | CRUD administrativo de productos | `pages/admin/AdminProductos.jsx`, `AdminProductoForm.jsx` |
| RF-09 | CRUD administrativo de usuarios | `pages/admin/AdminUsuarios.jsx`, `AdminUsuarioForm.jsx` |
| RF-10 | Consultar blog | `pages/Blog.jsx`, `BlogDetalle.jsx` |
| RF-11 | Enviar formulario de contacto | `pages/Contacto.jsx`, API |
| RF-12 | Navegación adaptable | `components/layout/NavBar.jsx`, React-Bootstrap |

## Requisitos no funcionales

- **RNF-01:** Interfaz adaptable con rejilla `Container`/`Row`/`Col` y menú responsive React-Bootstrap.
- **RNF-02:** Estado React mediante `useState`, `useEffect`, `useMemo` y Context API, sin manipulación directa del DOM para actualizar vistas.
- **RNF-03:** Contraseñas de la API persistidas con hash (Werkzeug); roles verificados también en el servidor.
- **RNF-04:** Unit tests Jasmine/Karma independientes del servidor Flask cuando solo prueban lógica y componentes.
- **RNF-05:** Imágenes originales accesibles en `static/img`.

## Criterios de aceptación para cerrar evaluación

1. `npm install` termina sin errores con Node LTS.
2. `py run_react_api.py` responde `/api/health` y sirve productos reales de prueba.
3. `npm run dev` muestra todas las páginas sin errores de consola.
4. Registrar un usuario, iniciar sesión y administrar productos como administrador funciona.
5. La aplicación es utilizable en móvil y escritorio.
6. `npm test` ejecuta las 25 pruebas; registrar cuántas pasan/fallan.
7. Documentar el resultado de cobertura que exija la rúbrica, sin inventar porcentajes.

## Fuera de alcance

Pagos reales, despliegue productivo, sincronización bidireccional entre SQLite y el localStorage original y publicación en la rama `main`. Estas funciones no se presuponen implementadas.
