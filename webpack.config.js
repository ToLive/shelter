const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        index: './src/pages/main/main.js',
        pets: './src/pages/pets/main.js',
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        static: './dist',
        port: 5050,
        open: false,
    },
    /*output: {
        clean: true,
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },*/
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name]-[hash][ext]'
                }
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/pages/main/template.html',
            inject: true,
            chunks: ['index'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/pets/template.html',
            inject: true,
            chunks: ['pets'],
            filename: 'pets.html'
        })
    ],
};