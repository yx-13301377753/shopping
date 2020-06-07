<template>
    <div>
      <div class="mask_layer" id="mask_layer" v-show="price_mask_isshow"></div>
      <Header />
      <nav-bread></nav-bread>
    <!-- 遮罩层 -->

  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a href="javascript:void(0)" class="price" @click="sortGood">Price <svg class="icon icon-arrow-short">
            <use xlink:href="#icon-arrow-short"></use>
          </svg></a>
        <a href="javascript:void(0)" class="filterby stopPop"  @click="isshow">Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" :class="{'filterby-show' : price_ment_isshow }">
          <dl class="filter-price">
            <dt>Price:</dt>
            <dd><a href="javascript:void(0)" :class="{'cur': priceState_all == 'active'}" @click="priceState_set(active)">All</a></dd>
            <dd v-for="(item,index) in priceFilter">
              <a href="javascript:void(0)" :class="{'cur': priceState_all == index}" @click="priceState_show(index)">{{ item.startPrice }}- {{ item.endPrice }}</a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="(item,index) in GoodList" >
                <div class="pic">
                  <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{ item.productName }}</div>
                  <div class="price">{{ item.salePrice |c("￥")}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.userId)">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
<!--            滚动插件的loading动画显示层-->
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="good_load">
              <img src="/static/loading-svg/loading-spin.svg" alt="" v-show="loading">
            </div>
              <!--
                  v-infinite-scroll="loadMore"表示回调函数是loadMore
                  infinite-scroll-disabled="busy"表示由变量busy决定是否执行loadMore，false则执行loadMore，true则不执行，
                  看清楚，busy表示繁忙，繁忙的时候是不执行的。
                  infinite-scroll-distance="10"这里10决定了页面滚动到离页尾多少像素的时候触发回调函数，10是像素值。通常我们会在页尾做一个几十像素高的
                  “正在加载中...”，这样的话，可以把这个div的高度设为infinite-scroll-distance的值即可。
              -->
          </div>
        </div>
      </div>
    </div>
  </div>
      <modal :mdShow="mdShow" v-on:close="closes">
        <p slot="message" style="font-size: 18px; color: orange; ">请先登录，否则没法加入购物车！！</p>
        <div slot="btnGroup">
          <a class="btn btn-m" @click="closes">关闭</a>
        </div>
      </modal>

      <modal :mdShow="mdShowCart" v-on:close="closes">
        <p slot="message" style="font-size: 18px; color: orange; ">加入购物车成功</p>
        <div slot="btnGroup">
          <a class="btn btn-m" @click="closes">继续购物</a>
          <router-link class="btn btn-m" to="cart" >查看购物车</router-link>
        </div>
      </modal>
<!-- 尾部的组件 -->
      <nav-footer></nav-footer>
    </div>
</template>
<script>
  //引入的插件和文件
import '@/assets/css/base.css'
import '@/assets/css/checkout.css'
import '@/assets/css/login.css'
import '@/assets/css/product.css'
import Header from '@/components/Header'
import NavBread from '@/components/NavBread'
import NavFooter from "../components/NavFooter";
import axios from 'axios';
import Modal from "../components/modal"//导入模态框
export default {
  data () {
    return {
      //一些数据和状态
        mdShowCart : false,
        mdShow : false,
        loading : false,
        busy:true,//默认分页下拉加载禁用
        page : 1,//获取地址栏当前的页码
        pageSize : 4,//获取地址栏每页的条数
        sort : true,//获取地址栏排序的方式  1升序  -1降序
        GoodList : [],
        priceState_all : 'active',
        priceFilter : [
          {startPrice : '0.00', endPrice: '100.00'},
          {startPrice : '100.00', endPrice: '1000.00'},
          {startPrice : '1000.00', endPrice: '5000.00'},
          {startPrice : '5000.00', endPrice: '15000.00'},
        ],
      price_mask_isshow:false,
      price_ment_isshow:false
    }
  },
    components: {
    //注册的组件
      Header,
      NavBread,
      NavFooter,
      Modal
    },
  mounted () {
    //当页面加载的时候，进行的数据请求
    this.getGoodList()
  },
  methods : {
    // 关闭按钮的状态(子传父)
    closes(){
      this.mdShow = false;
      this.mdShowCart = false;
    },
    //添加购物车
    addCart(productId){
      axios.post('/goods/addCart',{productId:productId}).then((res)=>{
        //alert(res.data.status == '0'?"商品添加成功":"商品添加失败")
        res.data.status == '0' ? this.mdShowCart=true : this.mdShow=true;

      })
    },
    //price升降序的方法
    sortGood(){
      this.sort = !this.sort;
      this.page = 1;
      this.getGoodList()
    },
    //滚动插件的方法
    loadMore(){
      setTimeout(()=>{
        this.page ++;
        this.getGoodList(true);
      },500)
    },

    getGoodList (flag) {//1)初始化flag为undefined，向下滑动时候，falg就变成true
      this.loading = true;//当请求时显示loading图片
      var args = {
        priceLive : this.priceState_all,//active || 1,2,3,4,...告知后台你要查询的级别是什么？
        page : this.page,
        pageSize : this.pageSize,
        sort : this.sort?1:-1,
      }
      //axios的数据请求
      axios.get('/goods/list',{params:args}).then(
        res=>{
          if(res.data.status == "0"){
            if(flag){
              //滚动鼠标的时候
              this.GoodList = this.GoodList.concat(res.data.result.list)
              if(res.data.result.count == 0){//查询到最后了，没有数据可查了。
                this.busy = true
              }
            }else{
              //如果没有滚动鼠标，值为undefined
              this.GoodList = res.data.result.list
              this.busy = false
            }
            this.loading = false//当请求完成时隐藏图片
          }else{
            this.GoodList = [];
          }
        }
      )
    },
    //显示隐藏的状态函数
    isshow () {
      this.price_mask_isshow = true,
      this.price_ment_isshow = true
    },
    priceState_set(active){
      this.page = 1;//保证查询的的页码从1开始
      this.priceState_all = 'active',
      this.price_mask_isshow = false,
      this.price_ment_isshow = false
      this.getGoodList()//每次点击后触发getGoodList()函数，进行查询
    },
    priceState_show(index) {
      this.page = 1;//每次点击对应的价位，保证从第一页开始查询
      this.priceState_all = index,
      this.price_mask_isshow = false,
      this.price_ment_isshow = false
      this.getGoodList();//每次点击后触发getGoodList()函数，进行查询
    }
  }
}
</script>
<style scoped>
<!--遮罩层的样式-->
  .mask_layer {width: 100vw; height:100vh; background: rgba(0,0,0,0.3); z-index:1; position: fixed}
  /*滚动插件的样式*/
  .good_load {width: 100%; height: 100px;line-height: 100px; text-align: center}
</style>
