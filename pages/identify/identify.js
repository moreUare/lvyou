// pages/identify/identify.js
var urls = require('../../utils/urls.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    showFail: false,
    showIdentify: false,
    phoneNumber: "",
    identifyNumber: [],
    countdown: 60,
    identifyList: [],
    confirmstatus: '',
    code: '',
    isRound: true
  },
  /****/
  backSpace: function(){
    wx.switchTab({
      url: '../my/my',
    })
  },
  inputcatch: function (e) {
    var that = this;
    var value = e.detail.value;
    var valueArray = value.split("");
    console.info(valueArray);
    that.setData({
      identifyList: valueArray,
      code: value
    })
    if (!/^\d{4}$/.test(e.detail.value)) {
      that.setData({
        confirmstatus: ''
      })
      return;
    } else {
      that.setData({
        confirmstatus: 'active'
      })
    }
  },
  /*******/
  /********************************/
  
  /******************************/


  bindSuccess:function(){
    var that = this;
    var token = wx.getStorageSync("token");
    var identifyList = that.data.identifyList.join("");
    console.log(identifyList);
    wx.request({
      method: "PUT",
      url: urls.IDENTIFY.TOBIND,
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      data: {
        telephone: that.data.phoneNumber,
        sms_check_code: identifyList
      },
      success: res=>{
        console.log(res);
        if(res.statusCode == 200){
          that.setData({
            showModal: true,
            isRound: false
          })
        }else if(res.data.error_code == "TELEPHONE_ALREADY_BIND"){
          that.setData({
            showFail: true
          })
        }else if(res.data.error_code == "SMS_CHECK_CODE_INVALID"){
          that.setData({
            showIdentify: true
          })
        }
      },
      //调用失败 刷新token
      fail: res => {
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      }
    })
  },

  preventTouchMove: function(){

  },
  go: function(){
    this.setData({
      showModal: false,
      showFail: false,
      showIdentify: false
    })
  },

  /*倒计时函数*/
  settime: function(options){
    var that = this;
    if(that.data.isRound){
      if(that.data.countdown == 0){
        that.Identify(options);
        that.setData({
          countdown: 60
        })
        setTimeout(that.settime,1000,options)
      }else{
        that.data.countdown --;
        that.setData({
          countdown: that.data.countdown
        })
        setTimeout(that.settime,1000,options)
      }
    }
  },
  Identify: function(options){
    var that = this;
    var token = wx.getStorageSync("token");
    console.log(options.phoneNumber);
    that.setData({
      phoneNumber: options.phoneNumber
    })
    wx.request({
      method: 'POST',
      url: urls.IDENTIFY.BINDIDENTIFY,
      header: { 'Authorization': token },
      data: {
        telephone: that.data.phoneNumber
      },

      success: res => {
        console.log(res);
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
    that.Identify(options);
    /*倒计时*/
    that.settime(options);
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