const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/Dashboard.tsx',
  output: {
    filename: 'bundle.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      //Note - css is not currently being included
      //uncomment this loader to add it to the project
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'material-react-table': 'material-react-table',
    'd3': 'd3',
    '@observablehq/plot': '@observablehq/plot'
  },
}