// miniprogram/pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftlist: [{
        id: 1,
        name: '语文'
      },
      {
        id: 2,
        name: '数学'
      },
      {
        id: 3,
        name: '英语'
      },
      {
        id: 4,
        name: '物理'
      },
      {
        id: 5,
        name: '化学'
      },
      {
        id: 6,
        name: '生物'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '分类',
      path: 'pages/classify/classify'
    }
  },
  selecTo: function(e) {
    var id = e.currentTarget.dataset.id;
    switch(id){
      case 1:
      case 2:
    }
  }
})