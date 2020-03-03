// miniprogram/pages/point/addPoint/addPoint.js
var util = require('../../../utils/getTime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formats: {},
    id:'',
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },

  sub: function (e) {
    const that = this;
    const inp = e.detail.value;
    const db = wx.cloud.database({});
    this.editorCtx.getContents({
      success(res) {
        db.collection('point').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
            title: inp.title,
            createTime: util.formatTime(new Date()),
            content: res,
            folderId: that.data.id
          }
        }).then((res) => {
          wx.showToast({
            title: '添加成功'
          })


          setTimeout(function () {
            var pages = getCurrentPages();
            if (pages.length > 1) {
              //上一个页面实例对象
              var prePage = pages[pages.length - 2];
              prePage.setData({
                note_list: []
              })
              prePage.getPointList();
            }
            wx.navigateBack();
          }, 1000)

        }
        )
      }
    })

  },

  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    console.log('id:::' + this.data.id );
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this;
    const openid = wx.getStorageSync('openid');
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (chooseResult) {
        console.log('filename = ' + JSON.stringify(chooseResult.tempFiles[0]))
        var obj = chooseResult.tempFiles[0].path.lastIndexOf("/");
        
        wx.cloud.uploadFile({
          cloudPath: 'img/'+ openid + '/' + chooseResult.tempFiles[0].path.substr(obj + 1),
          filePath: chooseResult.tempFilePaths[0]
        }).then(res => {
          console.log('upload success, res = ' + JSON.stringify(res));
          that.editorCtx.insertImage({
            src: res.fileID,
            width: '80%',
            success: function () {
              console.log('insert image success')
            }
          })
        })
      },
    })
  }
})