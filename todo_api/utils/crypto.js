const crypto = require("crypto"); // 引入crypto加密模块

const md5 = (v) => {
  return crypto
    .createHash("md5")
    .update("" + v)
    .digest("hex");
};

module.exports = {
  md5,
};
