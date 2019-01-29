// 菜品类别相关的路由

// 创建路由器
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/**
 * API：GET /admin/category/delete?cid=3
 * 含义：客户端获取所有的菜品类别，按编号升序排列
 * 返回值形如：
 * [{cid:1,cname:'..'},{...}]
 */
router.get('/', (req, res) => {
  var sql = "SELECT * FROM xfn_category ORDER BY cid;";
  pool.query(sql, [], (err, result) => {
    if (err) throw err;
    res.send(result);
    // var jsonDta = json.stringify(result);
    // res.send('doData(' + jsonData + ')');
  })
})

/**
 * API：DELETE /admin/category/:cid
 * 含义：根据标识菜品编号的路由参数，删除该菜品
 * 返回值形如：
 * {code: 200,msg:'1 category deleted'}
 * {code: 400,msg:'0 category deleted'}
 */

router.delete('/:cid', (req, res) => {
  // 注意：删除菜品类别前必须先把属于该类别的菜品的类别编号设置为NULL
  var cid = req.params.cid;
  var sql = "UPDATE xfn_dish SET categoryId = NULL WHERE categoryId=?";
  pool.query(sql, [cid], (err, result) => {
    if (err) throw err;
    // 至此制定类别的菜品已经修改完毕
    var sql = 'DELETE FROM xfn_category WHERE cid = ?;';
    pool.query(sql, [cid], (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
        res.send({
          code: 200,
          msg: "1 category deleted"
        })
      } else {
        res.send({
          code: 400,
          msg: "0 category deleted"
        })
      }
    })
  })
})

/**
 * API：POST /admin/category/:cid
 * 请求（主体）参数（json格式）：{cname:'xxx'}
 * 含义：添加新的菜品类别
 * 返回值形如：
 * {code: 200,msg:'1 category added', cid:1}
 * {code: 400,msg:'0 category added', cid:1}
 */

router.post('/', (req, res) => {
  // var cname = req.body.cname;
  // console.log(cname)
  // var sql = 'INSERT INTO `xfn_category`(`cid`, `cname`) VALUES (NULL, ?);';
  // pool.query(sql, [cname], (err, result) => {
  var data = req.body; // 形如：{cname:'xxx'}
  var sql = "INSERT INTO xfn_category SET ?;";
  pool.query(sql, data, (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({
        code: 200,
        msg: "1 category inserted"
      })
    } else {
      res.send({
        code: 400,
        msg: "0 category inserted"
      })
    }
  })
})

/**
 * API：PUT /admin/category/:cid
 * 请求（主体）参数（json格式）：{cname:'xxx'}
 * 含义：根据菜品类别编号修改类别
 * 返回值形如：
 * {code: 200, msg:'1 category modified' }
 * {code: 400, msg:'0 category modified, not exits'}
 * {code: 401, msg:'0 category modified, not modification' }
 */
router.put('/', (req, res) => {
  // var cid = req.params.cid;
  // var cname = req.params.cname;
  // var sql = 'UPDATE `xfn_category` SET `cname`= ? WHERE cid = ?';
  // pool.query(sql, [cname, cid], (err, result) => {
  var data = req.body; // 请求数据{cid:xx,cname:'xx'}
  // TODO:此处可以对数据进行验证
  var sql = 'UPDATE `xfn_category` SET ? WHERE cid = ?';
  pool.query(sql, [data, data.cid], (err, result) => {
    if (err) throw err;
    if (result.changedRows > 0) { // 实际更新了1行
      res.send({
        code: 200,
        msg: "1 category modified"
      })
    } else if (result.affectedRows == 0) { // 实际影响到0行
      res.send({
        code: 400,
        msg: "0 category not exits"
      })
    } else if (result.affectedRows == 1 && result.changedRows == 0) { // 影响到1行，但实际修改了0行——新值与旧值完全一样
      res.send({
        code: 401,
        msg: "no category modified"
      })
    }
  })
})

/**
 * API：PATCH /admin/category/:cid
 * 请求（主体）参数（json格式）：{cname:'xxx'}
 * 含义：根据菜品类别编号修改类别
 * 返回值形如：
 * {code: 200, msg:'1 category modified' }
 * {code: 400, msg:'0 category modified, not exits'}
 * {code: 401, msg:'0 category modified, not modification' }
 */