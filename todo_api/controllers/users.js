const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { querySql } = require("../db/mysql");
const { md5 } = require("../utils/crypto");
const { PRIVATE_KEY, JWT_EXPIRED } = require("../utils/constant");
const { getErrorRes, getSuccessRes } = require("../utils/resHandler");

class UserController {
  async login(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      res.json(getErrorRes({ message: msg }));
    } else {
      let { username, password } = req.body;
      password = md5(password);
      const sql = `select * from sys_user where username='${username}' and password='${password}'`;
      try {
        const findRes = await querySql(sql);
        console.log("--查询登录账号数据--", findRes);
        if (findRes.length === 0) {
          res.json(getErrorRes({ message: "用户名或密码错误" }));
        } else {
          // 登录成功，签发一个token并返回给前端
          const token = jwt.sign(
            // payload：签发的 token 里面要包含的一些数据。
            { username },
            // 私钥
            PRIVATE_KEY,
            { algorithm: "HS256", expiresIn: JWT_EXPIRED }
          );
          let userData = {
            id: findRes[0].id,
            username: findRes[0].username,
            nickname: findRes[0].nickname,
          };
          const result = getSuccessRes({
            message: "登录成功",
            data: {
              token,
              userData,
            },
          });
          res.json(result);
        }
      } catch (error) {
        return next({ message: error });
      }
    }
  }

  async register(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      res.json(getErrorRes({ message: msg }));
    } else {
      let { username, password } = req.body;
      const sql = `select id, username from sys_user where username='${username}'`;
      try {
        const findRes = await querySql(sql);
        console.log("--查询用户是否已存在--", findRes);
        if (findRes && findRes.length > 0) {
          res.json(getErrorRes({ message: "用户已存在" }));
        } else {
          password = md5(password);
          const sql = `insert into sys_user(username, password, gmt_create, gmt_modify) values('${username}', '${password}', '${new Date().getTime()}', '${new Date().getTime()}')`;
          const insertRes = await querySql(sql);
          console.log("--注册用户--", insertRes);
          res.json(getSuccessRes({ message: "注册成功" }));
        }
      } catch (error) {
        return next({ message: error });
      }
    }
  }
}

module.exports = new UserController();
