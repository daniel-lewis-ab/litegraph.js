const path = require("path");

module.exports = {
  entry: "./comfy/scripts/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
