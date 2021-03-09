// webpack4
const path = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const precss = require("precss");

const loader = function (DEV) {
  let miniCss = {};
  if (DEV == "production") {
    miniCss = { minimize: true }; // css压缩
  }

  return {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "../src")],
        use: ["babel-loader"],
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-hot-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ["iOS >= 7", "Android >= 4"],
                }),
                precss,
              ],
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: miniCss.minimize || false,
              modules: true,
              // outputStyle: 'compressed',
              includePaths: [[path.resolve(__dirname, "../src/style")]],
            },
          },
        ],
      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "url-loader",
            options: {
              publicPath: "../images",
              outputPath: "/images",
              limit: 1000 * 10,
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)\??.*$/,
        include: [path.resolve(__dirname, "../src")],
        exclude: /node_modules/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000 * 500,
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
    ],
  };
};

module.exports = loader;
