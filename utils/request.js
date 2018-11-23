var config = require('config.js');
var API_URL = config.network.API_URL;
var urls = require('urls.js');
var wechat_login = require('wechat_login.js');

//GET请求
function GET(requestHandler, auth = false) {
    request('GET',requestHandler, auth);
}
//POST请求
function POST(requestHandler, auth = false) {
    request('POST',requestHandler, auth);
}

function request(method,requestHandler, auth) {
    if (auth)
    {
        requestWithAuth(method, requestHandler);
    }
    else
    {
        normalRequest(method, requestHandler);
    }
}

function normalRequest(method,requestHandler) {
    var data = requestHandler.data;
    var url = requestHandler.url;

    wx.request({
        url: API_URL + url,
        data: data,
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function(res){
            //注意：可以对参数解密等处理

            if (res.data.error_code === 0)
            {
                requestHandler.success(res);
            }
            else
            {
                var message= '请求错误';
                var error_code = -1;
                if (res.data.error_message)
                {
                    message = res.data.error_message;
                    error_code = res.data.error_code;
                }

                wx.showToast({
                    title: message,
                    icon: 'success',
                    duration: 2000
                });

                requestHandler.fail({
                    error_code: error_code,
                    message: message
                });
            }
        },
        fail: function() {
            wx.showToast({
                title: '请求错误，请检查网络！',
                icon: 'success',
                duration: 2000
            });
            requestHandler.fail({
                error_code: -2,
                message: "网络错误"
            })
        },
        complete: function() {
            // complete
        }
    })
}

function requestWithAuth(method,requestHandler)
{
    console.log(requestHandler);
    var token = wx.getStorageSync('token');
    var data = requestHandler.data;
    var url = requestHandler.url;

    wx.request({
        url: API_URL + url,
        data: data,
        method: method,
        header: {'Authorization': token}, // 设置请求的 header
        success: function (res) {
            // success
            console.log(res);

            if (res.data.error_code === 1002) {
                wx.request({
                    url: API_URL + urls.customer.REFRESH_TOKEN,
                    method: 'GET',
                    header: {'Authorization': token}, // 设置请求的 header
                    success: function (res) {
                        // success
                        console.log(res);
                        if (res.data.error_code == 200) {
                            token = res.data.token;
                            wx.setStorage({
                                key: "token",
                                data: token,
                            });

                            requestWithAuth(method, requestHandler);
                        }
                        else {
                            clearInfo();
                            wechat_login.wechat_login({
                                success:function () {
                                    requestWithAuth(method, requestHandler);
                                }
                            });
                        }
                    },
                    fail: function () {
                        clearInfo();
                        requestHandler.fail({
                            error_code: -2,
                            message: "网络错误"
                        });
                    },
                    complete: function (res) {
                    }
                });
            }
            else if (res.data.error_code === undefined || res.data.error_code === 0){
                requestHandler.success(res);
            }
            else if (res.data.error_code === 1001 || res.data.error_code === 1003){
                clearInfo();
                wechat_login.wechat_login({
                    success:function () {
                        requestWithAuth(method, requestHandler);
                    }
                });
            }
            else
            {
                var message= '请求错误';
                var error_code = -1;
                if (res.data.error_message)
                {
                    message = res.data.error_message;
                    error_code = res.data.error_code;
                }

                wx.showToast({
                    title: message,
                    icon: 'success',
                    duration: 2000
                });

                requestHandler.fail({
                    error_code: error_code,
                    message: message
                });
            }
        },
        fail: function () {
            wx.showToast({
                title: '请求错误，请检查网络！',
                icon: 'success',
                duration: 2000
            });
            requestHandler.fail({
                error_code: -2,
                message: "网络错误"
            });
        },
        complete: function (res) {
        }
    });
}

function clearInfo() {
    wx.removeStorage({
        key: 'token'
    });

    // wx.closeSocket();
}

module.exports = {
    GET: GET,
    POST: POST
}