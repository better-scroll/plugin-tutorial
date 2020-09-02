const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './examples/index.js',
  mode: 'development',
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new HtmlWebpackPlugin({template: './examples/index.html'})
  ]
}