const path = require("path");

module.exports = env => ({
  mode: env.production ? "production" : "development",
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "react-optimize.js",
    library: "react-optimize",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: {
    react: "react"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "awesome-typescript-loader",
          options: {
            errorsAsWarnings: true
          }
        },
        exclude: /node_modules/
      },
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
