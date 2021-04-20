const { querySql } = require("../db/mysql");
const { validationResult } = require("express-validator");
const { getErrorRes, getSuccessRes } = require("../utils/resHandler");

class TaskController {
  async getTaskList(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      res.json(getErrorRes({ message: msg }));
    } else {
      let { pageNum, pageSize = 10 } = req.body;
      let query = `select d.id, d.title, d.description, d.status, d.gmt_create, d.gmt_expire from sys_task d where status != '2'`;
      try {
        let findRes = await querySql(query);
        console.log("--查询任务列表--", findRes);
        let isLimit = findRes.length > pageSize;
        let limitRes = [];
        if (isLimit) {
          let n = (pageNum - 1) * pageSize;
          limitRes = await querySql(query + ` limit ${n} , ${pageSize}`);
        }
        res.json(
          getSuccessRes({
            message: "查询数据成功",
            data: {
              total: findRes.length,
              list: isLimit ? limitRes : findRes,
              pageNum,
              pageSize,
            },
          })
        );
      } catch (error) {
        return next({ message: error });
      }
    }
  }

  async addTask(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      res.json(getErrorRes({ message: msg }));
    } else {
      let { title, description, gmt_expire } = req.body;
      const sql = `select id, title from sys_task where title='${title}' and status != 2`;
      try {
        let findRes = await querySql(sql);
        console.log("--addTask先查找同名任务--", findRes);
        if (findRes && findRes.length > 0) {
          res.json(getErrorRes({ message: "任务已存在" }));
        } else {
          const sql = `insert into sys_task(title, description, gmt_create, gmt_expire) values('${title}', '${description}', '${new Date().getTime()}', ${gmt_expire})`;
          let insertRes = await querySql(sql);
          console.log("--添加task数据--", insertRes);
          res.json(getSuccessRes({ message: "添加数据成功" }));
        }
      } catch (error) {
        return next({ message: error });
      }
    }
  }

  async updateTask(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      res.json(getErrorRes({ message: msg }));
    } else {
      let { id, title, description, status, gmt_expire } = req.body;
      const sql = `select id, title from sys_task where id != ${id} and title='${title}' and status != 2 `;
      try {
        let findRes = await querySql(sql);
        console.log("--查询不等于当前id的任务是否存在--", findRes);
        if (findRes && findRes.length > 0) {
          res.json(getErrorRes({ message: "任务已存在" }));
        } else {
          const sql = `update sys_task set title='${title}', description='${description}',status='${status}', gmt_expire='${gmt_expire}' where id='${id}'`;
          let updateRes = await querySql(sql);
          console.log(`--更新当前${id}的任务数据--`, updateRes);
          if (updateRes && updateRes.affectedRows > 0) {
            res.json(getSuccessRes({ message: "更新数据成功" }));
          } else {
            res.json(getErrorRes({ message: "更新数据失败" }));
          }
        }
      } catch (error) {
        return next({ message: error });
      }
    }
  }

  async deleteTask(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      res.json(getErrorRes({ message: msg }));
    } else {
      let { id, status } = req.query;
      const sql = `update sys_task set status='${status}' where id='${id}'`;
      try {
        const deleteRes = await querySql(sql);
        console.log(`--删除${id}的任务数据--`, deleteRes);
        if (deleteRes && deleteRes.affectedRows > 0) {
          res.json(getSuccessRes({ message: "删除数据成功" }));
        } else {
          res.json(getErrorRes({ message: "删除数据失败" }));
        }
      } catch (error) {
        return next({ message: error });
      }
    }
  }
}

module.exports = new TaskController();
