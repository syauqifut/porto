const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.js");
const configContent = fs.readFileSync(configPath, "utf8");

const windowMock = {};
new Function("window", configContent)(windowMock);

module.exports = windowMock.__ENV__ || {};
