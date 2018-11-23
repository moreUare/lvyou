// pages/TravelProduct/TravelProduct.js
var urls = require('../../utils/urls.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    products: [],
    category: [],
    tags: [],
    pageindex: 1,
    totalindex: 1,
    bcolor: "lightblue",
    gcolor: "#eee",
    param: "&category_ids[]=5&category_ids[]=6&category_ids[]=7"
  },
  //选完标签按确定
  go: function () {
    //获取选中的 *状态码selected为true的id并存进数组
    var that = this;
    var tags = [];
    that.data.category.forEach(function (item, index, arr) {
      item.child_goods_categories.forEach(function (sub_item, index, arr) {
        if (sub_item.selected == true) {
          tags.push(sub_item.id);

        }
      })
    })
    that.setData({
      tags: tags
    })
    // console.log(that.data.tags)
    /******************************/
    //关闭模态框
    this.setData({
      showModal: false
    })
    // console.log(this.data.tags)
    var param = ""
    if((this.data.tags.length)==0){
      param = "&category_ids[]=5&category_ids[]=6&category_ids[]=7" //默认
    }else{
      this.data.tags.forEach(function(item,index,arr){
        param = param +"&category_ids[]="+item;
      })
      that.setData({
        param: param
      });
    }
    var district_id = wx.getStorageSync("district_id");
    console.log(district_id);
    var url = urls.TRAVELPRODUCT.SOCKET_CATEGORY + district_id + '&page=' + this.data.pageindex+param+"";
    // console.log(param);
    // console.log(url);
    wx.request({
      method: 'GET',
      url: url,
      data: {
          //??????   
      },
      success: res => {
        // console.log(res);
        var that = this;
        var arr = res.data.data;
        let products = arr;
        that.setData({ 
            products,
            pageindex: res.data.current_page,
            totalindex: res.data.total 
          });
  
      },
      //调用失败 刷新token
      fail: res => {
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      }
    })
  },
  //选择标签 按钮
  SelectedIt: function(event){
    var that = this;
    // console.log(event);
    // console.log(event.currentTarget.dataset.smallid);
    var id = event.currentTarget.dataset.smallid;
    // console.log(event.currentTarget.dataset.state);

    if(event.currentTarget.dataset.state){    //修改状态
      that.data.category.forEach(function (item, index, arr) {
        item.child_goods_categories.forEach(function (sub_item, index, arr) {
          if (id == sub_item.id) {
            sub_item.selected = false;
          }
        })
      })
      that.setData({
        category: that.data.category
      });
    }else{
      //改变状态     
      that.data.category.forEach(function(item,index,arr){
        item.child_goods_categories.forEach(function(sub_item,index,arr){
          // console.log(sub_item);
          if(id == sub_item.id){
            sub_item.selected = true;
          }
          // console.log("id" + ":" + sub_item.id + "" + "selected" + ":" + sub_item.selected);
        })
      })
      // console.log(that.data.category)
      that.setData({
        category: that.data.category
      });
    }
   
    //添加到数组中
    //   var that = this;
    //   let tags = that.data.tags;
    //   tags.push(event.currentTarget.dataset.smallid);
    //   this.setData({
    //                   tags,
    //                   //bgcolor: "rgb(113, 184, 223);"   //变色
    //               });
    //   // console.log(this.data.tags)
  },
  //跳转到商品详情页面
  handProduct: function(event){
    // console.log(event.currentTarget.dataset.foodid)
    // var that = this;
    wx.navigateTo({
      url: '../product/product?foodid=' + event.currentTarget.dataset.foodid
    })
  },
  handSelect: function(){
    this.setData({
      showModal: true,
      tags: [],
      products: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化
    wx.request({
      method: 'GET',
      url: urls.TRAVELPRODUCT.SOCKET_GOODCATEGORY,
      success: res => {
        var that = this;
        var category = res.data;
        category.forEach(function (item, index, arr) {
          item.child_goods_categories.forEach(function(sub_item,index,arr){
            sub_item.selected=false;
          })
        })
        that.setData({ category });

        // console.log(this.data.category);
      },
      //调用失败 刷新token
      fail: res => {
        if (res.statusCode == 401 && res.data.error_code == "TOKEN_INVALID") {
          urls.refresh();
        }
      }
    });
    var district_id = wx.getStorageSync("district_id");
    wx.request({
      method: 'GET',
      url: urls.TRAVELPRODUCT.SOCKET_CATEGORY + district_id + '&page=' + 1 + '&category_ids[]=5&category_ids[]=6&category_ids[]=7',
      success: res => {
        var that = this;
        var products = res.data.data;
        // products.forEach(function (item, index, arr) {
        //   products.push(item);
        // });
        that.setData({ products });
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //  console.log("上拉触底事件");  页面太短 无法使用该函数
    var that = this;
    var num = that.data.pageindex
    if (this.data.pageindex < this.data.totalindex) {
      that.setData({
        pageindex: num + 1,
      });
      //分页请求数据
      console.log(that.data.param);
      console.log(that.data.pageindex);

      var district_id = wx.getStorageSync("district_id");
      var url = urls.TRAVELPRODUCT.SOCKET_CATEGORY + district_id + '&page=' + this.data.pageindex + that.data.param;
      wx.request({
        method: 'GET',
        url: url,
        success: res => {
          var that = this;
          var arr = res.data.data;
          let products = that.data.products;
          products = products.concat(arr);
          if(arr){
            that.setData({
              products,
              pageindex: res.data.current_page,
              totalindex: res.data.total
            });
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})