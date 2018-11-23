function getControls(login_status, in_use) {
    var res = wx.getSystemInfoSync();
    var height = res.windowHeight;
    var width = res.windowWidth;

    var px_rpx = width / 750.0;
    var ratio = width / 375;
    var map_top = 100;

    var left_margin = 10 * ratio;
    var bottom_margin = 30 * ratio;
    var icon_height = 45 * ratio;
    var icon_width = 45 * ratio;
    var button_width = 200 * ratio;
    var button_height = 45 * ratio;
    var charging_width = 350 * ratio;
    var charging_height = 35 * ratio;
    var top_margin = 7 * ratio;
    var charging_left_margin = 12.5 * ratio;

    console.log('width: ' + width);
    console.log('height: ' + height);

    console.log('borrow btn top:' + (height - 2 * (bottom_margin + icon_height) - px_rpx * map_top));
    console.log('home btn top:' + (height - bottom_margin - icon_height - px_rpx * map_top));
    console.log('warn btn top:' + (height - bottom_margin - icon_height - px_rpx * map_top));
    console.log('scan btn top:' + (height - bottom_margin - button_height - px_rpx * map_top));

    console.log('icon height:' + icon_height);
    console.log('button height: ' + button_height);

    var scan_icon = '';

    if (login_status == enums.login_status.login) {
        scan_icon = '/image/map_scan_code.png';
    }
    else {
        scan_icon = '/image/map_sign.png';
    }


    return [
        {
            id: 1,
            iconPath: '/image/map_current_my_location.png',
            position: {
                left: left_margin,
                top: height - bottom_margin - icon_height - px_rpx * map_top,
                width: icon_width,
                height: icon_height
            },
            clickable: true
        },
        {
            id: 2,
            iconPath: '/image/map_current_my.png',
            position: {
                left: width - left_margin - icon_width,
                top: height - bottom_margin - icon_height - px_rpx * map_top,
                width: icon_width,
                height: icon_height
            },
            clickable: true
        },
        {
            id: 3,
            iconPath: scan_icon,
            position: {
                left: width / 2 - button_width / 2,
                top: height - bottom_margin - button_height - px_rpx * map_top,
                width: button_width,
                height: button_height
            },
            clickable: true
        },
        {
            id: 4,
            iconPath: '/image/index_char_list.png',
            position: {
                left: charging_left_margin,
                top: top_margin,
                width: charging_width,
                height: charging_height
            },
            clickable: true
        },
    ];
}

function getMarker(that) {
    mapCtx.getCenterLocation({
        success: function (res) {
            console.log(res.longitude)
            console.log(res.latitude)
            request.POST({
                url: urls.shop.RANGE_SHOP,
                data: {"lat": res.latitude, "lng": res.longitude},
                // header: {}, // 设置请求的 header
                success: function (res) {
                    // success
                    console.log(res);

                    var shops = new Array();
                    var shop_positions = new Array();

                    for (var i = 0; i < res.data.shops.length; i++) {
                        console.log(res.data.shops[i].lat);

                        shops.push(
                            {
                                id: res.data.shops[i].id,
                                latitude: res.data.shops[i].lat,
                                longitude: res.data.shops[i].lng,
                                title: "",
                                iconPath: "/image/map_eq_location.png",
                                width: 35,
                                height: 40,
                                shop_name: res.data.shops[i].name,
                                can_charge_num: res.data.shops[i].can_charge_num,
                                distance: res.data.shops[i].distance
                            });
                    }

                    console.log(shop_positions);
                    that.setData({
                        markers: shops,
                    });
                },
                fail: function () {
                },
            })
        }
    });
}

module.exports = {
    getControls: getControls,
    getMarker: getMarker
}