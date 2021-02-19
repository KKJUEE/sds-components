const fs = require('fs');
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseUrl = '192.168.30.41:3000';
const mockPath = "/mock/271/api/v1";
const is_mock = true;
const proxy = {
  '/api': {
    target: 'http://' + baseUrl,
    pathRewrite: function (path, req) {
      let replacePath = path;
      if (is_mock) {
        replacePath = path.replace("/api", mockPath);
        // mock地址不能匹配 "?" 路径，eg: /users/admin?password
        // 需要将 "?" 路径改成 "/" 路径
        replacePath = replacePath.replace(/(\?[a-z_]+)(&?([a-z_]+=[a-z]+))*$/, function (m, p1 ,p2) {
          return p1.replace("?", "/") + (p2 || "");
        });
        console.log(replacePath);
      }
      return replacePath;
    }
  },
  '/websocket/join': {
    target: 'ws://' + baseUrl + '/websocket/join',
    ws: true,
    secure: false,
    logLevel: 'debug'
  }
};
function resolve (dir) {
  return path.join(__dirname, dir);
}

const join = path.join
function getEntries(path) {
  let files = fs.readdirSync(resolve(path));
  const entries = files.reduce((ret, item) => {
    const itemPath = join(path, item)
    const isDir = fs.statSync(itemPath).isDirectory();
    if (isDir) {
      ret[item] = resolve(join(itemPath, 'index.js'))
    } else {
      const [name] = item.split('.')
      ret[name] = resolve(`${itemPath}`)
    }
    return ret
  }, {})
  return entries
}

// module.exports = {
//   assetsDir: 'static',
//   configureWebpack: config => {
//     config.devServer = {
//       open: true,
//       host: 'localhost',
//       port: 6682,
//       proxy,
//       entry: {
//         ...getEntries('packages'),
//       },
//       output: {
//         filename: '[name]/index.js',
//         libraryTarget: 'commonjs2',
//       }
//     }
//   },
//   chainWebpack: config => {
//     config.resolve.alias
//       .set('vue$', 'vue/dist/vue.esm.js')
//       .end();
//
//     config
//       .plugin('copy')
//       .use(CopyWebpackPlugin, [[{
//         from: resolve('public'),
//         to: resolve('dist/static'),
//         toType: 'dir',
//         ignore: [
//           '.DS_Store',
//           {
//             glob: 'index.html',
//             matchBase: false
//           }
//         ]
//       }]])
//   }
// }

//开发环境配置
const devConfig = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('packages'),
        'assets': resolve('examples/assets'),
        'views': resolve('examples/views'),
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add('/packages')
      .end()
      .use('sass')
      .loader('sass-loader')
      .tap(options => {
        return options
      })
  },
  devServer: {
    port: 8092,
    hot: true,
    open: 'Google Chrome'
  }
}
//生成环境配置
const buildConfig = {
  css: {
    sourceMap: true,
    extract: {
      filename: 'style/[name].css'
    }
  },
  configureWebpack: {
    entry: {
      ...getEntries('packages'),
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('packages')
      }
    },
    output: {
      filename: '[name]/index.js',
      libraryTarget: 'commonjs2',
    }
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add('/packages')
      .end()
      .use('sass')
      .loader('sass-loader')
      .tap(options => {
        return options
      })
    config.optimization.delete('splitChunks')
    config.plugins.delete('copy')
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugins.delete('hmr')
    config.entryPoints.delete('app')

    config.module
      .rule('fonts')
      .use('url-loader')
      .tap(option => {
        option.fallback.options.name = 'static/fonts/[name].[hash:8].[ext]'
        return option
      })
  },
  outputDir: 'lib',
  productionSourceMap: false,
}

module.exports = process.env.NODE_ENV === 'development' ? devConfig : buildConfig;
