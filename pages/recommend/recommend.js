// pages/recommend/recommend.js
var WxParse = require('../../wxParse/wxParse.js');
var urls = require('../../utils/urls.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    totalIndex: 1,
    articleList: []
  },
  GoArticle: function(event){
    // console.log(event.currentTarget.dataset.id);
    var articleId = event.currentTarget.dataset.id;
    if(articleId){
      wx.navigateTo({
        url: '../read/read?articleId=' + articleId,
      })
    }
  },
  handtouchmove:function (){
    wx.setNavigationBarTitle({
      title: '推荐',
    })
  },
  /** 
   * 跳转页面
   */
  // jumpTap:function(option){
  //   wx.navigateTo({
  //     url: '../read/read',
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      method: 'GET',
      url: urls.ARTICLE.ARTICLELIST + 1,
      success: res => {
        // console.log(res.data.data);
        var that = this;
        let articleList = res.data.data;
        if (articleList) {
          articleList.forEach(function (item, index, arr) {
            //日期调整
            if(item.created_at){
              // console.log(item.created_at);
              //取字符串前10位 为所需日期
              var time = item.created_at.substring(0,10);
              // console.log(time);
              //replace替换"-"为"/"
              time = time.replace(/-/g,"/");
              // console.log(time);
              item.created_at = time;
            }
            
            var article = item.article_cover.content;
            WxParse.wxParse('article', 'html', article, that, 5);
          })
            //
          that.setData({
            articleList,
            pageindex: res.data.current_page,
            totalindex: res.data.total
          });
        }
        // console.log(this.data.articleList)
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
    //下拉触顶事件
    console.log("下拉触顶")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var num = that.data.pageindex;
    if (this.data.pageindex < this.data.totalindex) {
      that.setData({
        pageindex: num + 1,
      });
      //分页获取信息
      wx.request({
        method: 'GET',
        url: urls.ARTICLE.ARTICLELIST + that.data.pageindex,
        success: res => {
          var that = this;
          var articleListA = that.data.articleList;
          let articleList = res.data.data;
          if (articleList) {
            articleList.forEach(function (item, index, arr) {
              //日期调整
              if (item.created_at) {
                // console.log(item.created_at);
                //取字符串前10位 为所需日期
                var time = item.created_at.substring(0, 10);
                // console.log(time);
                //replace替换"-"为"/"
                time = time.replace(/-/g, "/");
                // console.log(time);
                item.created_at = time;
              }

              var article = item.article_cover.content;
              WxParse.wxParse('article', 'html', article, that, 5);
            })
            articleListA = articleListA.concat(articleList);
            //
            that.setData({
              articleListA,
              pageindex: res.data.current_page,
              totalindex: res.data.total
            });
          }
          // console.log(this.data.articleList)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})