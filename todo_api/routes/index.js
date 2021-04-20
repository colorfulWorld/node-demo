const express = require("express");
const router = express.Router();
const userRouter = require("./users");
const taskRouter = require("./tasks");
const { jwtAuth } = require("../utils/jwtAuth"); // 引入jwt认证函数

router.use(jwtAuth); // 注入认证模块

router.use("/api/user", userRouter);
router.use("/api/task", taskRouter);

module.exports = router;
