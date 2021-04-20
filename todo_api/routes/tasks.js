const express = require("express");
const router = express.Router();
const { taskController } = require("../controllers");

// 任务列表
router.post("/list", taskController.getTaskList);

// 任务添加
router.post("/add", taskController.addTask);

// 任务编辑
router.post("/update", taskController.updateTask);

// 任务删除
router.get("/delete", taskController.deleteTask);

module.exports = router;
