// pages/PerfactInformation/PerfactInformation.js
var urls = require('../../utils/urls.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_name: '',
    goods_skus: [],
    id: 0,    //商品id
    goods_skus_num: [],
    goods: {},
    total: 0,   //总价
    total_money: 0, //优惠价
    goods_skus_select: [], //选择的产品
    consignee: "",  //联系人
    contact: "",     //手机号码
    money: 0,
    showModal: false,
    showInfo: false
  },
  goBack: function(){
    var that = this;
    that.setData({
      showModal: false,
      showInfo: false
    });
  },
  /*********************************************************************************************/
  //提交订单
  refer: function(){
    // console.log(app.globalData.couponid);
    // {
    //   "customer_orders": [
    //     {
    //       "customer_order_user_contact": {
    //         "consignee": "测试",
    //         "contact": "13800138000"
    //       },
    //       "customer_order_goods_skus": [
    //         {
    //           "goods_sku_id": 1,
    //           "quantity": 1
    //         },
    //         {
    //           "goods_sku_id": 2,
    //           "quantity": 1
    //         }
    //       ]
    //     }
    //   ],
    //     "coupon_instance_use": {
    //     "coupon_instance_id": 1
    //   }
    // }
    // 提交订单
    // console.log(this.data.consignee);
    // console.log(this.data.contact);
    // console.log(this.data.goods_skus);
    // console.log("优惠券"+":"+app.globalData.couponid)

    var that = this;
    var consignee = this.data.consignee;
    var contact = this.data.contact;
    var couponid = app.globalData.couponid;  //优惠券id
    var token = wx.getStorageSync("token");
    /**对象customer_order_goods_skus**/
    var customer_order_goods_skus = [];
    var goods_sku_id = 0;
    var quantity = 0;
    var data = {};
    that.data.goods_skus.forEach(function(item,index,arr){
      if(item.num >= 1){
        customer_order_goods_skus.push({
          goods_sku_id: item.id,
          quantity: item.num
        })
      }
    });
    //优惠券判断 配置data/////////////////
    if(couponid){
      data = {
        customer_orders: [
          {
            customer_order_user_contact: {
              consignee: consignee,
              contact: contact
            },
            customer_order_goods_skus: customer_order_goods_skus,
          }
        ],
        coupon_instance_use: {
            coupon_instance_id: couponid        
        }
      }
    }else{
      data = {
        customer_orders: [
          {
            customer_order_user_contact: {
              consignee: consignee,
              contact: contact
            },
            customer_order_goods_skus: customer_order_goods_skus,
          }
        ]
      }
    }
    // console.log(customer_order_goods_skus);
    if(consignee && contact && that.data.goods_skus){
      //判断是否选中产品
      var isbool = that.data.goods_skus.some(function(item,index,arr){
        return item.num > 0
      });
      if(isbool){  //选中产品进入
        // console.log(urls.SUBMITORDER.SUBMIT)
        wx.request({
          method: 'POST',
          url: urls.SUBMITORDER.SUBMIT,
          header: { 
            'content-type': 'application/json',
            'Authorization': token 
          },
          data: data,
          // {
          //   customer_orders: [
          //     {
          //       customer_order_user_contact: {
          //         consignee: consignee,
          //         contact: contact
          //       },
          //       customer_order_goods_skus: customer_order_goods_skus,                           
          //     }           
          //   ],
          //   /***没有优惠券时不传该参数****/
          //   coupon_instance_use: {
          //     coupon_instance_id: couponid        
          //   }
          // },
          success: res=>{
           
            //获取订单id
            if(res.data){
              var orderid = res.data[0].id;
              wx.login({
                success: res=>{
                  if(res.code){
                    //1.调用支付接口
                      wx.request({
                        method: 'GET',
                        url: urls.SUBMITORDER.PAYMENT + orderid + '&channel=WECHAT_MP&code=' + res.code,
                        header: { 'Authorization': token },
                        success: res=>{ 
                          //2.调用微信支付接口
                          /************跳转支付页面****************/
                          wx.requestPayment({
                            timeStamp: res.data.pay_info.timeStamp,
                            nonceStr: res.data.pay_info.nonceStr,
                            package: res.data.pay_info.package,
                            signType: res.data.pay_info.signType,
                            paySign: res.data.pay_info.sign,
                            success: res=>{
                              //支付成功跳转至提醒页面
                              wx.navigateTo({
                                url: '../paySuccess/paySuccess',
                              })
                            },
                            fail: res=>{
                              console.log(res)
                              //支付失败
                            }
                          })
                        }
                      })
                  }
                }
              })
            }
            // wx.redirectTo({
            //   url: '../product/product?foodid=' + that.data.id
            // })
          
          },
          //调用失败 刷新token
          fail: res => {
            if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
              urls.refresh();
            }
          }
        })
      }else{
        that.setData({
          showInfo: true
        })
      }
    }else{
      that.setData({
        showModal: true
      })
    }
  },
  /**********************************************************************************************/
  //获取优惠券
  ToCoupon: function(){
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },

  userNameInput: function(event){
    var that = this;
    var value = event.detail.value;
    that.setData({
      consignee: value
    })
  },
  userTelephone: function(event){
    var that = this;
    var value = event.detail.value;
    that.setData({
      contact: value
    })
  },

  /**************浮点数转换*************** */
accAdd:function(num1, num2) {
    var that = this;
    num1 = Number(num1);
    num2 = Number(num2);
    var dec1, dec2, times;
    try { dec1 = that.countDecimals(num1)+1; } catch (e) { dec1 = 0; }
    try { dec2 = that.countDecimals(num2)+1; } catch (e) { dec2 = 0; }
    times = Math.pow(10, Math.max(dec1, dec2));
    // var result = (num1 * times + num2 * times) / times;
    var result = (that.accMul(num1, times) + that.accMul(num2, times)) / times;
    // return that.getCorrectResult("add", num1, num2, result);
    return result;
},
 
accSub: function(num1, num2) {
    var that = this;
    num1 = Number(num1);
    num2 = Number(num2);
    var dec1, dec2, times;
    try { dec1 = that.countDecimals(num1)+1; } catch (e) { dec1 = 0; }
    try { dec2 = that.countDecimals(num2)+1; } catch (e) { dec2 = 0; }
    times = Math.pow(10, Math.max(dec1, dec2));
    // var result = Number(((num1 * times - num2 * times) / times);
  var result = Number((that.accMul(num1, times) - that.accMul(num2, times)) / times);
    // console.log("sub", num1, num2, result);
  return that.getCorrectResult("sub", num1, num2, result);
  return result;
},
accDiv: function (num1, num2) {  //乘
  var that = this;
    num1 = Number(num1);
    num2 = Number(num2);
    var t1 = 0, t2 = 0, dec1, dec2;
  try { t1 = that.countDecimals(num1); } catch (e) { }
  try { t2 = that.countDecimals(num2); } catch (e) { }
    dec1 = convertToInt(num1);
    dec2 = convertToInt(num2);
  var result = that.accMul((dec1 / dec2), Math.pow(10, t2 - t1));
  return that.getCorrectResult("div", num1, num2, result);
    // return result;
},

accMul: function (num1, num2) {   //除
  var that = this;
    num1 = Number(num1);
    num2 = Number(num2);
    var times = 0, s1 = num1.toString(), s2 = num2.toString();
  try { times += that.countDecimals(s1); } catch (e) { }
  try { times += that.countDecimals(s2); } catch (e) { }
  var result = that.convertToInt(s1) * that.convertToInt(s2) / Math.pow(10, times);
  return that.getCorrectResult("mul", num1, num2, result);
    // return result;
},
  countDecimals: function (num) {
    var that = this;
    var len = 0;
    try {
      num = Number(num);
      var str = num.toString().toUpperCase();
      if (str.split('E').length === 2) { // scientific notation
        var isDecimal = false;
        if (str.split('.').length === 2) {
          str = str.split('.')[1];
          if (parseInt(str.split('E')[0]) !== 0) {
            isDecimal = true;
          }
        }
        let x = str.split('E');
        if (isDecimal) {
          len = x[0].length;
        }
        len -= parseInt(x[1]);
      } else if (str.split('.').length === 2) { // decimal
        if (parseInt(str.split('.')[1]) !== 0) {
          len = str.split('.')[1].length;
        }
      }
    } catch (e) {
      throw e;
    } finally {
      if (isNaN(len) || len < 0) {
        len = 0;
      }
      return len;
    }
  },

  convertToInt: function (num) {
    var that = this;
    num = Number(num);
    var newNum = num;
    var times = that.countDecimals(num);
    var temp_num = num.toString().toUpperCase();
    if (temp_num.split('E').length === 2) {
      newNum = Math.round(num * Math.pow(10, times));
    } else {
      newNum = Number(temp_num.replace(".", ""));
    }
    return newNum;
  },

  getCorrectResult: function (type, num1, num2, result) {
    var that = this;
    var temp_result = 0;
    switch (type) {
      case "add":
        temp_result = num1 + num2;
        break;
      case "sub":
        temp_result = num1 - num2;
        break;
      case "div":
        temp_result = num1 / num2;
        break;
      case "mul":
        temp_result = num1 * num2;
        break;
    }
    if (Math.abs(result - temp_result) > 1) {
      return temp_result;
    }
    return result;
  },
  /****************************** */


  subNum: function(event){    //减
    var that = this;
    // console.log(event)
    var id = event.currentTarget.dataset.goodskusid;
    if(id){
      that.data.goods_skus.forEach(function(item,index,arr){
        if (id == item.id && item.num > 0){
          item.num--;

          // console.log(that.data.total);
          // console.log(item.price)

          // console.log(that.accSub(that.data.total,item.price));
          that.data.total = that.accSub(that.data.total, item.price);    //加一份价格
          // that.data.total = (that.data.total*100 - item.price*100)/100;

          // if(that.data.total > that.data.money){
          //   that.data.total_money = that.data.total - that.data.money;
          // }else{
          //   that.data.total_money = 0
          // }
          // console.log(item.price)
        }
      });
      that.setData({
        goods_skus: that.data.goods_skus,
        total: that.data.total,
        // total_money: that.data.total_money
      });
    }
  },
  addNum: function(event){  //加
    var that = this;
    // console.log(event)
    var id = event.currentTarget.dataset.goodskusid;
    if (id) {
      that.data.goods_skus.forEach(function (item, index, arr) {
        if (id == item.id && item.num < 1000) {
          item.num++;

          // console.log(that.data.total);
          // console.log(item.price);

          that.data.total = that.accAdd(that.data.total,item.price);
          // that.data.total_money = that.data.total - that.data.money;
        }
      });
      that.setData({
        total: that.data.total,
        goods_skus: that.data.goods_skus,
        // total_money: that.data.total_money
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var goods_skus_num = []; 
    // console.log(options); 
    goods_skus_num = options.product.split(",");
    // console.log(goods_skus_num)
    that.setData({
      goods_skus_num: goods_skus_num,
      id: options.id
    });
    /*****************访问商品信息**********************************/
    wx.request({
      mothod: 'GET',
      url: urls.PRODUCT.SOCKET_GOODS + Number(this.data.id),
      success: res => {
        // console.log(that.data.goods_name);
        // console.log(that.data.goods_skus);
        // console.log(that.data.goods_skus_num)
        if(res.data.goods_skus){
          res.data.goods_skus.forEach(function(item,index,arr){
            item.num = Number(that.data.goods_skus_num[index]);
            that.data.total =that.data.total + item.num*item.price;  
            // if (that.data.total > that.data.money) {
            //   that.setData({
            //     total_money: that.data.total - that.data.money
            //   })
            // }  
          });
          that.setData({
            goods: res.data,
            goods_name: res.data.goods_snap.name,
            goods_skus: res.data.goods_skus,
            total: that.data.total.toFixed(2)
          })
        }
        // console.log(that.data.goods);
        // console.log(that.data.goods_skus);
        // console.log(that.data.goods_skus_num)
      },
      //调用失败 刷新token
      fail: res => {
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      }
    })
    /********选中的优惠券*********/
    // console.log(app.globalData.couponid);
    
    /***********优惠价***************/
    
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
    var that = this;
    if (app.globalData.couponid) {
      var token = wx.getStorageSync("token");
      wx.request({
        method: 'GET',
        url: urls.MY.COUPON,
        header: { 'Authorization': token },
        success: res => {
          res.data.forEach(function (item, index, arr) {
            if (item.id == app.globalData.couponid) {

              // if(that.data.total >= item.coupon.full_money){
              //   console.log(item.coupon.full_money)
              //   that.setData({
              //     total_money: that.data.total - item.coupon.money 
              //   })
              // }
              that.setData({
                money: item.coupon.money
              });
            }
          })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})