const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;


/**
 * API：GET /admin/login/:aname/:apwd
 * 完成用户登录验证（提示：有的项目中此处选择post请求）
 * 请求数据：{aname:'xxx',apwd:'xxx'}
 * 返回数据：
 * {code:200,msg:'login succ'}
 * {code：400，msg:'aname or apwd err'}
 */
router.get('/login/:aname/:apwd', (req, res) => {
  var aname = req.params.aname;
  var apwd = req.params.apwd;
  // 需要对用户输入的密码执行加密操作
  var sql = "SELECT aid FROM  xfn_admin WHERE aname = ? AND apwd = PASSWORD(?);";
  pool.query(sql, [aname, apwd], (err, result) => {
    if (err) throw err;
    if (result.length > 0) { // 查询到一行数据，登录成功
      res.send({
        code: 200,
        msg: "login succ"
      });
    } else { // 没有查询到数据
      res.send({
        code: 400,
        msg: "aname or apwd err"
      });
    }
  })
})


/**
 * API：PUT/PATCH /admin/login
 * 请求数据：{aname:'xxx',oldPwd:'xxx',newPwd:'xxx'}
 * 根据管理员名和密码修改管理员密码
 * 返回数据：
 * {code:200,msg:'modified succ'}
 * {code：400，msg:'aname or apwd err'}
 * {code:401,msg:'apwd not modified'}
 */

router.patch('/', (req, res) => {
  var data = req.body;
  console.log(data);
  // 根据aname和oldPwd查询该用户是否存在
  var sql = "SELECT aid FROM xfn_admin WHERE aname = ? AND apwd = PASSWORD(?);";
  pool.query(sql, [data.aname, data.oldPwd], (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      res.send({
        code: 400,
        msg: "原密码错误"
      });
      return;
    }
    var sql = "UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?";
    pool.query(sql, [data.newPwd, data.aname], (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
        res.send({
          code: 200,
          msg: "用户名或密码修改成功"
        });
      } else {
        res.send({
          code: 201,
          msg: "用户名或密码修改失败"
        });
      }
    })
  })
})