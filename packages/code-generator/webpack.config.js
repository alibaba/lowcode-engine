const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  // entry: './src/index.ts',
  target: 'node',
  entry: {
    index: './src/index.ts',
    demo: './src/demo/main.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    plugins: [new TsconfigPathsPlugin({/* options: see below */})],
  },
  output: {
    // filename: 'bundle.js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};
