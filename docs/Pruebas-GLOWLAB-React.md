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
| **Total** | | **25 definidos** | Supera el mínimo de 10 de la pauta, pendiente verificar resultado |

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
| Casos aprobados | **Sin verificar: ejecutar `npm test` en Windows** |
| Casos fallidos | Sin verificar |
| Porcentaje de líneas | No medido |
| Porcentaje de ramas | No medido |

### Limitación de cobertura

La configuración de Karma del **047** no utiliza `karma-coverage` y el usuario pidió conservar estrictamente las dependencias del profesor. Por eso **no se agregó una biblioteca de instrumentación ajena al ejemplo ni se informa un 85 % ficticio**.

La matriz anterior indica **cobertura funcional de casos**, no porcentajes instrumentados de líneas/ramas. Si la rúbrica exige porcentajes, deberán obtenerse mediante un mecanismo de medición explícitamente autorizado y ejecutado realmente. No presentar la matriz como reporte numérico de cobertura.

## Evidencias sugeridas

- Captura de consola de `npm test` con resultado y número de specs.
- Captura de catálogo filtrado, producto con stock agotado, carrito y formulario con validación.
- Demostración de un test con `describe`, `it`, `expect` y mock `jasmine.createSpy`.
- Mostrar rutas `src/`, `test/`, `context/`, `api/` y `components/`.
