// Jasmine + Karma según el ejemplo 047.
// La medición de cobertura es optativa y usa karma-coverage según los apuntes 037.
const path = require("path");
const webpackConfig = require("./webpack.config.cjs");
const medirCobertura = process.env.npm_lifecycle_event === "test:coverage";

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],
    files: [{ pattern: "test/**/*.spec.js", watched: false }],
    preprocessors: { "test/**/*.spec.js": ["webpack"] },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          ...webpackConfig.module.rules,
          ...(medirCobertura ? [{
            enforce: "post",
            test: /\.jsx?$/,
            include: path.resolve(__dirname, "src"),
            use: [path.resolve(__dirname, "test", "coverage-loader.cjs")]
          }] : [])
        ]
      },
      resolve: webpackConfig.resolve
    },
    plugins: [
      "karma-jasmine",
      "karma-webpack",
      "karma-chrome-launcher",
      "karma-spec-reporter",
      "karma-jasmine-html-reporter",
      "karma-coverage"
    ],
    reporters: medirCobertura ? ["spec", "coverage"] : ["spec", "kjhtml"],
    coverageReporter: {
      dir: path.resolve(__dirname, "coverage"),
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text-summary" },
        { type: "lcovonly", subdir: "." }
      ]
    },
    specReporter: { suppressSkipped: true, showSpecTiming: true },
    client: { clearContext: false, jasmine: { random: true } },
    browsers: ["ChromeHeadless"],
    singleRun: true,
    autoWatch: true
  });
};
