const path = require("path");

module.exports = env => ({
  mode: env.production ? "production" : "development",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "react-optimize.js",
    library: "react-optimize",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: {
    react: "react",
    "prop-types": "prop-types"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  }
});
