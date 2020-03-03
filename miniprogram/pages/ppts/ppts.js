// miniprogram/pages/ppts/ppts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    searchState: true,
    searchCon: '',
    pptList: [],
    pptClass: [],
    pageNum: 0,
    menu: {
      menuId: '', //当前menuid
      menuLevel: 0, //当前menu层级
      menu: [{ name: '根目录', id: '' }], //menu路径
      menuName: '', //新增menu 名称
      folder: []  //menu下的目录
    }
  },

  onLoad: function (options) {

    if (typeof (options.id) != 'undefined') {
      this.setData({
        search: this.search.bind(this),
        'menu.menuId': options.id,
        'menu.menuLevel': options.menuLevel
      })
      this.getPptList();
      this.getMenu(1);

    } else {
      this.setData({
        search: this.search.bind(this)
      })
      this.getPptList();
      this.getMenu(0);
    }
  },
  getPptList: function () {
    const that = this;
    let openid = wx.getStorageSync('openid');
    var db = wx.cloud.database();
    db.collection('file').where({
      _openid: openid,
      folderId: that.data.menu.menuId
    })
      .skip(that.data.pageNum * 20)
      .get({
        success: res => {
          let list = [];
          res.data.forEach(item => {
            let index = item.name.lastIndexOf(".");
            let type = item.name.substr(index + 1);
            switch (type) {
              case 'docx':
              case 'doc': console.log('doc'); list.push('t-icon-DOC'); break;
              case 'ppt':
              case 'pptx': console.log('ppt'); list.push('t-icon-PPT'); break;
              case 'xls':
              case 'xlsx': console.log('xls'); list.push('t-icon-XLS'); break;
              default: console.log('other'); list.push('t-icon-file_unknown');
            }
          });
          that.setData({
            pptClass: list,
            pptList: that.data.pptList.concat(res.data)
          })
        }
      });
  },

  search: function (value) {
    const that = this;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var db = wx.cloud.database();
        db.collection('file').where({
          name: db.RegExp({
            regexp: '.*' + that.data.searchCon,
            options: 'i',
          })
        }).get({
          success: res => {
            resolve(res.data)
          }
        })
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
  searchInput: function (e) {
    this.setData({
      searchCon: e.detail.value
    })
  },
  searchStat: function () {
    this.setData({
      searchState: false
    })
  },
  searchCancel: function () {
    this.setData({
      searchState: true
    })
  },
  deleteFile: function (e) {
    const that = this;
    const id = e.currentTarget.dataset.id;
    const fileId = e.currentTarget.dataset.fileid;
    var db = wx.cloud.database();
    db.collection('file').doc(id).remove({
      success: res => {
        wx.cloud.deleteFile({
          fileList: [fileId],
          success: res => {
            that.setData({
              pptList: []
            })
            that.getPptList();
          },
          fail: console.error
        })
      }
    })

  },
  getMenu: function (stat) {
    const openid = wx.getStorageSync('openid');
    var db = wx.cloud.database();
    const that = this;
    if (stat == 0) {
      that.getfolder(stat);
    } else {
      db.collection('menu').where({
        _openid: openid,
        _id: that.data.menu.menuId
      }).get({
        success: res => {
          console.log('menu:');
          console.log(res.data[0].menuName);
          that.setData({
            'menu.menu': res.data[0].menu.concat([{ name: res.data[0].menuName, id: res.data._id }])
          });
          console.log('第二次查询：');
          console.log(that.data.menu.menu);
        }
      })
      that.getfolder(stat);
    };
    
  },
  getfolder: function (stat) {
    const openid = wx.getStorageSync('openid');
    var db = wx.cloud.database();
    const that = this;
    if (stat == 0) {
      db.collection('menu').where({
        _openid: openid,
        menuLevel: Number(that.data.menu.menuLevel) + 1
      }).get({
        success: res => {
          console.log('folder:')
          console.log(res);
          that.setData({
            'menu.folder': res.data
          });
        }
      })
    } else {
      db.collection('menu').where({
        _openid: openid,
        fatherId: that.data.menu.menuId
      }).get({
        success: res => {

          that.setData({
            'menu.folder': res.data
          });
        }
      })
    }
  },
  addMenu: function () {
    var db = wx.cloud.database();

    if (this.data.menu.menuName.trim() == '') {
      wx.showToast({
        title: '名称不能为空或者空格',
        icon: 'none'
      })
      return
    }

    db.collection('menu').add({
      data: {
        menuLevel: Number(this.data.menu.menuLevel) + 1,
        menuName: this.data.menu.menuName,
        menu: this.data.menu.menu,
        fatherId: this.data.menu.menuId
      },
      success: res => {
        console.log('添加菜单成功');
        this.setData({
          'menu.menuName': ''
        });
        this.getfolder();
      },
      fail: function (e) {

        console.log('添加失败')
      }
    })

  },
  menuinput: function (e) {
    this.setData({
      'menu.menuName': e.detail.value
    })
  },
  handleTouchStart: function (e) {
    this.startX = e.touches[0].pageX;
  },

  /**
   * 处理touchend事件
   */
  handleTouchEnd: function (e) {
    if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e);
    } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e);
    } else {
      this.hideDeleteButton(e);
    }
  },
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e);
      } else {
        this.hideDeleteButton(e);
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e);
    }
  },
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex;
    this.setXmove(productIndex, -65);
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex;
    this.setXmove(productIndex, 0);
  },

  /**
   * 设置movable-view位移
   */
  setXmove: function (productIndex, xmove) {
    let folder = this.data.menu.folder;
    folder[productIndex].xmove = xmove;

    this.setData({
      'menu.folder': folder
    })
  },
  handleDeleteProduct: function (e) {
    const openid = wx.getStorageSync('openid');

    var db = wx.cloud.database();
    db.collection('menu').where({
      _openid: openid
    }).get().then(res => {
      let folders = res.data;
      //遍历数组找出要删除的目录和他的子目录
      this.deleteF(e.currentTarget.dataset.id, folders);
      this.getfolder();
    })

  },
  deleteF: function (id, list) {
    //删除当前目录下的所有文件
    let fileIds = [];
    var db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'deletef',
      data: {
        folder: id
      },
    }).then(res => { console.log(res) });

    // 删除当前目录
    db.collection('menu').doc(id).remove().then(res => { console.log('删除目录成功') });

    list.forEach(element => {
      if (element.fatherId == id) {
        this.deleteF(element._id, list);
      }
    });
  },
  viewFile: function (e) {
    const id = e.currentTarget.dataset.id;
    console.log(id)
    wx.cloud.downloadFile({
      fileID: id,
      success: res => {
        // get temp file path
        console.log('success');
        console.log(res.tempFilePath)
        const filePath = res.tempFilePath;
        let index = filePath.lastIndexOf(".");
        let type = filePath.substr(index + 1);
        console.log('type'+type);
        if(type != 'docx' && type != 'doc' && type != 'ppt' && type != 'pptx' && type != 'xls' && type != 'xlsx'){
          console.log('打开失败');
          wx.showToast({
            title: '该文件不支持预览',
            icon: 'none'
          })
          return;          
        }
        
            wx.openDocument({
              filePath: filePath,
              // 文档打开格式记得写上，否则可能不能打开文档。 文档类型只能是一个
              // 若是想打开多种类型的文档，可以解析文档地址中的文档格式，动态复制到fileTpye参数
              fileType: type,
              success: function (res) {
                console.log('打开文档成功')
              },
              fail: (e) => {
                console.log(e);
              }
            })

        },
        fail: err => {
          // handle error
          console.log(err);
        }
      })
  }

})