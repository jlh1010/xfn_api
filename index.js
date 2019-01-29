/**
 * 小肥牛扫码点餐项目api系统
 */
// console.log("准备启动API服务器");
// console.log(new Date().toLocaleString());
const categoryRouter = require('./routes/admin/category');
 const adminRouter = require('./routes/admin/admin');
 const dishRouter = require('./routes/admin/dish');
 //const settingRouter = require('./routes/admin/setting');
 //const tableRouter = require('./routes/admin/table');
const PORT = 8090;
const express = require('express');
 const pool = require("./pool");
 const cors = require("cors");
 const bodyParser = require("body-parser");

// 启动主服务器
var app = express();
app.listen(PORT, () => {
  console.log("Server Listen " + PORT + '...');
  // console.log('API服务器启动成功...');.
})


// 使用中间件
 app.use(cors({
   origin: ["http://127.0.0.1:5500"],
   credentials: true
 }));

 // app.use(bodyParser.urlencoded({ }));   // 把application/x-www-form-urlencoded格式的请求主体解析出来
 app.use(bodyParser.json()); // 把application/json格式的请求主体数据解析出来放入req.body属性
 // 挂在路由器
 app.use('/admin/category', categoryRouter);
 app.use('/admin', adminRouter);
 app.use('/admin/dish', dishRouter);
 //app.use('/admin/setting', settingRouter);
 //app.use('/admin/table', tableRouter);