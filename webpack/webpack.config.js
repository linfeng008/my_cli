const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 插件: html 打包
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const uglify = require("uglifyjs-webpack-plugin");

const ROOT_PATH = process.cwd();
const DEV = process.env.NODE_ENV;
const devMode = DEV !== "production";
const loader = require("./loader");
const getEntry = require("./getEntry");

// 插件
const plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].css",
  }),
  new webpack.DefinePlugin({
    // 提供全局变量
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new uglify({
    cache: true, // 启用缓存
    parallel: true, // 启用多线程大包
  }),
  // 开启热更新插件
  // new webpack.HotModuleReplacementPlugin(),
  new OptimizeCssAssetsPlugin(),
];

const configFn = function (seting) {
  // 入口(通过getEntry方法得到所有的页面入口文件)
  const entries = getEntry(
    `${seting.project_path}/src/js/pages/*/index.js`,
    `${seting.project_path}/src/js/pages/`
  );
  // 提取哪些模块共有的部分从entries里面获得文件名称
  // var chunks = Object.keys(entries);
  // 模板页面(通过getEntry方法得到所有的模板页面)
  const pages = Object.keys(
    getEntry(
      `${seting.project_path}/src/js/pages/**/*.html`,
      `${seting.project_path}/src/js/pages/`
    )
  );
  // project_path
  const config = {
    cache: true, // 默认值，缓存webpack配置，提高打包速度
    // mode: devMode ? "development" : "production",
    mode: devMode ? "development" : "none",
    devtool: devMode ? "#cheap-module-eval-source-map" : "",
    entry: entries,
    output: {
      path: `${seting.project_path}/build`,
      publicPath: seting.publicPath,
      filename: "[name].js",
      // chunkFilename: "js/[id].chunk.js?[chunkhash]"   //chunk生成的配置
    },
    module: loader(DEV),
    plugins: plugins,
    externals: {
      // "react": "React",
      // "react-dom": "ReactDOM"
    },
    optimization: {
      splitChunks: {
        // chunks: 'async',
        minSize: 30000,
        minChunks: 4, //其他 entry 引用次數大於此值，預設1( minChunks 指的是被不同 entry 引入的次數)
        // maxAsyncRequests: 5,
        // maxInitialRequests: 3,
        // automaticNameDelimiter: '~',
        // name: true,
        cacheGroups: {
          commons: {
            name: "commons",
            chunks: "initial",
            // test: /[\\/]node_modules[\\/](?!(\S{0,}jsbarcode))/,
            // test: (name) => !/jsbarcode/.test(name.context),
            // test: (name) => {
            //   if (/[\\/]node_modules[\\/]/.test(name.context)) {
            //     return !/jsbarcode/.test(name.context);
            //   }
            //   return false;
            // },
            minChunks: 4,
          },
          // async: {
          //   name: 'async',
          //   chunks: 'async'
          // }
        },
      },
    },
    resolve: {
      extensions: [".js", ".jsx", ".css", ".scss"],
      modules: [`${ROOT_PATH}/node_modules`, `${ROOT_PATH}/src`],
      alias: {
        "~@": `${ROOT_PATH}/node_modules`,
        utils: `${ROOT_PATH}/src/js/utils/`,
        component: `${ROOT_PATH}/src/js/component/`,
      },
    },
  };

  if (DEV !== "localhost") {
    // 不是本地环境就build 静态资源
    pages.forEach(function (pathname) {
      let conf = {
        title: "mmp",
        filename: `${seting.project_path}/build/${pathname}.html`, // 生成的html存放路径，相对于path
        template: `${seting.project_path}/src/js/pages/${pathname}/index.html`, // html模板路径
        inject: false, // js插入的位置，true/'head'/'body'/false
        // chunksSortMode: "none"
        // cache: false,
        /*
         * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
         * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
         * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
         * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
         */
        // minify: { //压缩HTML文件
        //   removeComments: true, //移除HTML中的注释
        //   collapseWhitespace: false //删除空白符与换行符
        // }
      };

      if (pathname in config.entry) {
        // favicon: './src/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
        conf.inject = "body";
        conf.chunks = ["commons", pathname];
        // conf.hash = true;
      }
      config.plugins.push(new HtmlWebpackPlugin(conf));
    });
  }

  return config;
};

module.exports = configFn;
