// require our dependencies
const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // the base directory (absolute path) for resolving the entry option
  context: __dirname,
  // the entry point we created earlier. Note that './' means your current
  // directory. You don't have to specify the extension  now, because you will
  // specify extensions later in the `resolve` section
  entry: './src/index.js',

  output: {
    // where you want your compiled bundle to be stored
    path: path.resolve('./src/bundles/'),
    // naming convention webpack should use for your files
    filename: '[name]-[hash].js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        // we definitely don't want babel to transpile all the files in node_modules.
        // That would take a long time.
        exclude: /node_modules/,
        // use the babel loader
        loader: 'babel-loader',
        query: {
          // specify that we will be dealing with React code
          presets: ['env', 'stage-2', 'react'],
        },
      },
    ],
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new ExtractTextPlugin({ filename: '[name].css' }),
    // tells webpack where to store data about your bundles.
    new BundleTracker({ filename: './webpack-stats.json' }),
    // makes jQuery available in every module
  ],

  resolve: {
    // tells webpack where to look for modules
    modules: ['node_modules'],
    // extensions that should be used to resolve modules
    extensions: ['*', '.js', '.jsx'],
  },
  watchOptions: {
    poll: true,
  },
};
