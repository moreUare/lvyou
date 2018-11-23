// pages/my/my.js
var urls = require('../../utils/urls.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pInfo: {}
  },
  myOrder:function(){
    wx.navigateTo({
      url: '../order/order',
    })
  },
  myTravel:function(){
    wx.navigateTo({
      url: '../travel/travel',
    })
  },
  myCoupon:function(){
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  AboutMe:function(){
    wx.navigateTo({
      url: '../aboutUs/aboutUs',
    })
  },
  bindPhone:function(){
    wx.navigateTo({
      url: '../bindPhone/bindPhone',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync("token");
    console.log(token);
    wx.request({
      method: "GET",
      url: urls.MY.INFORMATION,
      header: { 'Authorization': token },
      success: res => {
        // 我的信息
        //console.log(res);
        let pInfo = res.data;
        that.setData({
          pInfo: pInfo
        })
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