/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log('start build');
module.exports = {
    entry: './src/main',
    target: 'node',
    externals: [],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: {
                    loader: 'ts-loader',
                    options: { transpileOnly: true },
                },
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
    },
    node: {
        __dirname: false
    },
    plugins: [
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports = [
                    '@nestjs/microservices',
                    '@nestjs/microservices/microservices-module',
                    'cache-manager',
                    'class-validator',
                    'class-transformer',
                    'class-transformer/storage',
                    'pg-native'
                ];
                if (!lazyImports.includes(resource)) {
                    return false;
                }
                try {
                    require.resolve(resource, {
                        paths: [process.cwd()],
                    });
                } catch (err) {
                    return true;
                }
                return false;
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                './node_modules/swagger-ui-dist/swagger-ui.css',
                './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
                './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
                './node_modules/swagger-ui-dist/favicon-16x16.png',
                './node_modules/swagger-ui-dist/favicon-32x32.png'
            ]
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
};