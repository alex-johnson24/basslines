const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Package = require("./package.json");
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
  const prodVersion =
    `CHAGGARCHARTS (${commitHash}) v${Package.version}`.replace(
      /(\r\n|\n|\r)/gm,
      ""
    );

  return {
    output: {
      hashFunction: "xxhash64",
      pathinfo: false,
      path: `${__dirname}/../ChaggarCharts.Api/wwwroot`,
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
      new HtmlWebpackPlugin({
        baseUrl: argv.mode === "development" ? "/" : "/chaggarcharts/",
        template: "index.ejs",
        version: argv.mode === "development" ? devVersion : prodVersion,
      }),
      new CopyPlugin({
        patterns: [{ from: "assets" }],
      }),
    ],
    entry: {
      main: "./src/index.tsx",
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  };
};
