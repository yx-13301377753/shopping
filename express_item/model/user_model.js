var mongoose = require("mongoose")//导入mongoose模块
var userSchema = mongoose.Schema(
  {
    "userId" : String,
    "userName" : String,
    "userPwd" : String,
    "orderList":Array,
    "cartList":[
      {
        "productImage" :  String,
        "salePrice" :  String,
        "productName" :  String,
        "productId" :  String,
        "productNum" :  String,
        "checked" :  String
      }
    ],
    "addressList":Array
  }
)
module.exports = mongoose.model("user",userSchema)//暴露接口
