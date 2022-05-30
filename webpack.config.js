const path = require('path');

// Define HTML plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Define plugin for javascript code optimization
const TerserWebpackPlugin = require("terser-webpack-plugin");
// Define plugin for css code optimization
const OptimizeCssAssetsPlugin = require("css-minimizer-webpack-plugin");
// Define plugin for validating typescript
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
    // Enter through index.ts
    entry: {
        index: './src/index.ts',
        proseqviewer: './src/proseqviewer.ts',
    },
    devtool: 'source-map',
    module: {
        rules: [
            // Typescript compilation
            {
                // Match .ts[x] files
                test: /\.(js|jsx|ts|tsx)$/,
                // Transpile them using the ts-loader
                use: [
                    // Then, use babel
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            // TODO Substitute with production
                            envName: 'development',
                            // TODO Remove in production
                            sourceMaps: true,
                            inputSourceMap: true,
                        },
                    },
                    // // First, use TSC (generates declaration files)
                    // {
                    //     loader: 'ts-loader',
                    // },
                ],
                // Exclude files in node modules
                exclude: /node_modules/,
            },
            // Allow serving image/SVG files
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // Allow serving style
            {
                test: /\.css$/,
                use: [
                    // TODO Change in production
                    "style-loader",
                    "css-loader"
                ]
            },
            // Allow using style preprocessors
            {
                test: /\.s[ac]ss$/,
                use: [
                    // TODO Change in production
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2
                        }
                    },
                    "resolve-url-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            // Allow css modules encapsulation
            {
                test: /\.module.css$/,
                use: [
                    // TODO Change in production
                    "style-loader",
                    // isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },
        ]
    },
    // Configure plugins
    plugins: [
        // Automatically generate HTML file
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
            inject: true
        }),
        // TODO Add MiniCssExtractPlugin
        // Add typescript validator
        new ForkTsCheckerWebpackPlugin({
            async: false
        }),
    ].filter(Boolean),
    // TODO Configure development server
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    // Handle output
    output: {
        // filename: 'sqv-bundle.js'
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        // Export the entry point
        library: {
            name: 'ProSeqViewer',
            type: 'umd',
        },
        umdNamedDefine: true,
        // Clean output directory
        clean: true,
    },
    // Define optimization strategies
    optimization: {
        // TODO Change in production
        minimize: false,
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    compress: {
                        comparisons: false
                    },
                    mangle: {
                        safari10: true
                    },
                    output: {
                        comments: false,
                        ascii_only: true
                    },
                    warnings: false
                }
            }),
            new OptimizeCssAssetsPlugin()
        ],
        // TODO Implement code splitting
    },
    // Define development server settings
    devServer: {
        compress: true,
        historyApiFallback: true,
        open: true,
        client: {
            overlay: true
        },
    },
    // TODO Change in production
    mode: "development",
};
