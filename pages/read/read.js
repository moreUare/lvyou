 // pages/read/read.js
var WxParse = require('../../wxParse/wxParse.js');
var urls = require('../../utils/urls.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId: 1,
    articles: {}
  },
  handtouchmove: function (){
    wx.setNavigationBarTitle({
      title: '了不起的云南为什么一生必须要去一次云南',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options)
    if(options.articleId){
      that.setData({
        articleId: options.articleId
      })
    }
    wx.request({
      method: 'GET',
      url: urls.READ.READ_WORD + this.data.articleId,
      success: res => {
        if (res) {
          // console.log(res);
          if(res.data.created_at){
            // console.log(res.data.created_at);
            //更改时间格式
            var time = res.data.created_at.substring(0,10).replace(/-/g,"/");
            // console.log(time);
            res.data.created_at = time;
          }
          that.setData({
            articles: res.data
          })
          // console.log(this.data.articles);
           var article = res.data.article_body.content;
          
           WxParse.wxParse('article', 'html', article, that, 5);
        }
      },
      //调用失败 刷新token
      fail: res => {
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      }
    })
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
    // console.log(that.data.articles)
    
    // var page = res.data.article_body.content;
    // // console.log(res)
    // WxParse.wxParse('article', 'html', page, 5);
    // // console.log(page);

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