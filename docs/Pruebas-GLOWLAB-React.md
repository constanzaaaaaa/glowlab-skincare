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
| Porcentaje de líneas | No medido |
| Porcentaje de ramas | No medido |

### Evidencia de ejecución del 18-10-2026

Entorno observado: Karma 6.4.4, Webpack 5.112.0, ChromeHeadless 155.0.0.0, Windows 10.

**Resultado enviado por la estudiante: 25 ejecutadas, 24 aprobadas y 1 fallida.**
La prueba fallida fue **21 - muestra enlace al detalle correcto** (`test/componentes.spec.js`).
La implementación usaba `<Button as={Link}>` de React-Bootstrap, que produjo un elemento `<a role="button">`.
Testing Library buscaba un enlace accesible con `getByRole("link", {name:"Ver detalle"})`, así que no lo encontraba aunque la dirección `href="/productos/GL-001"` fuera correcta.

**Corrección aplicada:** `ProductoCard.jsx` ahora representa la navegación con `<Link to={...} className="btn btn-outline-info btn-sm">`. Esta corrección preserva la apariencia Bootstrap y permite que el navegador exponga el elemento como enlace, que es lo apropiado para navegar.

**Estado posterior a la corrección, comprobado en Windows:** la estudiante ejecutó `npm.cmd test` nuevamente el 18-10-2026 a las 20:18. La captura muestra `Executed 25 of 25 SUCCESS` y `TOTAL: 25 SUCCESS`. Esto confirma que el caso 21 pasó tras la corrección y que no quedaron casos fallidos en esa ejecución.

Ambas ejecuciones mostraron advertencias `404 /static/img/productos/hidratante1.webp` emitidas por el servidor de Karma, independiente de Flask/Vite. Estas advertencias no afectaron las 25 pruebas ni implican, por sí solas, que las imágenes estén rotas en la aplicación real. La captura de la segunda ejecución es evidencia aportada en la conversación, no un archivo adjunto al repositorio.

### Limitación de cobertura

La configuración de Karma del **047** no utiliza `karma-coverage` y el usuario pidió conservar estrictamente las dependencias del profesor. Por eso **no se agregó una biblioteca de instrumentación ajena al ejemplo ni se informa un 85 % ficticio**.

La matriz anterior indica **cobertura funcional de casos**, no porcentajes instrumentados de líneas/ramas. Si la rúbrica exige porcentajes, deberán obtenerse mediante un mecanismo de medición explícitamente autorizado y ejecutado realmente. No presentar la matriz como reporte numérico de cobertura.

## Evidencias sugeridas

- Captura de consola de `npm test` con resultado y número de specs.
- Captura de catálogo filtrado, producto con stock agotado, carrito y formulario con validación.
- Demostración de un test con `describe`, `it`, `expect` y mock `jasmine.createSpy`.
- Mostrar rutas `src/`, `test/`, `context/`, `api/` y `components/`.
