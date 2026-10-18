// Configuración adaptada de "047 Ejemplo Test Karma Jasmin" del profesor.
const webpackConfig = require("./webpack.config.cjs");
module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],
    files: [{ pattern: "test/**/*.spec.js", watched: false }],
    preprocessors: { "test/**/*.spec.js": ["webpack"] },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    plugins: [
      "karma-jasmine",
      "karma-webpack",
      "karma-chrome-launcher",
      "karma-spec-reporter",
      "karma-jasmine-html-reporter"
    ],
    reporters: ["spec", "kjhtml"],
    specReporter: { suppressSkipped: true, showSpecTiming: true },
    client: { clearContext: false, jasmine: { random: true } },
    browsers: ["ChromeHeadless"],
    singleRun: true,
    autoWatch: true
  });
};
