// miniprogram/pages/note/note.js
var util = require('../../utils/getTime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_list:[],
    openid:''
  },
  //页面加载
  onLoad: function (){
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    var db = wx.cloud.database({});
    db.collection('note').where({
      _open_id : this.openid,
    }).get({
      success: res=>{
        this.setData({
          note_list: res.data
        })
      }
    })
  },
  getUserNote: function (){
    console.log(this.note_list)
    var db = wx.cloud.database({});
    db.collection('note').where({
      _open_id : this.openid,
    }).get({
      success(res){
        this.setData({
          note_list: res.data
        })
      }
    })
  },
  add: function(){
    var db = wx.cloud.database({});
    db.collection('note').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        title:'',
        description: 'learn cloud database',
        createTime: util.formatTime(new Date()),
        context:'first'
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  }
})