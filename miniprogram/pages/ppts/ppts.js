// miniprogram/pages/ppts/ppts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pptList:[]
  },
 
  onLoad: function () {
    const that = this;
    let openid = wx.getStorageSync('openid');
    var db = wx.cloud.database({});
    db.collection('file').where({
      _openid: openid
    }).get({
      success: res=>{
        console.log(res.data);
        that.setData({
          pptList: res.data
        })
      }
    });
  },
  upLoad: function(){
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (chooseResult) {
        console.log('filename = ' + JSON.stringify(chooseResult.tempFiles[0]))
        var obj = chooseResult.tempFiles[0].path.lastIndexOf("/");
        wx.cloud.uploadFile({
          cloudPath: chooseResult.tempFiles[0].path.substr(obj + 1),
          filePath: chooseResult.tempFilePaths[0]
        }).then (res => {
          console.log('upload success, res = ' + JSON.stringify(res))
          that.setData({
            image: res.fileID
          })
        }).catch(err => {
          console.log('upload fail, err = ' + err)
        })
      },
    })
  },
  getPpts: function(){
    const that = this;
    let openid = wx.getStorageSync('openid');
    var db = wx.cloud.database({});
    db.collection('file').where({
      _openid: openid
    }).get({
      success: res=>{
        console.log('success: '+res.data);
        that.setData({
          pptList: res.data
        })
      }
    })
  }
})