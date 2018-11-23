// pages/detail/detail.js
var urls = require('../../utils/urls.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopid: 1,
    shop: {},
    styleclass: '.jieshao',
    show: true,
    goodsList: [],
    pageindex: 1,
    totalindex: 1
  },
  checkBss: function(event){
    console.log(event.target.dataset.id);
    wx.navigateTo({
      url: '../product/product?foodid=' + event.target.dataset.id
    })
  },
  //下拉
  opendiv: function(){
    var that = this;
    that.setData({
      styleclass: "",
      show: false
    })
  },
  //上拉
  closediv: function(){
    var that = this;
    that.setData({
      styleclass: ".jieshao",
      show: true
    })
  },
  // 拨打电话
  calling: function(event){
    // console.log(event);

    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone,
      success: function(){},
      fail: function(){}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  console.log(options);
    var that = this;
    this.setData({
      shopid: Number(options.shopid)
    });
    var that = this;
    // console.log(this.data.shopid);
    let param = Number(that.data.shopid);
    wx.request({
      method: 'GET',
      url: urls.DETAIL.SOCKET_SHOP + param,
      success: res => {
        // console.log(res);
        res.data.open_time = res.data.open_time.substring(0,5);
        res.data.close_time = res.data.close_time.substring(0,5);
        that.setData({
          shop: res.data
        });
        // console.log(that.data.shop);
      },
      //调用失败 刷新token
      fail: res => {
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      }
    })
    wx.request({
      method: 'GET',
      url: urls.DETAIL.GOODSLIST + that.data.shopid + "&page=" + 1,
      success: res=>{
        that.setData({
          goodsList: res.data.data,
          pageindex: res.data.current_page,
          totalindex: res.data.total
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
    var that = this;
    var num = that.data.pageindex;
     if (this.data.pageindex < this.data.totalindex) {
        that.setData({
          pageindex: num + 1,
        });
        // 分页请求数据
        wx.request({
          method: 'GET',
          url: urls.DETAIL.GOODSLIST + that.data.shopid + "&page=" + that.data.pageindex,
          success: res => {
            var goodsList = that.data.goodsList;
            goodsList = goodsList.concat(res.data.data);
            that.setData({
              goodsList: goodsList,
              pageindex: res.data.current_page,
              totalindex: res.data.total
            });
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