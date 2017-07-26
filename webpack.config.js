//const webpack = require('webpack');

module.exports = {
  entry: './reactApp/app.js',
  output: {
    path: __dirname + '/build',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /reactApp\/(.)*\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader?importLoaders=1" }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'babel-loader?presets[]=react,presets[]=es2015'],
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
