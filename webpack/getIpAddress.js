const os = require("os");

const getIPAddress = function () {
  const ifaces = os.networkInterfaces();
  let ip = "";
  for (var dev in ifaces) {
    ifaces[dev].forEach(function (details) {
      if (ip === "" && details.family === "IPv4" && !details.internal) {
        ip = details.address;
        return;
      }
    });
  }
  return ip || "127.0.0.1";
};
module.exports = getIPAddress();
