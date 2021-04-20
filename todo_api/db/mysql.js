const mysql = require("mysql");
const { MYSQL_CONF } = require("../config/db");

const connection = () => mysql.createConnection(MYSQL_CONF);

const querySql = (sql) => {
  const conn = connection();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (e) {
      reject(e);
    } finally {
      // 释放连接
      conn.end();
    }
  });
};

module.exports = {
  querySql,
};
