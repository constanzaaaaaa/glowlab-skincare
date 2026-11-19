// Webpack empaqueta las pruebas. La aplicación React se sirve con Vite (ejemplo 033).
module.exports = {
  mode: "development",
  module: {
    rules: [
      { test: /\.m?jsx?$/, resolve: { fullySpecified: false } },
      { test: /\.jsx?$/, exclude: /node_modules/, use: "babel-loader" }
    ]
  },
  resolve: { extensions: [".js", ".jsx"] }
};
