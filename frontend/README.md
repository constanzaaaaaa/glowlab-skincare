# GlowLab Skincare · React (evaluación DSY1104)

Migración del frontend Flask/Jinja original a React, respetando la arquitectura de los ejemplos del profesor:

- **033 Nexo Gaming React**: Vite, React, React Router, React-Bootstrap, Axios, SweetAlert2, páginas, layouts, contextos y API Flask.
- **034 React Atomic**: separación de piezas reutilizables mediante props (tarjetas, cuadrícula, tabla y layouts).
- **047 Test Karma Jasmine**: Jasmine, Karma, Webpack, Babel, ChromeHeadless, specs y Testing Library.

No se agregó un gestor de estado externo ni una biblioteca distinta a las usadas en estos ejemplos. **La rama `main` y el archivo `app.py` original no se reemplazaron.**

## 1. Requisitos

- Windows con Node.js y npm disponibles.
- Python con pip.
- Google Chrome, necesario para `ChromeHeadless`.

## 2. Iniciar Flask y la API

Abre PowerShell en la **raíz** `glowlab-skincare` (no dentro de `frontend`):

```powershell
py -m pip install -r requirements-react.txt
py run_react_api.py
```

La API responde en `http://localhost:5000/api/health`.
El Flask original sigue ofreciendo sus plantillas en el mismo puerto cuando ejecutas `run_react_api.py`.

Los registros React usan SQLite, creada automáticamente como `glowlab_react.sqlite` en la carpeta del proyecto. Es una base de datos **independiente** de los datos `localStorage` del Flask original. Las imágenes se reutilizan desde `static/img`, sin duplicarlas.

## 3. Iniciar React

En **otra** ventana de PowerShell:

```powershell
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Mantén abierta la ventana de Flask.
Vite redirige `/api` y `/static` a Flask para conservar la comunicación enseñada en el ejemplo 033, sin agregar dependencias de proxy.

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

Hay **25 casos definidos y 25 aprobados** (ejecución aportada el 18-10-2026) en tres archivos `test/*.spec.js` sobre utilidades, validaciones, componentes, props, stock y carrito.

### Informe de cobertura (apuntes 037 del profesor)

El documento `037 MC_Informes de cobertura.pdf` explica el uso de **karma-coverage**, así que se añadió únicamente ese paquete. Para obtener los porcentajes reales:

```powershell
cd frontend
npm.cmd install
npm.cmd run test:coverage
```

Abre `frontend/coverage/html/index.html` para consultar el informe de líneas, ramas, funciones y sentencias; Karma también imprime un resumen en la terminal. La instrumentación se aplica a **módulos de `src/` importados por las pruebas**, no a las bibliotecas de `node_modules` ni a los archivos `test/*.spec.js`. Los módulos no importados por ninguna prueba no figurarán en el porcentaje: no interpretes ese número como cobertura de **toda** la aplicación. El informe se genera localmente y se excluye de Git por `.gitignore`.

**No se ha ejecutado todavía `test:coverage` en Windows, por tanto no se informa ningún porcentaje numérico.** Consulta `docs/Pruebas-GLOWLAB-React.md`.

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

Las contraseñas de prueba se guardan **con hash** en SQLite al inicializar la base. No utilices estas credenciales ni la clave secreta de desarrollo en un sistema público.

## 7. Funcionalidad

- Catálogo activo, búsqueda local, filtro por categoría, detalle con stock, carrito y confirmación de compra simulada.
- Registro, inicio/cierre de sesión; vistas protegidas por roles.
- Administrador: panel, crear/editar/eliminar productos y usuarios.
- Vendedor: panel y consulta del catálogo administrativo, sin mantenimiento de usuarios.
- Blog, nosotros y contacto.

## 8. Alcance y límites

1. Las rutas y plantillas Flask originales permanecen intactas, pero la aplicación React utiliza una base SQLite separada de `localStorage`; **no hay sincronización automática entre ambas bases**.
2. Checkout es una **simulación académica** sin cobro real ni pasarela de pago, como el ejemplo del profesor.
3. La base inicial se crea solo cuando las tablas están vacías, para no sobrescribir cambios.
4. El backend incluye una clave de sesión predeterminada solo para desarrollo; configura `GLOWLAB_SECRET_KEY` antes de cualquier uso fuera del entorno local.
5. Este código fue revisado estructuralmente, pero debes ejecutar `npm install`, `npm run dev` y `npm test` en Windows para verificar dependencias, interfaz y pruebas.

## 9. Rutas principales

`/`, `/productos`, `/productos/:codigo`, `/carrito`, `/login`, `/registro`, `/nosotros`, `/blog`, `/blog/:id`, `/contacto`, `/admin`, `/admin/productos`, `/admin/usuarios`.
