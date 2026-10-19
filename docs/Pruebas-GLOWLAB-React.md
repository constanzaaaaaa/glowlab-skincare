# Pruebas unitarias GLOWLAB Skincare — Control 2

## Referencias del profesor

- **047 Ejemplo Test Karma Jasmin:** estructura de Jasmine (`describe`, `it`, `expect`, espías), Karma, ChromeHeadless, Webpack/Babel y Testing Library.
- **049 Control 2 — enunciado y rúbrica:** el desempeño máximo menciona **10/10 pruebas bien estructuradas**. Para la exposición pide demostrar diez pruebas; también valora casos relevantes, mocks y análisis, no solo el número.
- **040 Anexo:** sugiere comprobar renderizado, propiedades, estado y eventos de los componentes, así como lógica y persistencia.
- **037/045 Informes de cobertura:** uso de `karma-coverage`.

**Decisión de la estudiante:** mantener **exactamente 10 pruebas** en lugar de 40. Los casos están adaptados a los productos y componentes de GlowLab, **no son una copia literal de los ejemplos de prueba de otros dominios**.

## Matriz de las 10 pruebas vigentes

| N.º | Archivo | Caso | Qué comprueba |
|---|---|---|---|
| 01 | `test/componentes.spec.js` | Renderiza nombre de producto | Props y renderizado |
| 02 | `test/componentes.spec.js` | Enlace al detalle | Navegación |
| 03 | `test/componentes.spec.js` | Agregar al carrito | Evento + mock `jasmine.createSpy` |
| 04 | `test/componentes.spec.js` | Sin stock deshabilita agregar | Renderizado condicional |
| 05 | `test/componentes.spec.js` | Mensaje de catálogo vacío | Renderizado condicional |
| 06 | `test/validaciones.spec.js` | Acepta correo DUOC | Validación |
| 07 | `test/validaciones.spec.js` | RUN con dígito verificador | Validación positiva y negativa |
| 08 | `test/atomic.spec.js` | Filtro del catálogo cambia al escribir | Estado React (`useState`) y evento |
| 09 | `test/persistencia.spec.js` | Crea y consulta productos | CRUD JavaScript/`localStorage` |
| 10 | `test/persistencia.spec.js` | Edita y elimina productos | CRUD JavaScript/`localStorage` |
| **Total** | **4 archivos `.spec.js`** | **10 casos** | **Técnica del profesor aplicada a GlowLab** |

Se eliminó `test/formato.spec.js` y se redujeron los otros cuatro archivos de prueba. **Solo se quitaron casos de testing, no funcionalidades, componentes, páginas o datos**. El historial de Git permite consultar los casos retirados.

## Comandos en Windows

Desde la carpeta `frontend`:

```powershell
npm.cmd test
npm.cmd run test:coverage
```

La primera orden debe mostrar `Executed 10 of 10 SUCCESS` y `TOTAL: 10 SUCCESS` **cuando se compruebe su ejecución en el equipo de la estudiante**. La segunda genera `frontend/coverage/html/index.html`.

## Evidencias de ejecuciones anteriores (históricas)

- **18-10-2026:** 25/25 pruebas exitosas tras corregir el rol accesible del enlace `Ver detalle`.
- **18-10-2026:** 35/35 pruebas exitosas, incluyendo los 10 casos que se añadieron para CRUD. Captura aportada por la estudiante.
- **18/19-10-2026:** informe HTML observado tras 35 pruebas: **59,61 %** de sentencias (214/359), **53,55 %** de ramas (98/183), **64,80 %** de funciones (81/125) y **64,05 %** de líneas (180/281).

Estas evidencias **no son una ejecución confirmada de la suite actual de diez pruebas**. Los cinco casos Atomic añadidos posteriormente nunca fueron validados como conjunto y se retiraron todos excepto el caso 08.

**Pendiente:** ejecutar las diez pruebas actuales y generar el nuevo informe. **No se reutilizan los porcentajes anteriores como si fueran la cobertura de la suite actual.**

## Alcance y límites

- Jasmine ejecuta expectativas sobre componentes y funciones; los casos que renderizan React utilizan Testing Library y `MemoryRouter` cuando corresponde.
- `jasmine.createSpy` es un *mock* de la operación de añadir al carrito; evita depender de una compra real.
- La persistencia CRUD se prueba en `localStorage` con inicialización y limpieza de las colecciones para evitar contaminación entre casos.
- `karma-coverage` instrumenta los módulos importados por las pruebas, **no todo el frontend**. El número resultante debe interpretarse como cobertura de archivos alcanzados, no como cobertura total de GlowLab.
- La selección de diez pruebas responde expresamente a la rúbrica y a la preferencia de la estudiante. Las pruebas de desarrollo eliminadas no implican que sus funcionalidades se hayan borrado.
