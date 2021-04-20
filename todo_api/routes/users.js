const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { checkSchema } = require("express-validator");

const rules = {
  loginValidator: checkSchema({
    username: {
      isLength: {
        errorMessage: "username长度至少5位",
        options: { min: 5 },
      },
    },
    password: {
      isLength: {
        errorMessage: "password长度至少5位",
        options: { min: 5 },
      },
    },
  }),
};

// 登录
router.post("/login", rules.loginValidator, userController.login);

// 注册
router.post("/register", rules.loginValidator, userController.register);

module.exports = router;
