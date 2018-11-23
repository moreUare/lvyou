// pages/orderDetail/orderDetail.js
var urls = require('../../utils/urls.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    showResult:false,
    orderid: 0,      //订单编号
    orderInfo: {},   //订单详情
    orderPayTime: ""    //订单付款时间
  },
  //电话
  calling(event){
    if(event.currentTarget.dataset.telephone){
      wx.makePhoneCall({
        phoneNumber: event.currentTarget.dataset.telephone,
        success: function(){},
        fail: function(){}
      });
    }
  },
  /**/
  cancelOrder:function(){
    this.setData({
      showModal: true
    })
  },
  go: function(){
    this.setData({
      showModal:false,
      showResult:false
    })
  },
  preventTouchMove: function () {
  },
  goon: function(){
    var that = this;
    var reback = "";
    if(that.data.orderInfo && that.data.orderInfo.status == "WAIT_PAY"){
      reback = "?action=CANCEL"
    }else if(that.data.orderInfo && that.data.orderInfo.status == "WAIT_USE"){
      reback = "?action=REFUND"
    }
    var token = wx.getStorageSync("token");
    this.setData({
      showModal:false,
      showResult:true
    })
    /*******取消订单,退款订单*******/
    wx.request({
      method: 'PUT',
      url: urls.MYORDER.CANCEL + this.data.orderid + reback,
      header:{'Authorization':token},
      success: res=>{
        console.log(res);
      },
      fail: res=>{
        console.log(res);
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      },
    })
  },
  goBack: function(){
    wx.redirectTo({
      url: '../order/order',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options); //获取订单id
    var that = this;
    var orderInfo = {};
    var orderPayTime = "";
    var token = wx.getStorageSync("token");
    // console.log(token);
    that.setData({
      orderid: Number(options.orderid)
    });
    wx.request({
      method: 'GET',
      header: { 'Authorization': token },
      url: urls.MYORDER.ORDERDETAIL + that.data.orderid,
      success: res=>{
        // console.log(res);
        orderInfo = res.data
        // console.log(res.data);
        //订单时间 格式
        if(orderInfo.customer_order_payment){
          orderPayTime = orderInfo.customer_order_payment.created_at;
          orderPayTime = orderPayTime.substring(0,10);   
          orderPayTime = orderPayTime.replace(/-/g, "/");
          // console.log(orderPayTime);
          orderInfo.customer_order_payment.created_at = orderPayTime;
        }
        that.setData({
          orderInfo: orderInfo
        });
        console.log(that.data.orderInfo);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})