// miniprogram/pages/ppts/addPpts/addPpts.js
var util = require('../../../utils/getTime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: [],
    number: 0,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  chooseFile: function () {
    const that = this;
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const openId = wx.getStorageSync('openid');
        console.log(openId);
        let sh = [];
        for(let i = 0 ; i < res.tempFiles.length; i++){
          sh.push(false);
        }
        that.setData({
          file: res.tempFiles,
          number: res.tempFiles.length,
          share: sh
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
    console.log(e);
    let description = [];
    let sh = [];
    let i = 0;
    for (let key in val) {
      if(key.startsWith('d'))
        description[i] = val[key];
      else
        sh.push(val[key]);
      i++;
    }
    that.data.file.forEach((element, index) => {

      console.log(that.data.share[index]);
      console.log('description:::' + description[index])
      console.log('share:::' + sh[index])
      wx.cloud.uploadFile({
        cloudPath: 'ppt/' + openId + '/' + element.name,
        filePath: element.path
      }).then(res => {
        console.log('upload success, res = ' + JSON.stringify(res));
        //写入数据库
        db.collection('file').add({
          data: {
            name: element.name,
            createTime: util.formatTime(new Date()),
            description: description[index],
            file_id: res.fileID,
            share: sh[index],
            folderId: that.data.id,
            downloadnum: 0
          }
        }).then(res => {
          wx.showToast({
            title: '添加成功'
          })

          setTimeout(function () {
            var pages = getCurrentPages();
            if (pages.length > 1) {
              //上一个页面实例对象
              var prePage = pages[pages.length - 2];
              prePage.setData({
                pptList: []
              })
              prePage.getPptList();
            }
            wx.navigateBack();
          }, 1000)
        })
        
      }).catch(err => {
        console.log('upload fail, err = ' + err)
        wx.showToast({
          title: '添加失败,文件名不能重复',
          icon: 'none'
        })
      })
     });
  }
})