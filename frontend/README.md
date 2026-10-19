# GlowLab Skincare · React (evaluación DSY1104)

Migración del frontend Flask/Jinja a React según **027 (tutorial HTML→React)**, **033 (estructura React)**, **034 (componentes reutilizables)**, **037 (informes de cobertura)**, **040 (anexo de Evaluación Parcial 2)** y **047 (Jasmine/Karma)**.

**Origen de datos actual:** archivo JavaScript de prueba `src/data/datosIniciales.js` + CRUD en `src/storage/` + persistencia `localStorage`. Los módulos `src/api/` mantienen los mismos nombres públicos, pero ya no hacen solicitudes HTTP. No se requiere Flask para ejecutar el frontend de React. No se añadieron librerías de datos, estado ni autenticación externas.

**Respaldo conservado:** `app.py`, `run_react_api.py`, `glowlab_api/` y SQLite no fueron borrados. La rama `main` permanece intacta.

## 1. Requisitos

- Windows con Node.js y npm disponibles.
- Google Chrome, necesario para `ChromeHeadless`.
- Navegador con `localStorage` habilitado. **Python y Flask ya no son necesarios para React.**

## 2. Iniciar React sin Flask

Abre PowerShell en la **raíz** del proyecto y ejecuta:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Abre `http://localhost:5173`. Los productos e imágenes estarán disponibles **sin ejecutar Python ni iniciar Flask**. Las imágenes están en `frontend/public/static/img/`, copiadas de los recursos originales para Vite.

## 3. Cómo funciona la persistencia

- **`src/data/datosIniciales.js`:** productos, usuarios de prueba, categorías, regiones, comunas, roles y blog.
- **`src/storage/persistencia.js`:** crea las colecciones por primera vez y guarda/lee datos JSON en `localStorage`.
- **`src/storage/productos.js` y `usuarios.js`:** funciones CRUD, validaciones y controles de rol simulados.
- **`src/storage/carrito.js` y `otros.js`:** carrito, checkout de demostración, blog, catálogos y mensajes.
- **`src/api/`:** conserva la interfaz utilizada por componentes y páginas; ahora delega a las funciones JS.
- **Estado React:** `AuthContext` y `CartContext` sincronizan los cambios, incluso con eventos de almacenamiento.

Los datos permanecen en **ese navegador**, incluso después de actualizar la página. No se transfieren ni sincronizan con SQLite o con la versión Flask antigua. Cada navegador/perfil tiene su propia copia. Para reiniciar a los datos originales, deben borrarse las claves `glowlab_react_*_v1` del almacenamiento del sitio, lo cual elimina los cambios locales.

**Seguridad:** almacenamiento, sesión y roles en el cliente son únicamente una simulación educativa. Se usa un hash de demostración en lugar de contraseñas legibles, pero **no es autenticación segura**; no guardar información real ni publicar esta versión como tienda productiva.

## Organización del frontend según el profesor

El **033 Nexo Gaming React** es la plantilla principal: `api/`, `context/`, `hooks/`, `components/productos/`, `components/layout/`, `pages/` y `App.jsx`. `src/main.jsx` conserva el mismo montaje que el RAR 033; `useAuth` y `useCart` siguen la misma comprobación de Context Provider.

Dentro de `components/` se aplicó también el **034 React Atomic**:

```text
atoms/       Buscador, SelectorCategoria, TituloProducto, atoms.css
molecules/   FiltrosProductos, TarjetaProducto, molecules.css
organisms/   ListaProductos, organisms.css
```

`pages/Productos.jsx` carga los datos y los pasa a `ListaProductos`, que controla la búsqueda con `useState` y compone las moléculas, de forma comparable a `ListaRecetas` del profesor. Se mantienen `ProductoCard` y `ProductoGrid` en la ruta del 033 para la portada.

**Diferencia necesaria:** el documento 040 pide CRUD en JavaScript; por ello `api/` delega en `storage/` y `localStorage` en lugar de utilizar Axios/Flask del 033. Esto no puede ser idéntico línea por línea a ambos ejemplos a la vez.

Mira `docs/Comparacion-Ejemplos-Profesor.md` para la correspondencia real de cada ejemplo y sus diferencias.

## 4. Ejecutar pruebas según ejemplo 047

En `frontend`:

```powershell
npm test
```

Karma iniciará ChromeHeadless, Webpack compilará las specs con Babel y Jasmine mostrará los resultados.
Para el modo interactivo:

```powershell
npm run test:watch
```

Para ajustarse a la rúbrica 049 y a la decisión de la estudiante, la suite se redujo a **exactamente 10 pruebas Jasmine** distribuidas en `test/componentes.spec.js` (5), `test/validaciones.spec.js` (2), `test/atomic.spec.js` (1) y `test/persistencia.spec.js` (2).

Los casos cubren **props, renderizado, eventos con `jasmine.createSpy`, estado, validación y CRUD**; mantienen el procedimiento de Jasmine/Karma del ejemplo 047, adaptado a GlowLab. Se eliminaron 30 casos de pruebas, **no archivos de la aplicación ni funcionalidades**. La ejecución de estas 10 pruebas está pendiente de comprobar en Windows. El detalle está en `docs/Pruebas-GLOWLAB-React.md`.

### Informe de cobertura (apuntes 037 del profesor)

El documento `037 MC_Informes de cobertura.pdf` explica el uso de **karma-coverage**, así que se añadió únicamente ese paquete. Para obtener los porcentajes reales:

```powershell
cd frontend
npm.cmd install
npm.cmd run test:coverage
```

Abre `frontend/coverage/html/index.html` para consultar el informe de líneas, ramas, funciones y sentencias; Karma también imprime un resumen en la terminal. La instrumentación se aplica a **módulos de `src/` importados por las pruebas**, no a las bibliotecas de `node_modules` ni a los archivos `test/*.spec.js`. Los módulos no importados por ninguna prueba no figurarán en el porcentaje: no interpretes ese número como cobertura de **toda** la aplicación. El informe se genera localmente y se excluye de Git por `.gitignore`.

**Medición histórica:** con 35 pruebas, la estudiante obtuvo 59,61 % de sentencias, 53,55 % de ramas, 64,80 % de funciones y 64,05 % de líneas (captura del informe HTML). **Estos porcentajes ya no describen la suite actual de diez pruebas**. Repetir `npm.cmd run test:coverage` y registrar el nuevo resultado; ver `docs/Pruebas-GLOWLAB-React.md`.

## 5. Compilar frontend

```powershell
cd frontend
npm run build
```

Vite genera `frontend/dist` (no subir `dist` ni `node_modules`).

## 6. Cuentas de demostración iniciales

- Administrador: `admin@gmail.com` / `admin123`
- Vendedor: `vendedor@gmail.com` / `vend1234`
- Cliente: `camila@gmail.com` / `cliente1`

Las cuentas de demostración anteriores conservan sus datos de inicio de sesión, pero ahora están simuladas en `localStorage` de React. El hash del navegador no ofrece protección equivalente a una autenticación de servidor. No reutilices credenciales reales.

## 7. Funcionalidad

- Catálogo activo, búsqueda local, filtro por categoría, detalle con stock, carrito y confirmación de compra simulada.
- Registro, inicio/cierre de sesión; vistas protegidas por roles.
- Administrador: panel, crear/editar/eliminar productos y usuarios.
- Vendedor: panel y consulta del catálogo administrativo, sin mantenimiento de usuarios.
- Blog, nosotros y contacto.

## 8. Alcance y límites

1. Flask/SQLite permanecen intactos como respaldo, pero **React usa datos simulados en JavaScript + localStorage**, según el anexo 040. No hay migración automática de registros de SQLite.
2. El checkout es **simulado**, sin pasarela de pago ni transacciones reales. Vacía el carrito, manteniendo el comportamiento anterior de demostración.
3. Las colecciones se inicializan solo si aún no existen para preservar las ediciones del estudiante.
4. La autorización por roles ocurre en JavaScript del navegador: **no constituye protección de datos de un sistema real**.
5. Las 35 pruebas anteriores se ejecutaron satisfactoriamente en Windows (18-10-2026). La suite se redujo a **10 casos actuales**, que deben volver a ejecutarse; también debe actualizarse la cobertura y probarse manualmente CRUD, login y responsividad.

## 9. Rutas principales

`/`, `/productos`, `/productos/:codigo`, `/carrito`, `/login`, `/registro`, `/nosotros`, `/blog`, `/blog/:id`, `/contacto`, `/admin`, `/admin/productos`, `/admin/usuarios`.
