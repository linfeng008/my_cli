const webpack = require("webpack");
const configFn = require("./webpack.config.js");
const seting = require("./seting.js");
const checkPort = require("./checkPort");

// 不需要压缩
// 不需要
checkPort(seting.port, function (resultPort) {
  seting.publicPath = seting.publicPath.replace(
    ":" + seting.port,
    ":" + resultPort
  );
  webpack(configFn(seting), function (err, stats) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log("================= dev 打包成功===============");
  });
});
