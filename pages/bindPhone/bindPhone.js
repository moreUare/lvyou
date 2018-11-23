// pages/bindPhone/bindPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: [],
    numList: [],
    confirmstatus: '',
    code: ''
  },
  /*************************/
  inputcatch: function (e) {
    var that = this;
    var value = e.detail.value;
    var valueArray = value.split("");
    console.info(valueArray);
    that.setData({
      numList: valueArray,
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
  /**************************/
  //验证
  identify: function(){
    var that = this;
    if(that.data.numList.length === 0){
      console.log("请输入手机号码")
    }else{
      console.log(that.data.numList)
      that.data.phoneNumber = that.data.numList.join("");
      that.setData({
        phoneNumber: that.data.phoneNumber
      })
      wx.navigateTo({
        url: '../identify/identify?phoneNumber=' + that.data.phoneNumber,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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