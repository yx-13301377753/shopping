var express = require('express');
var router = express.Router();
var User = require("../model/user_model")
require("../util/util")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post("/login",function (req,res,next) {
     var param = {
      userName : req.body.userName,
      userPwd : req.body.userPwd
    //   userName : req.param("userName"),
    //   userPwd : req.param("userPwd")
     }
    User.findOne(param,function (err,doc) {
        if(err){
          res.json({
            status : '1',
            msg : err.message
          })
        }else{
          if(doc){
            //设置cookie，参数一，cookid名字
            //            参数二，数据库中对象的用户id
            //             参数三，配置文件，path是路径，maxAge是过期时间
            res.cookie("userId",doc.userId,{
              path : "/",
              maxAge:1000*60*60
            })
            //设置了cookie，用户名
              res.cookie("userName",doc.userName,{
                path : "/",
                maxAge:1000*60*60
              })
            res.json({
              status : "0",
              msg: "",
              result : {
                userName : doc.userName
              }
            })
          }else{
            res.json({
              status : "1",
              msg: "err",
          })
          }
        }
    })
})
//检测用户是否登录的路由
router.get("/checkLogin",function (req,res,next) {
    if(req.cookies.userId){
      res.json({
        status:"0",
        msg : "",
        result : req.cookies.userName
      })
    }else{
      res.json({
        status : "1",
        msg: "未登录",
        result : ''
      })
    }
})
// 退出登录的路由
router.post("/logout",function (req,res,next) {
    res.cookie("userId",'',{
      path : '/',
      maxAge : -1
    })
  res.json({
    status : "0",
    msg: "",
    result : ''
  })
})
//购物车路由
router.get("/cartList",function (req,res,next) {
  var userId = req.cookies.userId;//获取用户登录的id
  User.findOne({userId:userId},function (err,doc) {//数据库中查询用户id和获取的id是否为一致
    if(err){
      res.json({
        status:"1",
        msg : err.message,
        result : ''
      })
    }else{
      res.json({
        status:"0",
        msg : "",
        result : doc.cartList//将数据返回给前台
      })
    }
  })
  //删除该商品的路由
  router.post("/cartDel",function (req,res,next) {
    var userId = req.cookies.userId;//获取的用户id
    var productId = req.body.productId;//传过来的商品id
    // console.log(productId);
    // console.log(userId);
    User.update(
      {userId : userId},//查找用户id
      {
        $pull:{"cartList" : { userId :productId}}//删除商品
      },
      function (err,doc) {
        if(err){
          res.json({
            status:"1",
            msg : err.message,
            result : ''
          })
        }else{
          res.json({
            status:"0",
            msg : "",
            result : 'success'
          })
        }
      }
      )

  })
  //更新购物车数量
  router.post('/cartEdit',function (req,res,next) {
    var userId = req.cookies.userId;
    var productId = req.body.productId;//传过来的商品id
    var productNum = req.body.productNum//传过来的商品数量
    var checked = req.body.checked//传过来的复选框的值
    console.log(checked);
    User.update(
      {'userId' : userId,'cartList.userId':productId},//查询的条件
      { 'cartList.$.productNum':productNum , 'cartList.$.checked':checked},//更新的内容
      function (err,doc) {
        if(err){
          res.json({
            status:"1",
            msg : err.message,
            result : ''
          })
        }else{
          res.json({
            status:"0",
            msg : "",
            result : 'success'
          })
        }
      }
      )
  })
  //全选按钮的请求
  router.post("/editCheckAll",function (req,res,next) {
    var userId = req.cookies.userId;
    var checkAll = req.body.checkAll ? '1' : 0;//获取前台的状态的是全选还是不选
    User.findOne({userId : userId},function (err,doc) {
      if(err){
        res.json({
          status:"1",
          msg : err.message,
          result : ''
        })
      }else{
        if(doc){//如果文档存在
          doc.cartList.forEach(item=>{//遍历拿到的文档
            item.checked = checkAll//修改文档中的checked值为前台传过来的值
          })
        }
        doc.save(function (err,doc1) {
          if(err){
            res.json({
              status:"1",
              msg : err.message,
              result : ''
            })
          }else{
            res.json({
              status : '0',
              msg : '',
              result : 'success'
            })
          }
        })
      }
    })
  })
  //地址的路由
  router.get("/addressList",function (req,res,next) {
    var userId = req.cookies.userId;
    User.findOne({userId : userId},function (err,doc) {
      if(err){
        res.json({
          status:"1",
          msg : err.message,
          result : ''
        })
      }else{
        res.json({
          status : '0',
          msg : '',
          result : doc.addressList
        })
      }
    })
  })
})
router.post("/setAddress",function (req,res,next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.findOne({userId : userId},function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg : err.message,
        result : ''
      })
    }else{
     if(doc){
       var addressList = doc.addressList;//拿到查询到的用户的信息列表
       addressList.forEach(item=>{
         if(item.addressId == addressId){
           item.isDefault = true
         }else{
           item.isDefault = false
         }
       })
     }
     doc.save(function (err,doc1) {
       if(err){
         res.json({
           status:"1",
           msg : err.message,
           result : ''
         })
       }else{
         res.json({
           status : '0',
           msg : '',
           result : 'success'
         })
       }
     })
    }
  })
})
//删除地址的路由
router.post("/delAddress",function (req,res,next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.update(
    {userId : userId},//查找用户id
    {
      $pull:{"addressList" : { "addressId" :addressId}}//删除地址
    },
    function (err,doc) {
      if(err){
        res.json({
          status:"1",
          msg : err.message,
          result : ''
        })
      }else{
        res.json({
          status:"0",
          msg : "",
          result : 'success'
        })
      }
    }
  )
})
router.post("/addAddress",function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId : userId},function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg : err.message,
        result : ''
      })
    }else{
      if(doc){
        console.log(doc.addressList);
        doc.addressList.push(req.body)
        doc.save(function (err1,doc1) {
          if(err1){
            res.json({
              status:"1",
              msg : err.message,
              result : ''
            })
          }else{
            res.json({
              status:"0",
              msg : "",
              result : 'success'
            })
          }
        })
      }
    }
  })
})
//生成订单
router.post('/payMent',function (req,res,next) {
  var userId = req.cookies.userId;//拿到用户的id
  var addressId = req.body.addressId;//拿到地址id(前台传过来的id)
  var orderTotal = req.body.orderTotal;//拿到商品的总价
  User.findOne({userId :userId},function (err,doc) {//查询用户数据
    if(err){
      res.json({
        status:"1",
        msg : err.message,
        result : ''
      })
    }else{
      var address = '', goodList = [];//地址和商品列表
      doc.addressList.forEach(item=>{//获取用户地址信息
        if(addressId == item.addressId){//前台传过来的id和数据库中的id相同
          address = item//将查询到的信息保存到address变量中
        }
      })
      //获取用户的购物车商品
      doc.cartList.filter(item=>{
        if(item.checked == '1'){
          goodList.push(item)
        }
      })
      //订单号
      var platform='521'  //平台码
      var r1=Math.floor(Math.random()*10);   //随机数
      var r2=Math.floor(Math.random()*10);   //随机数
      var sysDate=new Date().Format('yyyyMMddhhhhss');  //调用插件的格式化日期
      var CreateDate=new Date().Format('yyyy-MM-dd hh:mm:ss');//创建日期
      var orderId=platform+r1+r2+sysDate;    //订单号
      var order={  //将要添加的数据
        orderId:orderId,   //订单号
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodList,
        orderStatus:"1",
        createDate:CreateDate,
      };
      doc.orderList.push(order) //添加订单列表
      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:"1",
            msg : err.message,
            result : ''
          })
        }else{
          res.json({
            status:"0",
            msg : "",
            result:{
                orderId:order.orderId,   //订单信息输出的前端
                orderTotal:order.orderTotal
          }
          })
        }
      })
    }
  })
})
//订单的生成
router.get("/orderDetail",function (req,res,next) {
  var userId = req.cookies.userId;//拿到用户的id
  var orderId = req.param('orderId')//拿到的订单id
  //console.log(orderId);
  User.findOne({userId :userId},function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg : err.message,
        result : ''
      })
    }else{
      var orderList = doc.orderList;
      //console.log(orderList);
      if(orderList.length > 0){
        var orderTotal = 0;
        orderList.forEach(item=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal
            //console.log(item.orderId);
          }
        })
        console.log(orderTotal);
        if(orderTotal > 0){
          res.json({
            status:"0",
            msg : "",
            result:{
              orderId: orderId,   //订单信息输出的前端
              orderTotal: orderTotal
            }
          })
        }
      }
    }
  })
})
module.exports = router;
