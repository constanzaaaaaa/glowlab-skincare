# Guion de presentación — GlowLab Skincare (Control 2)

**Proyecto:** rama `migracion-react-profesor`. Este guion acompaña al frontend React; no modifica las diez pruebas Jasmine ni sustituye los requisitos de AWS.

## Preparación en el computador

1. Abrir GitHub Desktop y comprobar la rama `migracion-react-profesor`; actualizar con **Fetch origin → Pull origin** (sin descartar cambios locales).
2. Abrir VS Code en el proyecto. Desde la carpeta `frontend`, ejecutar `npm.cmd install` si es un equipo nuevo y luego `npm.cmd run dev`.
3. Entrar a `http://localhost:5173`. **No hace falta iniciar Flask** para esta versión.
4. Para probar el registro, utilizar datos ficticios y un RUN válido de prueba. El correo debe terminar en `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`.
5. Al empezar, el dashboard puede mostrar **$0**: los pedidos se crean únicamente cuando se confirma una compra en ese navegador.

## Orden recomendado de demostración

### 1. Pantallas y catálogo

- Inicio: `src/pages/Home.jsx`.
- Catálogo y filtros: `src/pages/Productos.jsx`, `src/components/organisms/ListaProductos.jsx`, `src/components/molecules/FiltrosProductos.jsx`.
- Tarjetas de producto: `src/components/molecules/TarjetaProducto.jsx`.
- Navegación: `src/App.jsx` y `src/components/layout/NavBar.jsx`.

Explicación: React muestra las páginas mediante componentes JSX. `useState` guarda el filtro; las props llevan datos y funciones a componentes hijos.

### 2. Registro y validaciones

Abrir `/registro`: probar datos incorrectos antes de registrar una cuenta.

- `src/pages/Registro.jsx`: campos, estado, evento submit y mensajes de error.
- `src/utils/validaciones.js`: correo permitido, contraseña de **4 a 10 caracteres** y cálculo de dígito verificador del RUN.
- `src/storage/usuarios.js`: impedir RUN/correo duplicados y registrar al usuario con rol cliente.

Después iniciar sesión desde `/login`. Las credenciales de demostración están en `frontend/README.md`. No usar datos personales reales.

### 3. Carrito, compra e historial del cliente

Iniciar sesión como **cliente de prueba** (`camila@gmail.com` / `cliente1` si el almacenamiento sigue con las cuentas iniciales).

1. Agregar un producto desde `/productos` y entrar a `/carrito`.
2. Cambiar cantidad sin sobrepasar stock.
3. Presionar **Confirmar compra**, aceptar la ventana de confirmación.
4. Ver la nueva orden `PED-...` en `/mis-compras`, con fecha, productos, cantidades y total.
5. Actualizar la página: debe conservarse el pedido.
6. Cerrar sesión e iniciar con otra cuenta: debe mostrar solo sus propias compras.

**Código:** `src/storage/carrito.js` registra la orden, actualiza existencias y vacía el carrito. `src/storage/pedidos.js` filtra los pedidos por RUN. `src/pages/MisCompras.jsx` los presenta y `src/App.jsx` protege la ruta.

**Aviso:** si no hay sesión iniciada, el botón de confirmar compra está deshabilitado. Se debe iniciar sesión para vincular el pedido con una cuenta.

### 4. Dashboard e informe de ventas

Cerrar sesión e ingresar como administrador (`admin@gmail.com` / `admin123` con datos iniciales).

Entrar a **Administración → Dashboard e informes**, ruta `/admin`.

- **Ventas simuladas:** suma del valor de los pedidos guardados.
- **Pedidos confirmados:** cantidad de órdenes.
- **Unidades vendidas y ticket promedio:** indicadores calculados.
- **Ventas por día:** barras por fecha.
- **Productos más vendidos:** ranking según las cantidades.
- **Período:** todas las fechas, últimos 7 días o últimos 30 días.
- **Descargar informe CSV:** descarga filas de pedidos; no se usa librería nueva.

El panel también muestra productos registrados y stock crítico. Código: `src/pages/admin/AdminPanel.jsx` y `src/storage/pedidos.js`. Un usuario cliente no puede acceder al dashboard mediante las rutas React.

**Si el informe está vacío:** confirmar al menos una compra con la cuenta cliente, después volver a entrar como administrador en el **mismo navegador/perfil**. Las ventas no se sincronizan entre computadores.

### 5. Las diez pruebas Jasmine y la configuración Karma

Mostrar `frontend/test/`:

| Archivo | Cantidad | Tema |
|---|---:|---|
| `componentes.spec.js` | 5 | Props, renderizado, evento y mock del carrito, sin stock, lista vacía |
| `validaciones.spec.js` | 2 | Correo permitido y RUN |
| `atomic.spec.js` | 1 | Cambio de estado/filtro en el catálogo |
| `persistencia.spec.js` | 2 | Crear, consultar, editar y eliminar productos |
| **Total** | **10** | Requisito de cantidad acordado |

Explicación oral: `describe` agrupa pruebas, `it` define cada caso, `expect` comprueba el resultado. `jasmine.createSpy` simula una función para que el test no realice una compra real.

Abrir `frontend/karma.conf.cjs`:
- `frameworks`: Jasmine + Webpack.
- `files`: localiza `test/**/*.spec.js`.
- `preprocessors`: prepara las pruebas con Webpack; Babel transforma JSX.
- `browsers: ["ChromeHeadless"]`: corre los casos en Chrome sin ventana.
- `reporters`: presenta resultados; `karma-coverage` genera el informe si se ejecuta `test:coverage`.
- `singleRun: true`: termina al finalizar las pruebas.

Comandos, siempre dentro de `frontend`:

```powershell
npm.cmd test
npm.cmd run test:coverage
```

**No presentar porcentajes antiguos como cobertura de los diez casos actuales.** Esperar los resultados reales de Windows y guardar capturas para la presentación.

## Limitaciones que conviene explicar sin ocultar

- Se trata de una **simulación académica con JavaScript y localStorage**, no de una tienda real ni de un cobro bancario.
- Los pedidos e informes pertenecen únicamente a ese navegador/perfil; no hay sincronización entre usuarios de diferentes equipos.
- Los controles de sesión y roles del frontend no equivalen a autenticación/autorización segura de backend.
- Este recorrido **no constituye el despliegue de microservicios en AWS** mencionado en otra instrucción del profesor.
- **Estado de verificación:** cambios preparados en GitHub. Todavía falta probar en el equipo del estudiante la compra, el historial, los informes y los diez tests después de esta actualización; no declararlos comprobados antes de hacerlo.
