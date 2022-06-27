const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Package = require("./package.json");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackChangeAssetsExtensionPlugin = require("html-webpack-change-assets-extension-plugin");
const path = require("path");
const commitHash = require("child_process")
  .execSync("git rev-parse --short=8 HEAD")
  .toString();
const branchName = require("child_process")
  .execSync("git show -s --pretty=%D HEAD")
  .toString()
  .split(",")
  .pop()
  .trim();

module.exports = (env, argv) => {
  const devVersion =
    `${branchName} (${commitHash}) - v${Package.version}`.replace(
      /(\r\n|\n|\r)/gm,
      ""
    );
  const prodVersion = `BassLines (${commitHash}) v${Package.version}`.replace(
    /(\r\n|\n|\r)/gm,
    ""
  );

  return {
    output: {
      hashFunction: "xxhash64",
      pathinfo: false,
      path: `${__dirname}/../BassLines.Api/wwwroot`,
      clean: true,
      filename: "[name].[contenthash].js",
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: path.resolve(__dirname, "src"),
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
            {
              loader: "ts-loader",
              options: { transpileOnly: true },
            },
          ],
        },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: "pre",
          include: path.resolve(__dirname, "src"),
          test: /\.js$/,
          loader: "source-map-loader",
        },
      ],
    },
    plugins: [
      new CompressionPlugin({
        deleteOriginalAssets: true,
        test: /\.(js|html|css)$/,
      }),
      new HtmlWebpackPlugin({
        baseUrl: "/",
        template: "index.ejs",
        version: argv.mode === "development" ? devVersion : prodVersion,
        jsExtension: ".gz",
      }),
      new CopyPlugin({
        patterns: [{ from: "assets" }, "configs.js"],
      }),
      new HtmlWebpackChangeAssetsExtensionPlugin(),
    ],
    entry: {
      main: "./src/index.tsx",
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      runtimeChunk: "single",
      moduleIds: "deterministic",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  };
};
