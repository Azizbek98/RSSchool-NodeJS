import * as webpack from 'webpack';
import { resolve } from 'path';
import NodemonPlugin from 'nodemon-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

const NODE_ENV = process.env.NODE_ENV == 'development' ? 'development' : 'production';

const config: webpack.Configuration = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    devtool: NODE_ENV === 'development' ? 'inline-source-map' : false,
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new NodemonPlugin({
            script: './dist/index.js',
            watch: [resolve(__dirname, 'dist')],
            ignore: ['*.js.map'],
            verbose: false,
            quiet: true,
            ext: 'js,json',
        }),
        new webpack.DefinePlugin({
            'process.browser': 'true',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader'],
            },
        ],
    },
    watchOptions: {
        aggregateTimeout: 1000,
        poll: 500,
        ignored: /node_modules/,
    },
};
export default config;
