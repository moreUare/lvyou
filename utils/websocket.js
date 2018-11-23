var reconnect_times = 0;
var reconnect_timer = 0;
var app = getApp();
var enums = require('enums.js');
var config = require('config.js');

function websocket_reconnect(customer_id) {
    var that = this;
    var reconnect_times = reconnect_times;
    var timer = 0;

    //avoid server down, so use random timer
    if (reconnect_times < 3)
    {
        timer = Math.ceil(Math.random()*10);
    }
    else if (reconnect_times < 10)
    {
        timer = Math.ceil(Math.random()*20 + 10);
    }
    else
    {
        timer = Math.ceil(Math.random()*90 + 30);
    }

    console.log("reconnect in " + timer + "s");
    reconnect_timer = setTimeout(function () {
        websocket_connect(customer_id);
        reconnect_times++;
    }, timer*1000);
}

function websocket_connect(customer_id) {
    var that = this;

    console.log('websocket_connect, customer_id:'+customer_id);
    wx.connectSocket({
      url: config.network.WEBSOCKET_URL,
    });

    wx.onSocketOpen(function(res) {
        console.log('WebSocket连接已打开！')
        wx.sendSocketMessage({
            data:'{"type":"login", "customer_id":"'+customer_id+'"}'
        });

        clearTimeout(reconnect_timer);
    });

    wx.onSocketMessage(function(res) {
        console.log('收到服务器内容：' + res.data);

        var message = JSON.parse(res.data);

        console.log(message.type);
        var pages = getCurrentPages();

        var topPage = pages[pages.length-1];

        var route = "";
        if (app.globalData.sdkVersion < '1.2.1')
        {
            route = topPage.__route__;
        }
        else
        {
            route = topPage.route
        }

        if (message.type === "ping"){
            wx.sendSocketMessage({
                data:'{"type":"pong"}'
            });
        }
        else if (message.type === enums.pushType.opened) {
            if (route === "pages/index/index")
            {
                console.log("index");
                topPage.refresh(topPage);
            }
            else if (route === "pages/scan/scanSuccess")
            {
                console.log("success");
                topPage.openSuccess();
            }
        }
        else if (message.type === enums.pushType.closed) {
            if (route === "pages/charging/detail")
            {
                console.log("detail");
                topPage.closeSuccess(message.order_id);
            }
            else
            {
                var retStr = 'success=true&title=完成&reason=恭喜你充电完成~&return_text=返回';
                if (message.subtype < 0)
                {
                    var reason = '充电异常了哦～';
                    switch (message.subtype)
                    {
                        case enums.pushSubType.over_power:
                            reason = "你的充电超功率了哦~";
                            break;
                        case enums.pushSubType.over_time:
                            reason = "你的充电超时了哦~";
                            break
                    }

                    retStr = 'success=false&title=异常&reason=' + reason + '&return_text=返回';
                }

                wx.navigateTo({
                    url: '/pages/result/chargingResult?'+ retStr + '&consume_order_id=' + message.order_id
                });
            }
        }
    });

    wx.onSocketError(function (res) {
        console.log('WebSocket Error！' + res);
    });

    wx.onSocketClose(function (res) {
        console.log('WebSocket 已关闭！' + res.code + ":" + res.reason);
        websocket_reconnect(customer_id);
    })
}

module.exports = {
    websocket_connect : websocket_connect,
    websocket_reconnect: websocket_reconnect
}