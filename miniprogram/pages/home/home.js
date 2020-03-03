// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['../../images/code-cloud-callback-config.png', '../../images/code-db-inc-dec.png'],
    menu: [
      {id: '1',img: '../../images/icon/test.png',text: '试卷'},
      {id: '2',img: '../../images/icon/teachplan.png',text: '教案'},
      {id: '3',img: '../../images/icon/courseware.png',text: '课件'},
      {id: '4',img: '../../images/icon/book.png',text: '素材'}
      ],
      val:{val:''},
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title:"推荐",
      path:"pages/home/home"
    }
  },
  pagejump: function (e) {
    var id = e.currentTarget.dataset.id;
    switch(id){
      case '1': 
      console.log(1);
      wx.navigateTo({
          url: '../testPaper/testPaper',
      });
      break;
      case 2:
        wx.navigateTo({
          url: '../kantie/kantie?Id=',
        });
      break;
      case 3:
        wx.navigateTo({
          url: '../kantie/kantie?Id=',
        })
      break;
      case 4:
        wx.navigateTo({
          url: '../kantie/kantie?Id=',
        })
      break;
    }

  }
})