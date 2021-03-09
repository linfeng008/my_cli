const webpack = require("webpack");
const configFn = require("./webpack.config.js");
const seting = require("./seting.js");

seting.publicPath =
  "//dev.cdn.xxx.com/assets/" +
  seting.responseName +
  "/" +
  seting.version +
  "/";

const CBuild = (project_path) => {
  seting.project_path = project_path;
  webpack(configFn(seting), function (err, stats) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log("================= production 打包成功===============");
  });
};

module.exports = CBuild;
