var express = require('express');//引入express框架
var router = express.Router();//调用express的路由
var mongoose = require('mongoose')//引入mongoose，操作数据库
mongoose.connect("mongodb://127.0.0.1/db_demo")//连接数据库
var Good = require("../model/goods_model")//导入模型

mongoose.connection.on("connected",function () {//监听成功
  console.log("mongodb  connected   success");
})
mongoose.connection.on("error",function () {//错误
  console.log("mongodb  connected   err");
})
mongoose.connection.on("disconnected",function () {//断开连接
  console.log("mongodb  connected   err");
})
// router.get("/",function (req,res,next) {//配置路由
//   // res.send("good list")
//   Good.find({},function (err,doc) {
//   if(err){
//     res.json({
//       status : 1,
//       msg : err.message
//     })
//   }else{
//     res.json({
//       status :0,
//       msg : "",
//       result: {
//         count : doc.length,
//         list : doc
//       }
//     })
//   }
//   })
// })

router.get("/list",function (req,res,next) {//配置路由
  let page = parseInt(req.param("page"))//获取地址栏当前页码。express方法
  let pageSize = parseInt(req.param("pageSize"))//获取地址栏每页显示的条数
  let sort = req.param('sort')//获取地址栏排序方式，1升序，-1降序
  let skip = (page -1 )* pageSize //每页查询的起始条数
  let priceLive = req.param('priceLive')//接受前台传过来的数据
  let priceSmall = ''//最小
  let priceBig = ''//最大
  var params = {}
  if(priceLive != "active"){
    console.log(priceLive)
    switch (priceLive) {
      case "0": priceSmall=0;priceBig=100;break;
      case "1": priceSmall=100;priceBig=1000;break;
      case "2": priceSmall=1000;priceBig=5000;break;
      case "3": priceSmall=5000;priceBig=15000;break;
    }
    params = {
      salePrice:{
        $gt:priceSmall,//大于
        $lt:priceBig//(小于等于)
      }
    }
  }

  let goodModel = Good.find(params).skip(skip).limit(pageSize)
  //goodModel 现在是个模型，因为Good 就是一个模型，接收的值还是个模型
  //通过goodModel模型，查询到的每页显示的内容执行，升序，降序
  goodModel.sort({"salePrice" : sort})
  goodModel.exec(function (err,doc) {
      if(err){
        res.json({
          status : 1,
          mes : err.message
        })
      }else {
        res.json({
          status : 0,
          mes : "",
          result :{
            count : doc.length,
            list :doc
          }
        })
      }
})
})




router.post("/addCart",function (req,res,next) {
  //假设拿到了用户的登录id
  var userId = '100000077'//用户id，就是谁登录的
  //拿到商品的id
  //var productId = req.param('productId');//商品id-get
   var productId = req.body.productId;//商品id-post
  //引入模型(数据库中的字段)
  var User = require('../model/user_model')
  //查询数据id为登录人的id的数据
  User.findOne({userId : userId},function (err,userDoc) {
    if(err){
      res.json({
        statuw : 1,
        msg : err.message
      })
    }else{
      if(userDoc){//用户信息文档
        var dataOnly =true;//开关，true是购物车没有添加过此商品(可以添加)
        userDoc.cartList.forEach(function (item) {
          if(item.userId == productId){//如果购物车里的商品id和查询到的id一样，说明已经购买过此商品
              dataOnly = false;//可以向购物车添加商品
              item.productNum ++;//商品数量累加
            userDoc.save(function (err1,doc1) {
                  if(err1){
                      res.json({
                        status :"1",
                        msg : err1.message
                      })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
              })
          }
        })
        // foreach end
        if(dataOnly){
            Good.findOne({userId:productId},function (err2,doc2) {
                if(err2){
                  res.json({
                    status :"1",
                    msg : err1.message
                  })
                }else{
                  doc2.productNum=1   //商品数量是1
                  doc2.checked="1"    //默认是否选中
                  userDoc.cartList.push(doc2)
                  console.log(userDoc);
                  userDoc.save(function (onlyErr,docbson) {
                    if(onlyErr){
                      res.json({
                        status:'1',
                        msg:onlyErr.message
                      })
                    }else{
                      res.json({
                        status:'0',
                        msg:'',
                        result:"success"
                      })
                    }
                  })
                }
            })
        }
      }
    }
  })
})
module.exports = router;//向外暴露

