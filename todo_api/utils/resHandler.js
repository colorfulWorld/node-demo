const { CODE_ERROR, CODE_SUCCESS } = require("./constant");

module.exports = {
  getSuccessRes({ message, data }) {
    const res = {
      code: CODE_SUCCESS,
      msg: message,
      data,
    };
    return res;
  },

  getErrorRes({ message, data }) {
    const res = {
      code: CODE_ERROR,
      msg: message,
      data,
    };
    return res;
  },
};
