// miniprogram/pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_list:[],
    openid:''
  },
  //页面加载
  getNoteList: function(){
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    var db = wx.cloud.database({});
    db.collection('note').where({
      _open_id : this.openid,
    }).get({
      success: res=>{
        console.log(res.data);
        this.setData({
          note_list: res.data,
        })
      }
    })
  },
  onLoad: function (){
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    var db = wx.cloud.database({});
    db.collection('note').where({
      _open_id : this.openid,
    }).get({
      success: res=>{
        console.log(res.data);
        this.setData({
          note_list: res.data,
        })
      }
    })
  },
  changeData:function(){
    getNoteList();
  }
  
})