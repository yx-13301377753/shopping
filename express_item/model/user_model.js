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
        "userId" :  String,
        "productNum" :  Number,
        "checked" :  String
      }
    ],
    "addressList":[
      {
        "addressId":String,
        "userName":String,
        "streetName":String,
        "postCode":String,
        "tel":String,
        "isDefault": Boolean
      }
    ]
  }
)
module.exports = mongoose.model("user",userSchema)//暴露接口user对应的是数据表名user

