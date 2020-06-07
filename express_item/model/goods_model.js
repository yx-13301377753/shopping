var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productSchema = new Schema({
  "userId" : String,
  "productName" : String,
  "salePrice" : Number,
  "productImage" : String,
  "productNum" :  Number,
  "checked" :  String
})
//暴露接口
module.exports = mongoose.model("goods",productSchema)
