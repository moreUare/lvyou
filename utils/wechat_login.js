/**
 * Created by billy on 08/04/2017.
 */
var app = getApp();
var urls = require('urls.js');
var config = require('config.js');

function wechat_login(requestHandler) {
    wx.showLoading({
        title: '处理中',
    });

    wx.getSetting({
        success: function (res) {
            console.log(res);
            var authSetting = res.authSetting;

            if (res.authSetting['scope.userInfo'])
            {
                wx.login({
                    success: function (res) {
                        console.log("wechat_token" + res.code);
                        getUserInfo(res.code, requestHandler);
                    }
                });
            }
            else {
                wx.navigateTo({
                  url: '/pages/auth/prompt'
                });
            }
        }
    });
}

function getUserInfo(code, requestHandler) {
    wx.getUserInfo({
        withCredentials: true,
        success: function(res) {
            // 可以将 res 发送给后台解码出 unionId
            console.log(res);

            var userinfo = res.userInfo;
            var params = {
                'username' : userinfo.nickName,
                'head_image' : userinfo.avatarUrl,
                'gender' : userinfo.gender,
                'country' : userinfo.country,
                'province' : userinfo.province,
                'city' : userinfo.city,
                'code' : code,
                'encryptedData' : res.encryptedData,
                'iv' : res.iv,
            };

            loginAccount(params, requestHandler);
        },
        fail: function (res) {
            console.log('getUserInfo failed');
            console.log(res);

            wx.showModal({
                title: '温馨提示',
                content: '需要授权后才能继续使用',
                showCancel: false,
                confirmText: "开启授权",
                success: function(res) {
                    if (res.confirm) {
                        wx.openSetting({});
                    }
                }
            });

            wx.hideLoading();
        }
    })
}

function loginAccount(params, requestHandler) {
    wx.request({
        url: config.network.API_URL + urls.customer.WECHAT_MINIPROGRAM_LOGIN,
        data: params,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function(res){
            wx.setStorage({
                key: "token",
                data: res.data.token,
            });

            requestHandler.success();
        },
        fail: function() {
            wx.showToast({
                title: '请求错误，请检查网络！',
                icon: 'success',
                duration: 2000
            });
            requestHandler.fail("网络错误");
        },
        complete: function() {
            // complete
            wx.hideLoading();
        }
    });
}

module.exports = {
    wechat_login: wechat_login
}