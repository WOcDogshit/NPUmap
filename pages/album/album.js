const poisData = require('../../data/pois.js')
const app = getApp()

Page({
  data: {
    theme: 'lake',
    dark: false,
    groups: [],
    total: 0
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
    const comments = wx.getStorageSync('comments') || []
    const withImg = comments.filter(c => c.image)
    const map = {}
    withImg.forEach(c => {
      if (!map[c.poiId]) map[c.poiId] = []
      map[c.poiId].push(c.image)
    })
    const groups = Object.keys(map).map(poiId => {
      const poi = poisData.pois.find(p => p.id === poiId)
      const campus = poi ? (poisData.campuses.find(c => c.id === poi.campus) || {}).shortName : ''
      return {
        poiId,
        poiName: poi ? poi.name : '未知地点',
        campus,
        images: map[poiId]
      }
    })
    let total = 0
    groups.forEach(g => total += g.images.length)
    this.setData({ groups, total })
  },

  preview(e) {
    const src = e.currentTarget.dataset.src
    const urls = e.currentTarget.dataset.urls || [src]
    if (src) {
      wx.previewImage({ urls, current: src })
    }
  }
})
