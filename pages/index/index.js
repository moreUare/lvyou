//index.js
//获取应用实例

var urls = require('../../utils/urls.js');
var district_id_h = wx.getStorageSync("district_id");

const app = getApp()


Page({
  data: {
    imgUrls: [],
    goods: [],
    pageindex: 1,
    totalindex: 1,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    context: '请选择地址',
    district_id: null
  },
  /*****/
  GoCity: function(){
    wx.navigateTo({
      url: '../district/district',
    })
  },
  /*****/
  handProduct: function(event){
    // console.log(event);
    wx.navigateTo({
      url: '../product/product?foodid=' + event.currentTarget.dataset.foodid
    })
  },
  handExperience: function() {
    wx.navigateTo({
      url: '../TravelProduct/TravelProduct',
    })
  },

  //去认证
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
  GetGoods: function(page){
    var district_id = this.data.district_id;
    if(district_id){  
    }else{
      district_id = district_id_h;  //如果district_id不存在，就调用本地缓存中的地址
    }
    var page = page;
    wx.request({
      method: 'GET',
      url: urls.INDEX.SOCKET_INDEX_RECOMMEND + district_id + '&page=' + page,
      success: res => {
        // console.log(res);
        var that = this;
        var arr = res.data.data;
        let goods = res.data.data;
        if (arr) {
             that.setData({
              goods,
              pageindex: res.data.current_page,
              totalindex: res.data.total
            })
        }
      },
      //调用失败 刷新token
      fail: res=>{
        if(res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID"){
          urls.refresh();
        }
      }
      
    }) 
  },
  //事件处理函数
  onLoad: function (options) {
    // var district_id_b = wx.getStorageSync("district_id");
    // console.log(district_id_b);

    var that = this;
    var page = 1;
    //地址
    if(options.district_id){
      that.setData({
        district_id: options.district_id
      })
      // console.log(that.data.district_id);
    }
    var district_name = wx.getStorageSync("district_name");
    if(district_name){
      that.setData({
        context: district_name
      });
    }
    //token处理
    var token = wx.getStorageSync("token");
    if(token){ 
    }else{
      // 调用wx.getsetting 直接登录信息 ，获取信息
      var code;
      var that = this;
      wx.getSetting({
        success: res=>{
          if(res.authSetting['scope.userInfo']){    //认证过，重新登入
            wx.login({      
              success: res => {
                console.log(res);
                if (res.code) {
                  //发起网络请求
                  code = res.code;
                  that.GoAuth(code);
                } else {
                  console.log('登录失败！' + res.errMsg)
                }
              }
            })
          }else{        //未认证，重新认证
            wx.redirectTo({
              url: '../auth/auth',
            })
          }
        }
      })
    }
      
      /***************************** */
      /*******************************/  
      //初始化
      // this.setData({
      //   pageindex: 1
      // });
      //轮播图加载
      wx.request({
        method: 'GET',
        url: urls.INDEX.SOCKET_INDEX_LUNBO,
        success: res => {
          var that = this;
          var arr = res.data;
          let imgUrls = [];
          for (var i = 0, len = arr.length; i < len; i++) {
            imgUrls.push(arr[i].wide_cover_image.image_url);
            that.setData({ imgUrls });
          }
        }
      })
      that.GetGoods(1);
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //页面载入 
  onShow: function(){

  },
  onPullDownRefresh: function(){
    // console.log("下拉事件触发"); 不做处理
  },
  onReachBottom: function(){
    // console.log("上拉触底事件");
    var that = this;
    var num = that.data.pageindex
    if(this.data.pageindex < this.data.totalindex){
      that.setData({
        pageindex: num+1,
      });
      //分页请求数据
      var district_id = this.data.district_id;
      if (district_id) {
      } else {
        district_id = district_id_h;  //如果district_id不存在，就调用本地缓存中的地址
      }
      
      wx.request({
        method: 'GET',
        url: urls.INDEX.SOCKET_INDEX_RECOMMEND + district_id + '&page=' + that.data.pageindex,
        success: res => {
          var that = this;
          var arr = res.data.data;
          let goods = that.data.goods;
          goods = goods.concat(arr);
          if (arr) {
            that.setData({
              goods,
              pageindex: res.data.current_page,
              totalindex: res.data.total
            })
          }
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
})
