const webpack = require("webpack");
const configFn = require("./webpack.config.js");
const seting = require("./seting.js");

seting.publicPath =
  "//dev.cdn.xxxx.com/assets/" +
  seting.responseName +
  "/" +
  seting.version +
  "/";

webpack(configFn(seting), function (err, stats) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("================= pre 打包成功===============");
});
