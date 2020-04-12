import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const webpackConfig: webpack.Configuration = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './client/index.tsx',
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
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body',
  })],
  output: {
    filename: '[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
};

export default webpackConfig;
