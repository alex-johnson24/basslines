const TerserPlugin = require('terser-webpack-plugin');
const GoogleFontsPlugin = require('google-fonts-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Package = require('./package.json');
const path = require('path');
const commitHash = require('child_process')
    .execSync('git rev-parse --short=8 HEAD')
    .toString();
const branchName = require("child_process")
    .execSync("git show -s --pretty=%D HEAD")
    .toString()
    .split(",")
    .pop()
    .trim();

module.exports = (env, argv) => {

    const devVersion = `${branchName} (${commitHash}) - v${Package.version}`.replace(
        /(\r\n|\n|\r)/gm,
        ""
    );
    const prodVersion = `CHAGGARCHARTS (${commitHash}) v${Package.version}`.replace(
        /(\r\n|\n|\r)/gm,
        ""
    );

    return {
        output: {
            pathinfo: false,
            path: `${__dirname}/../ChaggarCharts.Api/wwwroot`,
        },
        // Enable sourcemaps for debugging webpack's output.
        devtool: "none",
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: path.resolve(__dirname, 'src'),
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        },
                        {
                            loader: "ts-loader",
                            options: { transpileOnly: true }
                        }
                    ]
                },
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                {
                    enforce: "pre",
                    include: path.resolve(__dirname, 'src'),
                    test: /\.js$/,
                    loader: "source-map-loader"
                }
            ]
        },
        plugins: [
            new GoogleFontsPlugin({
                fonts: [
                    {
                        family: 'Oxanium:300,500,700',
                    },
                ],
                formats: [
                    'woff',
                    'woff2',
                ],
            }),
            new HtmlWebpackPlugin({
                baseUrl: argv.mode === 'development' ? '/' : '/chaggarcharts/',
                template: 'index.ejs',
                version: argv.mode === 'development' ? devVersion : prodVersion
            })
        ],
        entry: {
            main: './src/index.tsx'
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                }),
            ],
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"]
        },
    }
};