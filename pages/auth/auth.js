//index.js
var urls = require('../../utils/urls.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  open: function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  GoAuth: function (code) {
    // 获取用户信息
    
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              console.log(res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情
              if (res) {
                wx.request({
                  method: 'POST',
                  url: urls.APPJSON.RENZHEN,
                  data: {
                    code: code,
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    nick_name: res.rawData.nickName,
                    head_image: res.rawData.avatatUrl
                  },
                  success: response => {
                    console.log(response);
                    wx.setStorageSync("token", response.data.token);
                    wx.switchTab({
                      url: '../index/index',
                    })
                  },
                  fail: response => {
                    console.log(response);
                  }
                })
              }

            },
          }) 
  },
  /*****************************/


  getUserInfo: function (e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });

    var that = this;
    var code;
    // 登录
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          code = res.code;
          that.GoAuth(code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
  }
})