function HelloPlugin(options) {
  // console.log(options);
}

HelloPlugin.prototype.apply = function (compiler) {
  //console.log(compiler);
  compiler.plugin("done", function () {
    console.log("hello world");
  });
};

module.exports = HelloPlugin;
