// miniprogram/pages/point/point.js
// miniprogram/pages/point/point.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchState: true,
    pageNum: 0,
    pointList: [],
    menu: {
      menuId: '', //当前menuid
      menuLevel: 0, //当前menu层级
      menu: [{ name: '根目录', id: '' }], //menu路径
      menuName: '', //新增menu 名称
      folder: []  //menu下的目录
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.id) != 'undefined') {
      this.setData({
        //search: this.search.bind(this),
        'menu.menuId': options.id,
        'menu.menuLevel': options.menuLevel
      })
      this.getMenu(1);
      this.getPointList();
    
    } else {
      this.setData({
        //search: this.search.bind(this)
      })
      this.getMenu(0);
      this.getPointList();
      
    }
  },

  getPointList: function () {
    const that = this;
    let openid = wx.getStorageSync('openid');
    var db = wx.cloud.database();
    db.collection('point').where({
      _openid: openid,
      folderId: that.data.menu.menuId
    })
      .skip(that.data.pageNum * 20)
      .get({
        success: res => {
          console.log(res);
          that.setData({            
            pointList: that.data.pointList.concat(res.data)
          })
        }
      });
  },
  getMenu: function (stat) {
    const openid = wx.getStorageSync('openid');
    var db = wx.cloud.database();
    const that = this;
    if (stat == 0) {
      that.getfolder(stat);
    } else {
      db.collection('pointmenu').where({
        _openid: openid,
        _id: that.data.menu.menuId
      }).get({
        success: res => {
          that.setData({
            'menu.menu': res.data[0].menu.concat([{ name: res.data[0].menuName, id: res.data._id }])
          });
          
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
      db.collection('pointmenu').where({
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
      db.collection('pointmenu').where({
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
  getfolder: function (stat) {
    const openid = wx.getStorageSync('openid');
    var db = wx.cloud.database();
    const that = this;
    if (stat == 0) {
      db.collection('pointmenu').where({
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
      db.collection('pointmenu').where({
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

    if (this.data.menu.menuName.indexOf(' ') != -1) {
      wx.showToast({
        title: '名称不能含空或者空格',
        icon: 'none'
      })
      return
    }
    const that = this;
    db.collection('pointmenu').add({
      data: {
        menuLevel: Number(this.data.menu.menuLevel) + 1,
        menuName: this.data.menu.menuName,
        menu: this.data.menu.menu,
        fatherId: this.data.menu.menuId
      },
      success: res => {
        console.log('添加菜单成功');      
        console.log(that.data.menu.menuName);
        this.getfolder();
        that.setData({
          'menu.menuName': ''
        })
        console.log(that.data.menu.menuName);
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
    db.collection('pointmenu').where({
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
    
    var db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'deletePoint',
      data: {
        id: id
      },
    }).then(res => { console.log(res) });

    // 删除当前目录
    db.collection('pointmenu').doc(id).remove().then(res => { console.log('删除目录成功') });

    list.forEach(element => {
      if (element.fatherId == id) {
        this.deleteF(element._id, list);
      }
    });
  }
})