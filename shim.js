if (typeof __dirname === "undefined") global.__dirname = "/";
if (typeof __filename === "undefined") global.__filename = "";
if (typeof process === "undefined") {
  global.process = require("process");
} else {
  const bProcess = require("process");
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

// since new TCP/TLS module for React Native has different api from what is expected from nodejs/net & nodejs/tls
// (or from old module) we wrap this module in adapter:
global.net = require("./utils/net");
global.tls = require("./utils/tls");

process.browser = false;
if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === "boolean" && __DEV__;
process.env["NODE_ENV"] = isDev ? "development" : "production";
if (typeof localStorage !== "undefined") {
  localStorage.debug = isDev ? "*" : "";
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require("crypto");
