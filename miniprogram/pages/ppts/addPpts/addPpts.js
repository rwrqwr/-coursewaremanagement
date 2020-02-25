// miniprogram/pages/ppts/addPpts/addPpts.js
var util = require('../../../utils/getTime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: [],
    number: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  chooseFile: function () {
    const that = this;
    wx.chooseMessageFile({
      count: 10,
      type: 'all',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const openId = wx.getStorageSync('openid');
        console.log(openId);
        that.setData({
          file: res.tempFiles,
          number: res.tempFiles.length
        })
      },
      fail: function () {
        console.log('fail')
      }
    })
  },
  sub: function (e) {
    const that = this;
    const db = wx.cloud.database({});
    const openId = wx.getStorageSync('openid');
    const val = e.detail.value;
    console.log(val);
    let description = [];
    let i = 0;
    for(let key in val){
      description[i] = val[key];
      i++;
    }
    that.data.file.forEach((element, index) => {
      

      console.log('description:::' + description[index])
      wx.cloud.uploadFile({
        cloudPath: 'ppt/' + openId + '/' + element.name,
        filePath: element.path
      }).then(res => {
        console.log('upload success, res = ' + JSON.stringify(res));
        db.collection('file').add({
          data: {
            name: element.name,
            createTime: util.formatTime(new Date()),
            description: description[index],
            file_id: res.fileID
          },
          success(res) {
            console.log(res)
          }
        })
      }).catch(err => {
        console.log('upload fail, err = ' + err)
      })
    });

    wx.navigateBack({ changed: true });

  }
})