const poisData = require('../../data/pois.js')
const app = getApp()

Page({
  data: {
    theme: 'lake',
    dark: false,
    routes: []
  },

  onLoad() {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    this.setData({ theme, dark })
    app.setThemeNav(theme)
    this.refresh()
  },

  onShow() {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    app.setThemeNav(theme)
    this.setData({ theme, dark })
    this.refresh()
  },

  refresh() {
    const favs = wx.getStorageSync('favRoutes') || []
    const routes = favs.map(f => {
      const campus = poisData.campuses.find(c => c.id === f.campus)
      return Object.assign({}, f, { campusName: campus ? campus.shortName : '' })
    })
    this.setData({ routes })
  },

  goRoute(e) {
    // 刚长按（想删除）时，松手不再触发跳转
    if (this._longPressedAt && Date.now() - this._longPressedAt < 800) return
    const id = e.currentTarget.dataset.id
    const r = this.data.routes.find(x => x.id === id)
    if (r) {
      wx.navigateTo({ url: '/pages/route/route?toId=' + r.toId + '&fromId=' + r.fromId })
    }
  },

  deleteRoute(e) {
    this._longPressedAt = Date.now()
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除路线',
      content: '确定删除这条常用路线吗？',
      confirmColor: '#f04137',
      success: (res) => {
        if (res.confirm) {
          const favs = wx.getStorageSync('favRoutes') || []
          wx.setStorageSync('favRoutes', favs.filter(f => f.id !== id))
          this.refresh()
        }
      }
    })
  }
})
