const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const webpack = require('webpack');
const path = require("path");

module.exports = {
    entry: path.join(__dirname, "./src/vue/main.js"),
    module: {
        rules: [
        { test: /\.js$/, use: "babel-loader" },
        { test: /\.vue$/, use: "vue-loader" },
        { test: /\.css$/, use: ["vue-style-loader", "css-loader"]},
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./src/vue/index.html"),
        }),
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};