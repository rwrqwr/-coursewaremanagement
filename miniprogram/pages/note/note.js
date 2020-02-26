// miniprogram/pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_list: [],
    openid: '',
    search: '',
    inputShowed: false,
    inputVal: ""
  },
  //页面加载
  getNoteList: function () {
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    var db = wx.cloud.database({});
    db.collection('note').where({
      _open_id: this.openid,
    }).get({
      success: res => {
        console.log(res.data);
        this.setData({
          note_list: res.data,
        })
      }
    })
  },
  onLoad: function () {
    this.setData({
      openid: wx.getStorageSync('openid'),
      search: this.search.bind(this)
    })
    var db = wx.cloud.database({});
    db.collection('note').where({
      _open_id: this.openid,
    }).get({
      success: res => {
        console.log(res.data);
        this.setData({
          note_list: res.data,
        })
      }
    })
  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{ text: '搜索结果', value: 1 }, { text: '搜索结果2', value: 2 }])
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },

})