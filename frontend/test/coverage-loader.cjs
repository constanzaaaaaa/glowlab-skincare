// Loader de instrumentación para Webpack/Karma.
// Reutiliza Istanbul, dependencia incluida en karma-coverage (apuntes 037).
// Solo se activa con npm run test:coverage; no cambia npm test.
const path = require("path");

// Resolve desde el paquete karma-coverage para no añadir otro paquete npm.
const instrumentPath = require.resolve("istanbul-lib-instrument", {
  paths: [path.dirname(require.resolve("karma-coverage"))]
});
const { createInstrumenter } = require(instrumentPath);

module.exports = function coverageLoader(source, inputSourceMap) {
  this.cacheable?.();
  const archivo = path.relative(path.resolve(__dirname, ".."), this.resourcePath).replace(/\\/g, "/");
  const instrumenter = createInstrumenter({
    compact: false,
    esModules: true,
    produceSourceMap: true
  });
  try {
    const instrumentado = instrumenter.instrumentSync(source, archivo, inputSourceMap || undefined);
    this.callback(null, instrumentado, instrumenter.lastSourceMap() || inputSourceMap);
  } catch (error) {
    this.callback(error);
  }
};
