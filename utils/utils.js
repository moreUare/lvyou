/**
 * caculate the great circle distance
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */

//分解url获得数据部分
function getUrlParams(box_sn) {
    var theRequest = new Object();
    var pos = box_sn.indexOf("?");
    if (pos != -1) {
        var str = box_sn.substr(pos + 1);
        var params = str.split("&");
        for (var i = 0; i < params.length; i++) {
            theRequest[params[i].split("=")[0]] = params[i].split("=")[1];
        }
    }

    return theRequest;
}

// 根据参数名称获取参数值
function getParamValue(box_sn, name) {
    var params = getUrlParams(box_sn);

    if (!params[name]) {
        return box_sn;
    }

    return params[name];
}

function getRad(d){
    var PI = Math.PI;
    return d*PI/180.0;
}

function getDistance(lat1,lng1,lat2,lng2){
    var EARTH_RADIUS = 6378137.0;    //单位M


    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);

    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);

    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*EARTH_RADIUS;
    s = Math.round(s*10000)/10000.0;

    s = Math.ceil(s);

    return s;
}

function getDistanceStr(lat1, lng1, lat2, lng2) {
    var distance = getDistance(lat1, lng1, lat2, lng2);

    if (distance < 1000)
    {
        return distance + "米";
    }
    else
    {
        return (distance/1000).toFixed(2) + '千米';
    }

}

module.exports = {
    getDistance : getDistance,
    getDistanceStr: getDistanceStr,
    getParamValue: getParamValue
}