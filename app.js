//app.js
var urls = require('/utils/urls.js');
var login = require('/utils/wechat_login.js');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    /********************************************************** */
    // var rescode;
    // var resUserInfo;
    // // 登录
    // wx.login({

    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     rescode = res;
    //     wx.getUserInfo({
    //       success: res => {

    //         //认证 
    //         if (rescode.code) {
    //           wx.request({
    //             method: 'POST',
    //             url: urls.APPJSON.RENZHEN,
    //             // url: 'http://192.168.16.20:8092/api/v1/auth/login?auth_type=WECHAT_MP',
    //             data: {
    //               code: rescode.code,
    //               encryptedData: res.encryptedData,
    //               iv: res.iv,
    //               nick_name: res.userInfo.nickName,
    //               head_image: res.userInfo.avatarUrl
    //             },
    //             success: res => {
    //               // console.log(res);
    //               wx.setStorageSync("token", res.data.token);
    //               // getApp().globalData.token = res.data.token;
    //               // console.log(getApp().globalData.token)
    //               wx.switchTab({
    //                 url: '/pages/index/index'
    //               })
    //               //刷新token
    //               // if (res.statusCode == 401) {
    //               //   wx.request({
    //               //     method: 'PUT',
    //               //     url: urls.APPJSON.TOKEN,
    //               //     success: res => {
    //               //       console.log(res);
    //               //     }
    //               //   })
    //               // }      
    //             }
    //           })
    //         } else {
    //           console.log('登录失败!' + res.errMsg);
    //         }
    //       },
    //       fail: res => {
    //         console.log(res);
    //       }
    //     })
    //   }
    // })
    // /***************************************************** */
    // 登录
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //   wx.getUserInfo({
        //     success: res => {
        //       // 可以将 res 发送给后台解码出 unionId
        //       this.globalData.userInfo = res.userInfo
        //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //       // 所以此处加入 callback 以防止这种情况
        //       if (this.userInfoReadyCallback) {
        //         this.userInfoReadyCallback(res)
        //       }
        //     }
        //   })
        // }
        // console.log(res);
        if(res.authSetting['scope.userInfo']){
          //当用户信息存在，
          wx.getUserInfo({
             success: res => {     //认证过的用户信息 没有token
              //  console.log(res);
               // 可以将 res 发送给后台解码出 unionId
               this.globalData.userInfo = res.userInfo
               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
               // 所以此处加入 callback 以防止这种情况
               if (this.userInfoReadyCallback) {
                 this.userInfoReadyCallback(res)
               }
             }
           })
        }else{
          //当用户信息不存在跳转到新的页面，login进行认证
          wx.redirectTo({
            url: '../auth/auth',
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    code: null,
    couponid: null           
  }
})