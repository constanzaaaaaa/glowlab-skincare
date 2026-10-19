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
| **Total** | | **25 definidos** | Supera el mínimo de 10 de la pauta; ejecución completa verificada por la estudiante |

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
| Casos unitarios definidos | 25 |
| Casos aprobados | **25 en la segunda ejecución del 18-10-2026** |
| Casos fallidos | **0 en la segunda ejecución del 18-10-2026** |
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

### Resultado real de cobertura — 18-10-2026, 22:06 (hora indicada por Karma)

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

**Estado:** porcentajes registrados tal como aparecen en la captura de la estudiante. El informe HTML permanece en su equipo y no se ha inspeccionado archivo por archivo. No se declara un mínimo de cobertura cumplido sin evidencia de un umbral numérico definido en la rúbrica.

## Evidencias sugeridas

- Captura de consola de `npm test` con resultado y número de specs.
- Captura de catálogo filtrado, producto con stock agotado, carrito y formulario con validación.
- Demostración de un test con `describe`, `it`, `expect` y mock `jasmine.createSpy`.
- Mostrar rutas `src/`, `test/`, `context/`, `api/` y `components/`.
