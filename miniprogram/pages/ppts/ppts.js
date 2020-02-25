// miniprogram/pages/ppts/ppts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  }
})