// pages/order/order.js
var urls = require('../../utils/urls.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex: 1,
    totalindex: 1,
    orderList: [],
    selectedA: true,
    selectedUN: false,
    selectedF: false,
    selectedRE: false
  },

  handtap:function(event){
    var that = this;
    // console.log(event)
    var orderid = event.currentTarget.dataset.orderid;    //订单的id
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderid='+orderid,
    })
  },

  handAll:function(){
    var that = this;
    that.setData({
      selectedA: true,
      selectedUN: false,
      selectedF: false,
      selectedRE: false
    });
    var orderList = [];
    var pageindex;
    var totalindex;
    var token = wx.getStorageSync("token");
    wx.request({
      method: 'GET',
      header: { 'Authorization': token },
      url: urls.MYORDER.ORDER + that.data.pageindex,
      success: res => {
        console.log("全部");
        console.log(res.data.data[3]);
        orderList = res.data.data;
        pageindex = res.data.current_page;
        totalindex = res.data.total;
        that.setData({
          orderList: orderList,
          pageindex: pageindex,
          totalindex: totalindex
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
  handUnStart:function(){
    var that = this;
    that.setData({
      selectedA: false,
      selectedUN: true,
      selectedF: false,
      selectedRE: false
    });
    var orderList = [];
    var pageindex;
    var totalindex;
    var token = wx.getStorageSync("token");
    wx.request({
      method: 'GET',
      header: { 'Authorization': token },
      url: urls.MYORDER.ORDER + 1 + '&statuses[]= WAIT_USE',
      success: res => {
        console.log("wait_use");
        console.log(res);
        orderList = res.data.data;
        pageindex = res.data.current_page;
        totalindex = res.data.total;
        that.setData({
          orderList: orderList,
          pageindex: pageindex,
          totalindex: totalindex
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
  handOff:function(){
    var that = this;
    that.setData({
      selectedA: false,
      selectedUN: false,
      selectedF: true,
      selectedRE: false
    });
    var orderList = [];
    var pageindex;
    var totalindex;
    var token = wx.getStorageSync("token");
    wx.request({
      method: 'GET',
      header: { 'Authorization': token },
      url: urls.MYORDER.ORDER + 1 + '&statuses[]= FINISH',
      success: res => {
        console.log("finish");
        console.log(res);
        orderList = res.data.data;
        pageindex = res.data.current_page;
        totalindex = res.data.total;
        that.setData({
          orderList: orderList,
          pageindex: pageindex,
          totalindex: totalindex
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
  handAfterSale:function(){
    var that = this;
    that.setData({
      selectedA: false,
      selectedUN: false,
      selectedF: false,
      selectedRE: true
    });
    var orderList = [];
    var pageindex;
    var totalindex;
    var token = wx.getStorageSync("token");
    wx.request({
      method: 'GET',
      header: { 'Authorization': token },
      url: urls.MYORDER.ORDER + 1 + '&statuses[]= REFUNDING',
      success: res => {
        console.log("售后");
        console.log(res);
        orderList = res.data.data;
        pageindex = res.data.current_page;
        totalindex = res.data.total;
        that.setData({
          orderList: orderList,
          pageindex: pageindex,
          totalindex: totalindex
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderList = [];
    var pageindex;
    var totalindex;
    var token = wx.getStorageSync("token");
    wx.request({
      method: 'GET',
      header: {'Authorization': token},
      url: urls.MYORDER.ORDER + that.data.pageindex,
      success: res=>{
        // console.log(res);
        orderList = res.data.data;
        pageindex = res.data.current_page;
        totalindex = res.data.total;
        that.setData({
          orderList: orderList,
          pageindex: pageindex,
          totalindex: totalindex
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
    var num = that.data.pageindex
    if(this.data.pageindex < this.data.totalindex){
      that.setData({
        pageindex: num+1,
      });
      //分页获取数据
      if(that.data.selectedA){
        var orderList = that.data.orderList;
        var pageindex;
        var totalindex;
        var token = wx.getStorageSync("token");
        wx.request({
          method: 'GET',
          header: { 'Authorization': token },
          url: urls.MYORDER.ORDER + that.data.pageindex,
          success: res => {
            orderList = orderList.concat(res.data.data);
            pageindex = res.data.current_page;
            totalindex = res.data.total;
            that.setData({
              orderList: orderList,
              pageindex: pageindex,
              totalindex: totalindex
            });
          },
          //调用失败 刷新token
          fail: res => {
            if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
              urls.refresh();
            }
          }
        })
      }else if(that.data.selectedUN){
        var orderList = that.data.orderList;
        var pageindex;
        var totalindex;
        var token = wx.getStorageSync("token");
        wx.request({
          method: 'GET',
          header: { 'Authorization': token },
          url: urls.MYORDER.ORDER + that.data.pageindex + '&statuses[]= WAIT_USE',
          success: res => {
            orderList = orderList.concat(res.data.data);
            pageindex = res.data.current_page;
            totalindex = res.data.total;
            that.setData({
              orderList: orderList,
              pageindex: pageindex,
              totalindex: totalindex
            });
          },
          //调用失败 刷新token
          fail: res => {
            if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
              urls.refresh();
            }
          }
        })   
      }else if(that.data.selectedF){
        var orderList = that.data.orderList;
        var pageindex;
        var totalindex;
        var token = wx.getStorageSync("token");
        wx.request({
          method: 'GET',
          header: { 'Authorization': token },
          url: urls.MYORDER.ORDER + that.data.pageindex + '&statuses[]= FINISH',
          success: res => {
            orderList = orderList.concat(res.data.data);
            pageindex = res.data.current_page;
            totalindex = res.data.total;
            that.setData({
              orderList: orderList,
              pageindex: pageindex,
              totalindex: totalindex
            });
          },
          //调用失败 刷新token
          fail: res => {
            if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
              urls.refresh();
            }
          }
        })
      }else if(that.data.selectedRE){
        var orderList = that.data.orderList;
        var pageindex;
        var totalindex;
        var token = wx.getStorageSync("token");
        wx.request({
          method: 'GET',
          header: { 'Authorization': token },
          url: urls.MYORDER.ORDER + that.data.pageindex + '&statuses[]= REFUNDING',
          success: res => {
            console.log("售后");
            console.log(res);
            orderList = orderList.concat(res.data.data);
            pageindex = res.data.current_page;
            totalindex = res.data.total;
            that.setData({
              orderList: orderList,
              pageindex: pageindex,
              totalindex: totalindex
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
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})