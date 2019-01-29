const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/**
 * API：  GET  /admin/dish
 * 获取所有的菜品（按类别进行分类）
 * 返回数据：
 * [
 * {cid:1,cname:"肉类",dishList:[{},{},...]}
 * {cid:2,cname:"菜类",dishList:[{},{},...]}
 * ...
 * ]
 */
router.get('/', (req, res) => {
  // 查询所有的菜品类别
  var sql = "SELECT cid,cname FROM xfn_category";
  pool.query(sql, [], (err, result) => {
    if (err) throw err;
    var categoryList = result; // 菜品类别数组
    var count = 0;
    for (let c of categoryList) {
      // 循环查询每个类别下有哪些菜品
      var sql = "SELECT * FROM xfn_dish WHERE categoryId = ?;";
      pool.query(sql, [c.cid], (err, result) => {
        if (err) throw err;
        c.dishList = result;
        count++;
        if (count == categoryList.length) {
          res.send(categoryList);
        }
      })
    }
  })
})
const multer = require ('multer');
const fs = require('fs');
var upload = multer({})
router.post ('/image',upload.single('dishImg'),(req,res)=>{
  var tmpFile = req.file.path;
  var suffix = reqfile.originalname.substring(req.file.originalname.lastIndexOf('.'));
  var newFile = randFileName(suffix);
  fs.rename(tmpFile,'img/dish/'+newFile,()=>{
    res.send({code:200,msg:'upload succ',fileName:newFile})//把临时文件转移
  })
})
//生成一个随机文件名
//参数：suffix表示要生成的文件名的后缀
function  randFileName(suffix){
  var time=new Date().getTime();
  var num =Math.floor(Math.random()*(10000-1000)+1000);
  return time + '-' + num + suffix;
}
