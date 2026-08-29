const poisData = require('../../data/pois.js')
const app = getApp()

Page({
  data: {
    poi: null,
    theme: 'lake',
    isFav: false,
    navTitle: '地点详情',
    dark: false,
    campusName: '',
    comments: [],
    commentText: '',
    commentImage: ''
  },

  onLoad(options) {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    this.setData({ theme, dark })
    app.setThemeNav(theme)
    const poi = poisData.pois.find(p => p.id === options.id)
    let campusName = ''
    if (poi) {
      const campus = poisData.campuses.find(c => c.id === poi.campus)
      campusName = campus ? campus.shortName : ''
    }
    this.setData({ poi, isFav: poi ? app.isFavorite(poi.id) : false, campusName })
    if (poi) {
      this.setData({ navTitle: poi.name, comments: this.loadComments() })
      app.recordVisit(poi.id)
      app.checkin(poi.id)
    }
  },

  onShow() {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    app.setThemeNav(theme)
    this.setData({ theme, dark })
    if (this.data.poi) {
      this.setData({ isFav: app.isFavorite(this.data.poi.id), comments: this.loadComments() })
    }
  },

  // 收藏 / 取消收藏
  toggleFav() {
    const poi = this.data.poi
    if (!poi) return
    const nowFav = app.toggleFavorite(poi.id)
    this.setData({ isFav: nowFav })
    wx.showToast({ title: nowFav ? '已收藏 ⭐' : '已取消收藏', icon: 'none' })
  },

  // 查看校内路线（在小程序内画路线）
  goRoute() {
    const poi = this.data.poi
    if (!poi) return
    wx.navigateTo({ url: '/pages/route/route?toId=' + poi.id })
  },

  // 备用：调起腾讯地图导航
  navigate() {
    const poi = this.data.poi
    if (!poi) return
    wx.openLocation({
      latitude: poi.latitude,
      longitude: poi.longitude,
      name: poi.name,
      address: poi.address || '',
      scale: 18
    })
  },

  // ===== 校园评论 =====

  // 加载当前地点的评论
  loadComments() {
    const poi = this.data.poi
    if (!poi) return []
    const all = wx.getStorageSync('comments') || []
    return all
      .filter(c => c.poiId === poi.id)
      .sort((a, b) => b.time - a.time)
      .map(c => Object.assign({}, c, { timeText: this.formatTime(c.time) }))
  },

  // 输入评论文字
  onCommentInput(e) {
    this.setData({ commentText: e.detail.value })
  },

  // 选择图片（相册/拍照）
  chooseCommentImg() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const f = res.tempFiles[0]
        if (f && f.tempFilePath) {
          this.setData({ commentImage: f.tempFilePath })
        }
      }
    })
  },

  // 移除已选图片
  removeCommentImg() {
    this.setData({ commentImage: '' })
  },

  // 发布评论
  addComment() {
    const text = (this.data.commentText || '').trim()
    const img = this.data.commentImage
    if (!text && !img) {
      wx.showToast({ title: '写点文字或选张图吧', icon: 'none' })
      return
    }
    const poi = this.data.poi
    const id = 'c' + Date.now()
    let savedImg = ''
    if (img) {
      try {
        const fs = wx.getFileSystemManager()
        const dir = wx.env.USER_DATA_PATH + '/comments'
        try { fs.accessSync(dir) } catch (e) { fs.mkdirSync(dir, true) }
        const ext = (img.split('.').pop() || 'jpg').toLowerCase()
        savedImg = dir + '/' + id + '.' + ext
        fs.copyFileSync(img, savedImg)
      } catch (e) {
        wx.showToast({ title: '图片保存失败，请重试', icon: 'none' })
        return
      }
    }
    const all = wx.getStorageSync('comments') || []
    all.unshift({ id, poiId: poi.id, text, image: savedImg, time: Date.now() })
    wx.setStorageSync('comments', all)
    this.setData({ commentText: '', commentImage: '', comments: this.loadComments() })
    wx.showToast({ title: '评论成功 ✨', icon: 'success' })
  },

  // 长按删除评论
  deleteComment(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除评论',
      content: '确定删除这条评论吗？',
      confirmColor: '#f04137',
      success: (res) => {
        if (res.confirm) {
          const all = wx.getStorageSync('comments') || []
          const target = all.find(c => c.id === id)
          const next = all.filter(c => c.id !== id)
          wx.setStorageSync('comments', next)
          if (target && target.image) {
            try { wx.getFileSystemManager().unlinkSync(target.image) } catch (e) {}
          }
          this.setData({ comments: this.loadComments() })
        }
      }
    })
  },

  // 预览评论图片
  previewCommentImg(e) {
    const src = e.currentTarget.dataset.src
    if (src) {
      wx.previewImage({ urls: [src], current: src })
    }
  },

  // 评论时间格式化
  formatTime(ts) {
    const diff = Date.now() - ts
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前'
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前'
    if (diff < 7 * 86400000) return Math.floor(diff / 86400000) + ' 天前'
    const d = new Date(ts)
    return (d.getMonth() + 1) + '月' + d.getDate() + '日'
  },

  back() {
    wx.navigateBack()
  }
})
