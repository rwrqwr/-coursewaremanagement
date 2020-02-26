
Page({

  data: {
    noteId:'',
    note: [],
    title: ''
  },

  
  onLoad (options) {

    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
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

    var db = wx.cloud.database({});
    db.collection('note').where({
      _id : options.id,
    }).get({
      success: res=>{
        that.setData({
          title: res.data[0].title,
          noteId: options.id
        })
        that.editorCtx.setContents({
          html: res.data[0].content.html,
          success: (res) =>{
            console.log('success')
          },
          fail: res=>{
            console.log('fail')
          }
        }) 
      },
      fail: res=>{
        console.log(fail)
      }
    })
    
  },

  
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
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
  
  sub(e){
    const that = this;
    var inp = e.detail.value;
    var db = wx.cloud.database({});
    this.editorCtx.getContents({
			success(res) {

          db.collection('note').doc(that.data.noteId).update({
            data: {
              title: inp.title,
              content:res
            }
          })
          .then((res) => {
              console.log('update success');
          });

        }
      })
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.getNoteList();
    } 
      wx.navigateBack({ changed: true });
  },
  del: function(){
    var db = wx.cloud.database();
    const that = this;
    db.collection('note').doc(that.data.noteId).remove({
      success: res=>{
        console.log('delete success')
      }
    });
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.getNoteList();
    } 
      wx.navigateBack({ changed: true });
  }
})