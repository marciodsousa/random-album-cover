const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const config = {
    entry: {
        App: './public/client.js'
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'public', 'dist'),
        filename: '[name].bundle.js'
    },

    module: {
        rules: [{
                test: /\.(js)$/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['env'] }
                }],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        esModule: false,
                    },
                }],
            },
            {
                test: /\.(scss)$/,
                use: ExtractTextPlugin.extract(['css-loader?sourceMap', {
                    loader: 'postcss-loader',
                    options: {
                        plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; }
                    }
                }, 'sass-loader?sourceMap'])
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
    ]
};

process.noDeprecation = true;

module.exports = config;