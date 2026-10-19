# Matriz de pruebas — GlowLab Skincare React

**Base metodológica:** `047 Ejemplo Test Karma Jasmin` del profesor.
**Framework:** Jasmine (`describe`, `it`, `expect`).
**Runner:** Karma + ChromeHeadless.
**Compilación de specs:** Webpack + Babel.
**Interfaz:** Testing Library en `test/componentes.spec.js`.

## Casos definidos en el código

| Grupo | Archivo | Casos | Cobertura funcional prevista |
|---|---|---:|---|
| Catálogo y carrito | `test/formato.spec.js` | 9 | Estado, nombre, categoría, stock, precios y totales |
| Validaciones | `test/validaciones.spec.js` | 10 | Correo, dominios, contraseña, RUN, textos, stock entero |
| Componentes | `test/componentes.spec.js` | 6 | Props, enlaces, evento de agregar, sin stock, catálogo vacío, ruta inexistente |
| Persistencia JS y CRUD | `test/persistencia.spec.js` | 10 | Datos iniciales, guardar colecciones, CRUD de productos, permisos, carrito y contacto |
| Atomic Design | `test/atomic.spec.js` | **4 nuevos** | Átomos, moléculas, organismo y filtrado por estado |
| **Total** | | **39 definidos** | 35 anteriores verificados; 4 nuevos pendientes de ejecución |

## Proceso

1. Instalar Node.js LTS, Google Chrome y dependencias: `cd frontend; npm install`.
2. Ejecutar `npm test`, que activa `karma.conf.cjs`.
3. Karma carga Jasmine, compila specs con Webpack/Babel y ejecuta en ChromeHeadless.
4. Registrar resultado de cada caso y el número total de aprobados.
5. Si hay errores, corregirlos y repetir. Adjuntar captura de consola como evidencia.
6. Presentar componentes probados, datos de prueba y resultados durante la defensa.

## Resultados

| Medida | Estado actual |
|---|---|
| Casos unitarios definidos | **39 actuales** (35 verificados anteriormente) |
| Casos aprobados | **35/35 en la ejecución del 18-10-2026**, previa a los 4 casos Atomic |
| Casos fallidos | **0 en esa ejecución; pendientes los 4 casos nuevos** |
| Porcentaje de sentencias | **38,00 % (38/100)** |
| Porcentaje de ramas | **71,73 % (33/46)** |
| Porcentaje de funciones | **42,22 % (19/45)** |
| Porcentaje de líneas | **39,53 % (34/86)** |

### Evidencia de ejecución del 18-10-2026

Entorno observado: Karma 6.4.4, Webpack 5.112.0, ChromeHeadless 155.0.0.0, Windows 10.

**Resultado enviado por la estudiante: 25 ejecutadas, 24 aprobadas y 1 fallida.**
La prueba fallida fue **21 - muestra enlace al detalle correcto** (`test/componentes.spec.js`).
La implementación usaba `<Button as={Link}>` de React-Bootstrap, que produjo un elemento `<a role="button">`.
Testing Library buscaba un enlace accesible con `getByRole("link", {name:"Ver detalle"})`, así que no lo encontraba aunque la dirección `href="/productos/GL-001"` fuera correcta.

**Corrección aplicada:** `ProductoCard.jsx` ahora representa la navegación con `<Link to={...} className="btn btn-outline-info btn-sm">`. Esta corrección preserva la apariencia Bootstrap y permite que el navegador exponga el elemento como enlace, que es lo apropiado para navegar.

**Estado posterior a la corrección, comprobado en Windows:** la estudiante ejecutó `npm.cmd test` nuevamente el 18-10-2026 a las 20:18. La captura muestra `Executed 25 of 25 SUCCESS` y `TOTAL: 25 SUCCESS`. Esto confirma que el caso 21 pasó tras la corrección y que no quedaron casos fallidos en esa ejecución.

Ambas ejecuciones mostraron advertencias `404 /static/img/productos/hidratante1.webp` emitidas por el servidor de Karma, independiente de Flask/Vite. Estas advertencias no afectaron las 25 pruebas ni implican, por sí solas, que las imágenes estén rotas en la aplicación real. La captura de la segunda ejecución es evidencia aportada en la conversación, no un archivo adjunto al repositorio.

### Informe de cobertura: configuración añadida según documento 037

Los apuntes **037 MC_Informes de cobertura.pdf** del profesor explican que **Karma + Jasmine pueden medir cobertura con `karma-coverage`**. Esto amplía el ejemplo 047 (que enseña las pruebas, pero no configura ese paquete).

En la rama `migracion-react-profesor` se añadió `karma-coverage` como dependencia de desarrollo, un script separado `test:coverage` y una instrumentación de módulos React originales mediante Istanbul, que ya es dependencia de `karma-coverage`. `npm test` permanece con la configuración de las 25 pruebas ya aprobadas.

**Comandos para obtener una medición real en Windows:**

```powershell
cd frontend
npm.cmd install
npm.cmd run test:coverage
```

**Archivos generados:** `frontend/coverage/html/index.html` (HTML) y `frontend/coverage/lcov.info` (reporte LCOV). El informe indica porcentajes de líneas, funciones, sentencias y ramas.

**Alcance importante:** la cobertura se calcula sobre los módulos `src/` que las pruebas alcanzan a importar. Los módulos no importados quedan fuera del denominador. Por eso esta primera medición es una **cobertura de los módulos ejercitados**, no una certificación de cobertura de toda GlowLab.

### Resultado histórico de cobertura — 18-10-2026, 22:06 (antes de agregar CRUD JS)

La estudiante ejecutó `npm.cmd run test:coverage` en Windows 10 con ChromeHeadless 155.0.0.0 y compartió una captura del resumen de terminal.

```text
Chrome Headless 155.0.0.0 (Windows 10): Executed 25 of 25 SUCCESS
TOTAL: 25 SUCCESS

Coverage summary
Statements : 38%    (38/100)
Branches   : 71.73% (33/46)
Functions  : 42.22% (19/45)
Lines      : 39.53% (34/86)
```

**Interpretación:** todas las pruebas ejecutadas pasaron (25/25). Los porcentajes representan cuánta parte del código **instrumentado por esta ejecución** se ejercitó, no el porcentaje de pruebas aprobadas ni la cobertura integral del frontend. En particular, esta configuración instrumenta únicamente los módulos de `src/` importados por las pruebas: otros módulos pueden quedar completamente fuera del denominador.

**Áreas de mejora:** la cobertura de funciones (42,22 %) y líneas (39,53 %) sugiere crear nuevos casos de prueba para las funciones y rutas todavía sin ejercitar. Conviene abrir el informe `coverage/html/index.html` y revisar sus líneas rojas antes de diseñar casos adicionales; estas cifras no permiten por sí solas identificar funciones específicas sin ver el reporte por archivo.

**Estado:** porcentajes históricos registrados tal como aparecen en la captura aportada por la estudiante. Son válidos para esa ejecución de 25 pruebas, **pero no para la nueva versión de 35 casos y persistencia JavaScript**. Es obligatorio repetir `npm.cmd test` y `npm.cmd run test:coverage` para obtener el resultado actual. El informe HTML histórico no se ha inspeccionado archivo por archivo.

### Evidencia actual de funcionamiento y pruebas — 18-10-2026

La estudiante presentó **dos capturas** tras actualizar la rama de migración:

- **Vite/React en el navegador:** se observa la página de inicio en `localhost:5173`, el encabezado, el menú y cuatro productos destacados con sus imágenes y precios. Esto confirma que la vista inicial y esos recursos cargaron en su entorno local.
- **Jasmine/Karma en Windows:** el registro termina con `Chrome Headless 155.0.0.0 (Windows 10): Executed 35 of 35 SUCCESS` y `TOTAL: 35 SUCCESS`. Resultado confirmado: **35 aprobadas, 0 fallidas**.
- **Advertencia:** aparece `WARN [web-server]: 404: /static/img/productos/hidratante1.webp` durante el test. No hace fallar las specs; la captura independiente de Vite sí muestra las imágenes de los productos. La advertencia pertenece a la forma de servir recursos del runner Karma y no acredita por sí sola un fallo en el catálogo de Vite.

Estas evidencias **no validan todavía todos los flujos manuales** (login, edición de productos y usuarios, carrito en navegador, diseño móvil). La cobertura histórica previa de 25 casos tampoco representa la versión nueva de 35 casos.

### Nueva capa de persistencia del anexo 040

Desde esta revisión, `src/data/datosIniciales.js` y `src/storage/` implementan la fuente simulada de datos y el CRUD en `localStorage`. Se añadieron diez specs (`26` a `35`) que comprueban persistencia, permisos, catálogo, carrito y contacto.

La autenticación del navegador es **una simulación académica**. Los archivos de Flask/SQLite quedaron intactos, pero no están conectados a la versión React actual.

**Verificación realizada:** la estudiante ejecutó `npm.cmd test` y aportó una captura en Windows 10/ChromeHeadless 155.0.0.0 con `Executed 35 of 35 SUCCESS` y `TOTAL: 35 SUCCESS` (18-10-2026 a las 22:56, según la consola). **Los 35 casos pasaron, incluidos los 10 nuevos del CRUD simulado.** Pendiente: volver a ejecutar `npm.cmd run test:coverage` y registrar los nuevos porcentajes; las cifras anteriores corresponden a solo 25 casos.

### Fidelidad a ejemplos 033, 034 y 047 — pruebas Atomic añadidas

En la reorganización basada en los **RAR originales** del profesor, se conservó la estructura `src/components/productos/` del 033 y se aplicó `atoms/` → `molecules/` → `organisms/` del 034 al catálogo GlowLab.

El archivo nuevo `frontend/test/atomic.spec.js` añade los casos **36–39** para verificar los cambios del átomo Buscador, la composición de la molécula FiltrosProductos, el filtrado del organismo ListaProductos y la exclusión de productos inactivos.

**Pendiente:** ejecutar `npm.cmd test` en Windows para confirmar si los 39 casos pasan. Repetir `npm.cmd run test:coverage` después: los porcentajes de la captura anterior (59,61 % sentencias, 53,55 % ramas, 64,80 % funciones, 64,05 % líneas) corresponden a la versión de **35 pruebas previa a esta reorganización** y **todavía no son los del proyecto actual**. La comparación detallada está en `docs/Comparacion-Ejemplos-Profesor.md`.

## Evidencias sugeridas

- Captura de consola de `npm test` con resultado y número de specs.
- Captura de catálogo filtrado, producto con stock agotado, carrito y formulario con validación.
- Demostración de un test con `describe`, `it`, `expect` y mock `jasmine.createSpy`.
- Mostrar rutas `src/`, `test/`, `context/`, `api/` y `components/`.
