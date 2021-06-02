// const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const {
    DEV_SERVER_PORT,
    IS_PRODUCTION,
    SRC_FOLDER,
    OUTPUT_FOLDER,
    BROWSERS_LIST,
    ASSETS_FOLDER,
} = require("./config");

module.exports = {
    target: "web",

    entry: ["./src/index.ts"],
    output: {
        path: OUTPUT_FOLDER,
        filename: "[name].js",
    },

    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: "babel-loader",
                exclude: /node_modules/,
                include: SRC_FOLDER,
            },

            {
                test: /\.(ts)$/,
                use: "ts-loader",
                exclude: /node_modules/,
                include: SRC_FOLDER,
            },

            {
                test: /\.(sc|sa)ss$/,
                include: SRC_FOLDER,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: require.resolve("postcss-loader"),
                        options: {
                            postcssOptions: {
                                ident: "postcss",
                                plugins: () => [
                                    require("postcss-flexbugs-fixes"),
                                    autoprefixer({
                                        browsers: BROWSERS_LIST,
                                        flexbox: "no-2009",
                                    }),
                                    require("postcss-modules-values"),
                                ],
                            },
                        },
                    },
                    "sass-loader",
                ],
            },

            {
                test: /\.(png|jpe?g|svg|webp)$/,
                loader: "file-loader",
                options: {
                    outputPath: "./img/",
                    // name: "[name].[ext]?[hash]",
                    name: "[name].[ext]",
                },
            },

            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: "url-loader",
                options: {
                    outputPath: "./fonts/",
                    name: "[name].[ext]?[hash]",
                },
            },
        ],
    },

    devServer: {
        port: DEV_SERVER_PORT,
        open: true,
        hot: true,
        // contentBase: path.resolve(__dirname, "./static"),
        contentBase: OUTPUT_FOLDER,
        compress: true,
        historyApiFallback: true,
    },

    resolve: {
        extensions: [".ts", ".js"],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: ASSETS_FOLDER }],
        }),
    ],
};
