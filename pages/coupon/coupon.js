// pages/coupon/coupon.js
var urls = require('../../utils/urls.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon: [],
  },
  //选中优惠券
  selectCoupon: function(event){
    // console.log(event.currentTarget.dataset.couponid);
    app.globalData.couponid = event.currentTarget.dataset.couponid;
    // console.log(app.globalData.couponid);
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync("token");
    wx.request({
      method: 'GET',
      url: urls.MY.COUPON,
      header: { 'Authorization': token },
      success: res=>{
        // console.log(res.data);
        var coupon = res.data;
        res.data.forEach(function(item,index,arr){
          if(item.coupon.start_time){
            var start_time = item.coupon.start_time.substring(0, 10);
            start_time = start_time.replace(/-/g, "/");
            item.coupon.start_time = start_time;
          }
          if(item.coupon.end_time){
            var end_time = item.coupon.end_time.substring(0,10);
            end_time = end_time.replace(/-/g, "/");
            item.coupon.end_time = end_time;
          }
          if(item.coupon.money){
            var money = Math.floor(Number(item.coupon.money));
            item.coupon.money = money;
          }
        });
        that.setData({
          coupon: res.data
        });
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