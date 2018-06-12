var path = require('path');

process.env.NODE_ENV = 'production';

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'zkline.umd.js',
        library: 'zkline',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};
