// pages/product/product.js
var urls = require('../../utils/urls.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: true,
    notice: false,
    related: false,
    buttonSwitch: true,
    OptionSwitch: true,
    GoBy: false,
    bgcolor1: "rgb(113, 184, 223)",
    color1: "#fff",
    bgcolor2: "",
    color2: "",
    bgcolor3: "",
    color3: "",
    foodid: 1,
    productData: {},
    relatedshop: [],
    pageindex: 1,
    totalindex: 1,
    num: [],  //用于记录规格的数量，仅用于按钮的变化
    buyBtn: ""
  },
  subNum: function(event){

    var that = this;
    var id = event.currentTarget.dataset.goodskusid;
    if(id){
      that.data.productData.goods_skus.forEach(function(item,index,arr){
        if(item.id == id&&item.num > 0){
          item.num --;
          if(item.num == 0){item.selected="context"}
        }     
        
      });
      that.setData({
        productData: that.data.productData
      });
      // console.log(that.data.productData)
    }
    //num数据更新
    let Num = []
    that.data.productData.goods_skus.forEach(function(item,index,arr){
      Num.push(item.num);
    })
    that.setData({num: Num});
    //判断num数组是否为空或全为0，变换购买按钮的颜色
    let boolNum = that.data.num.some(function(item,index,arr){return item > 0});
    if(that.data.num.length > 0&&boolNum){
    }else{
      that.setData({
        buyBtn: "nBuyBtn"
      });
    }
  },
  addNum: function(event){
    var that = this;
    var id = event.currentTarget.dataset.goodskusid;
    if (id){
      that.data.productData.goods_skus.forEach(function (item, index, arr) {
        if (item.id == id && item.num < 1000) {
          item.num ++;
          item.selected = "contexta";
          that.setData({
            buyBtn: "cBuyBtn"
          })
        }
      });
      that.setData({
        productData: that.data.productData
      });
    }
    // console.log(that.data.productData)
  },
  //相关产品的商品跳转至产品  
  goShop: function(event){
    // console.log(event.currentTarget.dataset.id);
    let param = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?foodid='+param,
    })
  },
  //跳转至查看商家详情
  GoBusiness: function(event){
    // console.log(event)
    if(event.currentTarget.dataset.shopid){
      let param = event.currentTarget.dataset.shopid;
      // console.log(param)
      wx.navigateTo({
        url: '../detail/detail?shopid='+param,
      })
    }
  },
  GoToBuy: function(){
    if(this.data.GoBy){
      var that = this;
      // console.log(that.data.productData);
      var product_skus = that.data.productData.goods_skus;   
      var num = []
      product_skus.forEach(function(item,index,arr){
       num.push(item.num)
      });
      //判断num数组是否为空，判断num数组中的元素是否为0
      var boolNum = num.some(function(item,index,arr){return item > 0})
      if(num.length > 0&&boolNum){
        wx.navigateTo({
          url: '../PerfactInformation/PerfactInformation?product=' + num + "&" + "id=" + that.data.productData.id,
        })
      }else{
        //如果规格数量为空则什么都不做
      }
    }else{
      this.setData({
        detail: false,
        notice: false,
        related: false,
        buttonSwitch: true,
        OptionSwitch: false,
        GoBy: true,
        buyBtn: "nBuyBtn"
      })      
    }    
  },
  openDetail: function (res){
    this.setData({
      detail: true,
      notice: false,
      related: false,
      buttonSwitch: true,
      OptionSwitch: true,
      GoBy: false,
      bgcolor1: "rgb(113, 184, 223);",
      color1: "#fff",
      bgcolor2: "",
      color2: "",
      bgcolor3: "",
      color3: ""
    });
    
  },
  openNotice: function (){
    this.setData({
      detail: false,
      notice: true,
      related: false,
      buttonSwitch: true,
      OptionSwitch: true,
      GoBy: false,
      bgcolor1: "",
      color1: "",
      bgcolor2: "rgb(113, 184, 223);",
      color2: "#fff",
      bgcolor3: "",
      color3: ""
    })
  },
  /* 相关产品 */
  openRelated: function (){
    this.setData({
      detail: false,
      notice: false,
      related: true,
      buttonSwitch: false,
      OptionSwitch: true,
      GoBy: false,
      bgcolor1: "",
      color1: "",
      bgcolor2: "",
      color2: "",
      bgcolor3: "rgb(113, 184, 223);",
      color3: "#fff"
    });
    
    //获取商品列表相关
    var that = this;
    let param = that.data.foodid;
    wx.request({
      method: 'GET',
      url: urls.PRODUCT.SOCKET_RELATESHOP + param +'&page='+ 1,
      success: res => {
        // console.log(res);
        var that = this;
        let relatedshop = res.data.data;
        if(res.data.data){
          that.setData({
            relatedshop,
            pageindex: res.data.current_page,
            totalindex: res.data.total
          })
        }
        // console.log(that.data.relatedshop)
      },
      //调用失败 刷新token
      fail: res => {
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      foodid:options.foodid
    });
    // 获取商品
    //获取商品id并添加到url上
    var param = '';
    param = Number(this.data.foodid);
    var url = urls.PRODUCT.SOCKET_GOODS + param
    wx.request({
      method: 'GET',
      url: url,
      success: res => {
        var that = this;
        if(res.data){
          var productData = res.data;
          // console.log(productData);
          productData.goods_skus.forEach(function(item,index,arr){
            item.num = 0;
            item.selected = "context";
            // item.total = 0;
          });
          // productData.goods_skus.num = 0;
          this.setData({
            productData: productData
          });
          // console.log(productData);
        }
        // console.log(that.data.productData)
      },
      //调用失败 刷新token
      fail: res => {
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log("上拉触底事件");
    var that = this;
    var num = that.data.pageindex;
    if(this.data.pageindex < this.data.totalindex){
      that.setData({
        pageindex: num + 1,
      });
      /*分页获取信息*/
      wx.request({
        method: 'GET',
        url: urls.PRODUCT.SOCKET_RELATESHOP + that.data.param + '&page=' + that.data.pageindex,
        success: res => {
          // console.log(res);
          var that = this;
          let relatedshop = that.data.relatedshop;
          relatedshop = relatedshop.concat(res.data.data)
          if (res.data.data) {
            that.setData({
              relatedshop,
              pageindex: res.data.current_page,
              totalindex: res.data.total
            })
          }
          // console.log(that.data.relatedshop)
        },
        //调用失败 刷新token
        fail: res => {
          if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
            urls.refresh();
          }
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})