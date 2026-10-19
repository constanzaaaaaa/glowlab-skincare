# Comparación de GlowLab con los ejemplos 033, 034, 040 y 047 del profesor

**Rama:** `migracion-react-profesor` (no se cambia `main`).

## Criterio aplicado

La referencia principal es **033 Ejemplo Nexo-Gaming-React.rar**. Se conserva su organización general de `src/`, React Router, componentes de catálogo, layouts, contextos y hooks. Se adapta el contenido de videojuegos a productos GlowLab Skincare.

La metodología **034 Ejemplo React-Atomic.rar** se incorpora en una parte real de la aplicación: **el catálogo**. La persistencia **JavaScript y CRUD del documento 040** tiene prioridad sobre el backend Flask del 033, porque los ejemplos representan alternativas distintas. Para las pruebas se toma **047 Ejemplo Test Karma Jasmin.rar**, incorporando el informe de cobertura permitido por los apuntes 037/045.

## 033 – Estructura principal de React

| Archivo/carpeta del 033 | Correspondencia en GlowLab | Estado |
|---|---|---|
| `src/main.jsx` | `frontend/src/main.jsx` | Misma estructura React, StrictMode, Router y providers |
| `src/App.jsx` | `frontend/src/App.jsx` | Mismas rutas de tienda y administración adaptadas a skincare; permisos de editar productos reservados al administrador |
| `src/api/` | `frontend/src/api/` | Mismos nombres de funciones y módulos públicos, **pero delegan a JS/localStorage**, no a Axios/Flask |
| `src/components/productos/ProductoCard.jsx` | Igual ruta relativa | Conserva nombre, props, `Col` y tarjeta, delegando el contenido a una molécula Atomic |
| `src/components/productos/ProductoGrid.jsx` | Igual ruta relativa | Igual patrón `Row` + `.map()` + `ProductoCard` |
| `src/components/layout/` | Igual ruta relativa | Navbar, Footer, Layout, AdminLayout, AdminSidebar y ProtectedRoute |
| `src/context/` | Igual ruta relativa | `AuthContext` y `CartContext`, con sincronización adicional de almacenamiento del navegador |
| `src/hooks/useAuth.js`, `useCart.js` | Igual ruta relativa | Misma comprobación y mensaje de contexto ausente que el 033 |
| `src/pages/` y `src/pages/admin/` | Igual ruta relativa | Mismos tipos de pantallas y formularios, con textos y productos GlowLab |
| `src/utils/` | Igual ruta relativa | Precio, validaciones y alertas adaptadas al caso |

**Nota sobre la carpeta `frontend/`:** en el RAR 033 la aplicación tiene su propia raíz `nexo-gaming-react/`; GlowLab la coloca en `frontend/` porque el repositorio contiene además la versión Flask original. La organización **dentro** de `frontend/src/` se mantiene comparable.

## 034 – Atomic Design aplicado realmente al catálogo

En el RAR original del profesor: `atoms/` (`Buscador`, `TituloReceta`, `Ingrediente`), `molecules/TarjetaReceta` y `organisms/ListaRecetas`. En GlowLab:

```text
frontend/src/
├── data/datosIniciales.js
├── components/
│   ├── atoms/
│   │   ├── Buscador.jsx
│   │   ├── SelectorCategoria.jsx
│   │   ├── TituloProducto.jsx
│   │   └── atoms.css
│   ├── molecules/
│   │   ├── FiltrosProductos.jsx
│   │   ├── TarjetaProducto.jsx
│   │   └── molecules.css
│   ├── organisms/
│   │   ├── ListaProductos.jsx
│   │   └── organisms.css
│   ├── productos/
│   │   ├── ProductoCard.jsx
│   │   └── ProductoGrid.jsx
│   ├── blog/
│   ├── common/
│   └── layout/
└── pages/Productos.jsx
```

- **Átomos:** `Buscador`, `SelectorCategoria` y `TituloProducto` reciben valores/callbacks por props y no contienen lógica de negocio.
- **Moléculas:** `FiltrosProductos` une dos átomos; `TarjetaProducto` une el átomo de título con imagen, precio, stock y botones.
- **Organismo:** `ListaProductos` conserva el estado con `useState`, utiliza las moléculas y filtra con `filtrarProductos`, como `ListaRecetas` filtra recetas en el 034.
- **Página:** `Productos.jsx` obtiene los datos y se los entrega al organismo, sin administrar los campos de búsqueda.

Se conservaron también `ProductoCard` y `ProductoGrid` porque forman parte de la estructura exacta del 033 y se utilizan en la portada. Son adaptadores compatibles; no sustituyen los niveles del 034.

## 040 – Datos y CRUD en JavaScript

A diferencia del **033, que hace peticiones Axios a una API Flask**, el anexo **040** solicita un archivo de datos simulado y funciones CRUD en JavaScript.

- `src/data/datosIniciales.js`: datos iniciales.
- `src/storage/persistencia.js`: inicializar, leer y guardar colecciones `localStorage`.
- `src/storage/productos.js`: CRUD de catálogo.
- `src/storage/usuarios.js`: CRUD de usuarios y sesión simulada.
- `src/storage/carrito.js` y `otros.js`: compra de prueba, noticias y contacto.

**Esta es la diferencia de lógica más importante respecto del 033 y es intencional.** Se conservan Flask/SQLite como respaldo sin conexión activa con React. Los datos de `localStorage`, incluidas las credenciales de demostración, **no deben usarse para datos reales o producción**.

## 047 – Pruebas Jasmine/Karma

El RAR del profesor contiene `test/*.spec.js`, `karma.conf.js`, `babel.config.js`, `webpack.config.js` y las herramientas Jasmine/Karma, Webpack, Babel y Testing Library.

GlowLab conserva el patrón `describe` → `it` → `expect`, ChromeHeadless, recompilación con Webpack+Babel y archivos `test/*.spec.js`. Emplea extensión **`.cjs`** para los archivos de configuración Node, porque el frontend Vite del 033 tiene `"type": "module"`; ello evita un conflicto de módulos, no cambia el método de pruebas.

- **Evidencia histórica:** 35/35 pruebas aprobadas el 18-10-2026 (captura aportada).
- **Selección final a pedido de la estudiante:** **10 casos** adaptados a GlowLab, conforme al nivel máximo de la rúbrica 049. Son 5 pruebas de componentes, 2 de validaciones, 1 del organismo Atomic y 2 de CRUD.
- **Objetivo actual:** ejecutar `npm.cmd test` y `npm.cmd run test:coverage` con **10 tests** y documentar los porcentajes resultantes.
- `karma-coverage` se agregó sobre la base de los apuntes 037/045, aunque no figura en el RAR 047.

## Diferencias que no conviene eliminar

1. Paleta, textos, imágenes, categorías y validaciones corresponden a la tienda GlowLab, no a videojuegos ni a recetas.
2. Almacenar el CRUD en JavaScript cumple el 040, pero impide que `api/` tenga exactamente las mismas llamadas Axios del 033.
3. `karma.conf.cjs`/`webpack.config.cjs`/`babel.config.cjs` requieren una extensión compatible con `"type": "module"` de Vite.
4. El proyecto React vive dentro de `frontend/` para conservar el Flask anterior en la raíz del repositorio.
5. La autenticación `localStorage` es **solo educativa**; no es equivalente a una protección de backend.

**Conclusión:** misma arquitectura principal que el 033 y misma descomposición atómica de catálogo que el 034. No se promete identidad línea por línea en componentes donde difieren el dominio skincare o las instrucciones de persistencia del 040.
