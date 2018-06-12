var path = require('path');

process.env.NODE_ENV = 'development';

module.exports = {
    entry: './examples/index.js',
    output: {
        path: path.join(__dirname, ''),
        filename: 'build.js',
        publicPath: '/'
    },
    devServer: {
        publicPath: '/',
        host: '0.0.0.0',
        disableHostCheck: true,
        historyApiFallback: {
            rewrites: [{ from: /^\//, to: '/examples/index.html' }]
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }
        ]
    },
    mode: 'development'
};
