// pages/district/district.js
var urls = require('../../utils/urls.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    districtList: []
  },

  selectDistrict: function(event){
    // console.log(event);
    var district_id = event.currentTarget.dataset.district;
    var district_name = event.currentTarget.dataset.district_name;
    wx.setStorageSync("district_id", district_id);
    wx.setStorageSync('district_name', district_name);
    // console.log(district_id);
    wx.reLaunch({
      url: '../index/index?district_id=' + district_id
    })
    // var district_id = wx.getStorageSync("district_id");
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync("token");
    var districtList = [];
    wx.request({
      method: 'GET',
      url: urls.DISTRICT.TODISTRICT,
      header: { 'Authorization': token },
      success: res=>{
        districtList = res.data
        // console.log(res.data);
        that.setData({
          districtList: districtList
        });
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