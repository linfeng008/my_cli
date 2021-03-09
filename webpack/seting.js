const getIPAddress = require("./getIpAddress");
const port = 3001;
const ROOT_PATH = process.cwd();
const package = require(`${ROOT_PATH}/package.json`);

module.exports = {
  version: package.version,
  responseName: package.name,
  port: port,
  ip: getIPAddress,
  publicPath: "http://" + getIPAddress + ":" + port + "/",
  project_path: "",
};
