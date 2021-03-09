const net = require("net");

function portIsOccupied(port, callback, cb) {
  var portStatus = true;
  var server = net.createServer().listen(port);

  server.on("listening", function () {
    server.close();
    console.log("The port [" + port + "] is available");
    portStatus = true;
    callback(port);
  });

  server.on("error", function (err) {
    if (err.code === "EADDRINUSE") {
      // 端口被占用
      console.log(
        "The port [" + port + "]is occupied, the port will auto switch!"
      );
      portStatus = false;
      cb && cb(portStatus, port);
    }
  });
}

function checkPort(port, callback) {
  if (typeof port === "string") port = parseInt(port);

  portIsOccupied(port, callback, function (portStatus, resultPort) {
    if (!portStatus) {
      const tryPort = resultPort + 1;
      checkPort(tryPort, callback);
    } else {
      callback && callback(resultPort);
    }
  });
}
module.exports = checkPort;
