# GLOWLAB Skincare — complemento ERS React (Evaluación Parcial 2)

Este documento complementa \`docs/Especificacion-GLOWLAB.md\`, el ERS original.
Describe la versión de React en la rama \`migracion-react-profesor\`, siguiendo los ejemplos 027, 033, 034, 037, 040 y 047 del profesor.

## Objetivo

Migrar las páginas HTML/Jinja a componentes React reutilizables con Bootstrap responsivo, gestión de props/estado, navegación, administración, carrito y pruebas unitarias Jasmine/Karma.

## Arquitectura

- **Frontend:** Vite + React + React Router + React-Bootstrap, contextos Auth/Cart y páginas públicas/administrativas.
- **Datos simulados:** \`frontend/src/data/datosIniciales.js\` representa la fuente inicial de datos del anexo 040.
- **Persistencia CRUD:** \`frontend/src/storage/persistencia.js\` guarda colecciones como JSON en \`localStorage\`; \`storage/productos.js\` y \`storage/usuarios.js\` implementan alta, consulta, edición y eliminación.
- **Otras funciones:** \`storage/carrito.js\` maneja cantidades, stock y checkout simulado; \`storage/otros.js\` ofrece blog, contacto y catálogos de apoyo.
- **Componentes React:** \`src/api/\` expone las mismas funciones usadas por las páginas, ahora conectadas a la capa JavaScript simulada en vez de Axios/Flask. Los contextos se actualizan con los cambios del almacenamiento.
- **Recursos visuales:** \`frontend/public/static/img\` contiene copias de las imágenes originales. React se inicia solo con Vite, sin ejecutar Python.
- **Código preservado:** \`app.py\`, \`templates/\`, \`static/\`, \`run_react_api.py\`, \`glowlab_api/\` y SQLite se conservan sin borrarlos; **no se utilizan como fuente de datos por defecto del frontend React**.
- **Pruebas:** Jasmine/Karma + Webpack/Babel/ChromeHeadless. \`karma-coverage\` procede del material 037.

## Requisitos funcionales

| ID | Requisito | Implementación |
|---|---|---|
| RF-01 | Mostrar productos y filtrar catálogo | \`pages/Productos.jsx\`, \`storage/productos.js\` |
| RF-02 | Ver detalles y stock | \`pages/ProductoDetalle.jsx\` |
| RF-03 | Agregar, modificar, retirar productos del carrito | \`context/CartContext.jsx\`, \`storage/carrito.js\` |
| RF-04 | Confirmar una compra simulada | \`pages/Carrito.jsx\`, \`storage/carrito.js\` |
| RF-05 | Registrar e iniciar/cerrar sesión | \`pages/Registro.jsx\`, \`pages/Login.jsx\`, \`storage/usuarios.js\` |
| RF-06 | Restringir menú y rutas por rol simulado | \`ProtectedRoute.jsx\`, \`AuthContext.jsx\`, funciones de CRUD |
| RF-07 | CRUD de productos como administrador | \`pages/admin/AdminProductos.jsx\`, \`AdminProductoForm.jsx\`, \`storage/productos.js\` |
| RF-08 | CRUD de usuarios como administrador | \`pages/admin/AdminUsuarios.jsx\`, \`AdminUsuarioForm.jsx\`, \`storage/usuarios.js\` |
| RF-09 | Blog y detalle | \`pages/Blog.jsx\`, \`BlogDetalle.jsx\`, \`storage/otros.js\` |
| RF-10 | Contacto con persistencia local | \`pages/Contacto.jsx\`, \`storage/otros.js\` |
| RF-11 | Navegación y visualización responsiva | \`NavBar.jsx\`, componentes React-Bootstrap |
| RF-12 | Conservación de datos al recargar | \`storage/persistencia.js\` y \`localStorage\` |

## Requisitos no funcionales y límites

- **RNF-01:** Interfaz responsiva mediante componentes Bootstrap y clases \`Row\`/\`Col\`/\`Container\`.
- **RNF-02:** Componentes con responsabilidad clara, \`props\` y estado React; evitar manipulación manual del DOM.
- **RNF-03:** Operaciones CRUD y sesión simuladas en el cliente para fines académicos; **no usar para datos personales reales, autenticación segura ni producción**. Los hashes en navegador no equivalen a seguridad de servidor.
- **RNF-04:** \`localStorage\` persiste en el navegador/perfil actual, pero no se sincroniza con SQLite ni otros usuarios/dispositivos.
- **RNF-05:** Las pruebas automatizadas verifican lógica, componentes y persistencia. La cobertura depende de los archivos realmente instrumentados.

## Criterios de aceptación pendientes de validar en Windows

1. \`cd frontend; npm.cmd install; npm.cmd run dev\` presenta las páginas sin iniciar Flask.
2. Imágenes cargadas desde \`frontend/public/static/img\`.
3. El catálogo, detalle, carrito, registro, login y panel administrativo siguen funcionando.
4. Crear/editar/borrar un producto y un usuario conserva el resultado al recargar.
5. Una cuenta no administradora no puede realizar CRUD administrativo mediante las funciones JS.
6. El diseño se adapta a móvil y escritorio.
7. \`npm.cmd test\` aprueba los **35 casos definidos** (25 antes aprobados y 10 nuevos aún pendientes de reejecución).
8. \`npm.cmd run test:coverage\` genera el informe actualizado; no reutilizar cifras antiguas como cobertura del nuevo código.

## Fuera de alcance

Pagos reales, autenticación segura para producción, sincronización con SQLite, bases de datos multiusuario compartidas y la publicación en la rama \`main\`.
