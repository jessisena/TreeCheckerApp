const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = [
  {
    name: "createAOI",
    entry: {
      createAOI: './src/screens/resources/web/lib/createAOI.js',
    },
    output: {
      path: path.join(__dirname, 'src/screens/resources/web/'),
      filename: 'createAOI.bundle.js',
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['last 2 versions', 'safari >= 9.3']
                }
              }]
            ]
          }
        }
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/screens/resources/web/createAOI.tpl.html',
        inlineSource: 'createAOI.bundle.js',
        filename: 'createAOI.html',
        cache: false,
      }),
      new HtmlWebpackInlineSourcePlugin(),
    ]
  },
  {
    name: "baseMap",
    entry: {
      baseMap: './src/screens/resources/web/lib/baseMap.js',
    },
    output: {
      path: path.join(__dirname, 'src/screens/resources/web/'),
      filename: 'baseMap.bundle.js',
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['last 2 versions', 'safari >= 9.3']
                }
              }]
            ]
          }
        }
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/screens/resources/web/baseMap.tpl.html',
        inlineSource: 'baseMap.bundle.js',
        filename: 'baseMap.html',
        cache: false,
      }),
      new HtmlWebpackInlineSourcePlugin(),
    ]
  },
  {
    name: "centerPin",
    entry: {
      centerPin: './src/screens/resources/web/lib/centerPin.js',
    },
    output: {
      path: path.join(__dirname, 'src/screens/resources/web/'),
      filename: 'centerPin.bundle.js',
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['last 2 versions', 'safari >= 9.3']
                }
              }]
            ]
          }
        }
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/screens/resources/web/centerPin.tpl.html',
        inlineSource: 'centerPin.bundle.js',
        filename: 'centerPin.html',
        cache: false,
      }),
      new HtmlWebpackInlineSourcePlugin(),
    ]
  },
]
