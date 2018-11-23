/**
 * Created by billy on 09/27/2017.
 */

var baseUrl = 'https://api.soullv.com/api/v1';

//首页
var INDEX = {
  "SOCKET_INDEX_LUNBO": baseUrl + "/ad?type=MAIN_PAGE",
  "SOCKET_INDEX_RECOMMEND": baseUrl + "/goods?target=RECOMMEND&district_id="
};
//旅行产品
var TRAVELPRODUCT = {
  "SOCKET_CATEGORY": baseUrl + '/goods?target=CATEGORY_FILTER&district_id=',
  "SOCKET_GOODCATEGORY": baseUrl + '/goodsCategory'
};
//产品详情
var PRODUCT = {
  "SOCKET_RELATESHOP": baseUrl + '/goods?target=RELATED&related_goods_id=',
  "SOCKET_GOODS": baseUrl + '/goods/'
}
//商家详情
var DETAIL = {
  "SOCKET_SHOP": baseUrl +'/shop/',
  "GOODSLIST": baseUrl + '/goods?target=SHOP&shop_id='
}
//认证
var APPJSON = {
  "RENZHEN": baseUrl + '/auth/login?auth_type=WECHAT_MP',
  "TOKEN": baseUrl + '/auth/refreshToken'
}
//推荐 文章
var ARTICLE = {
  "ARTICLELIST": baseUrl + '/article?page=',
  "ARTICLE": baseUrl + '/article/'
}
//阅读
var READ = {
  "READ_WORD": baseUrl + '/article/'
}
//个人信息
var MY = {
  "INFORMATION": baseUrl + '/user/profile',
  "COUPON": baseUrl + '/couponInstance'
}

//完善订单信息
var SUBMITORDER = {
  "SUBMIT": baseUrl + '/customerOrder/customerOrderList',
  "PAYMENT": baseUrl + '/customerOrderPaymentPre/payInfo?customer_order_id='
}

//我的订单
var MYORDER = {
  "ORDER": baseUrl + '/customerOrder?page=',
  "ORDERDETAIL": baseUrl + '/customerOrder/',
  "CANCEL": baseUrl + '/customerOrder/'
}
//验证码绑定
var IDENTIFY = {
  "BINDIDENTIFY": baseUrl + "/smsCheckCode",
  "TOBIND": baseUrl + '/user?action=BIND_TELEPHONE'
}
//获取地区
var DISTRICT = {
  "TODISTRICT": baseUrl + '/activeDistrict?status=OPEN'
}

// 刷新token 调用方式urls.refresh(); 
function refresh(){
  var token = wx.getStorageSync("token");
  wx.request({
    method: 'PUT',
    url: baseUrl + '/auth/refreshToken',
    header: {'Authorization': token},
    success: res=>{
      wx.setStorageSync("token", res.data.token);
    }
  })
}

module.exports = {
   INDEX: INDEX,
   TRAVELPRODUCT: TRAVELPRODUCT,
   PRODUCT: PRODUCT,
   DETAIL: DETAIL,
   APPJSON: APPJSON,
   ARTICLE: ARTICLE,
   READ: READ,
   MY: MY,
   SUBMITORDER: SUBMITORDER,
   MYORDER: MYORDER,
   IDENTIFY: IDENTIFY,
   DISTRICT: DISTRICT,
   refresh: refresh
}