const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const open = require("open");

const seting = require("./seting.js");
const getEntry = require("./getEntry");
const checkPort = require("./checkPort");
const configFn = require("./webpack.config.js");

const app = new express();

checkPort(seting.port, function (resultPort) {
  seting.publicPath = seting.publicPath.replace(
    ":" + seting.port,
    ":" + resultPort
  );
  seting.filename = "[name].js";

  var compiler = webpack(configFn(seting));
  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: seting.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler));

  app.options("*", function (req, res) {
    res.end("");
  });

  app.use(express.static("./build/"));

  app.get("/index", function (req, res) {
    const htmlEntry = getEntry("build/*.html", "build/");
    let listNode = "";
    Object.keys(htmlEntry).forEach(function (item, i) {
      listNode += `<li><a href="http://127.0.0.1:${resultPort}/${item}.html">${item}.html</a></li>`;
    });
    res.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>'
    );
    res.write("<ol>" + listNode + "</ol>");
    res.end("</body></html>");
  });

  app.listen(resultPort, function (error) {
    if (error) {
      console.log(error);
    } else {
      open(`http://127.0.0.1:${resultPort}/index`);
      console.log("项目已启动");
    }
  });
});
