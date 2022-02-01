const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

console.log(MiniCssExtractPlugin.loader);

module.exports = {
  entry: {
    "build/bundle": ["./src/main.ts"],
  },
  resolve: {
    alias: {
      svelte: path.dirname(require.resolve("svelte/package.json")),
    },
    extensions: [".mjs", ".js", ".ts", ".svelte", ".scss"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  output: {
    path: path.join(__dirname, "/public"),
    filename: "[name].js",
    chunkFilename: "[name].[id].js",
  },
  externals: {
    fs: "fs",
  },
  experiments: {
    asyncWebAssembly: true,
    // importAsync: true,
  },
  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          !prod ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: !prod,
            },
          },
        ],
      },
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          !prod ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: !prod,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: !prod,
            },
          },
        ],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.wasm$/,
        type: "javascript/auto",
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev: !prod,
            },
            emitCss: prod,
            hotReload: !prod,
            preprocess: sveltePreprocess({ sourceMap: !prod }),
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        // required to prevent errors from Svelte on Webpack 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new NodePolyfillPlugin(),
  ],
  devtool: prod ? false : "source-map",
  devServer: {
    hot: true,
  },
};
