// miniprogram/pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_list: [],
    openid: '',
    search: '',
    searchState: true,
    inputVal: "",
    searchCon:'',
    pageNum: 0
  },
  onLoad: function () {
    this.setData({
      openid: wx.getStorageSync('openid'),
      search: this.search.bind(this)
    })
    this.getNoteList();
  },
  search: function (value) {
    const that = this;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var db = wx.cloud.database();
        db.collection('note').where({
          title:db.RegExp({
            regexp: '.*' + that.data.searchCon,
            options: 'i',
          })
        }).get({
          success: res=>{
            console.log(res);
            resolve(res.data)    
          }
        })
        //resolve([{ text: '搜索结果' }, { text: '搜索结果2'}])
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
  searchInput: function(e){
    this.setData({
      searchCon: e.detail.value
    })
  },
  searchStat: function(){
    this.setData({
      searchState: false
    })
  },
  searchCancel: function(){
    this.setData({
      searchState: true
    })
  },
  getNoteList: function () {
    const that = this;
    that.setData({
      openid: wx.getStorageSync('openid')
    })
    var db = wx.cloud.database({});
    db.collection('note').where({
      _open_id: that.openid,
    })
    .skip(this.data.pageNum * 20)
    .get({
      success: res => {
        console.log(res.data);
        this.setData({
          note_list: that.data.note_list.concat(res.data),
        })
      }
    })
  },
  onReachBottom: function(){
    this.setData({
      pageNum: this.data.pageNum+1
    })
    this.getNoteList();
  }
})