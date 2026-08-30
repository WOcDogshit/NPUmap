const poisData = require('../../data/pois.js')
const app = getApp()

Page({
  data: {
    theme: 'lake',
    dark: false,
    types: [],
    hiddenTypes: []
  },

  onLoad() {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    const hiddenTypes = app.globalData.hiddenPoiTypes || []
    app.setThemeNav(theme)
    this.setData({ theme, dark, hiddenTypes })
    this.buildTypes()
  },

  // 从全部地点汇总分类（图标用该分类第一个地点的 emoji）
  buildTypes() {
    const map = {}
    poisData.pois.forEach(p => {
      const t = p.type || '其他'
      if (!map[t]) map[t] = { type: t, icon: p.icon || '📍', count: 0 }
      map[t].count++
    })
    this.setData({ types: Object.values(map) })
  },

  // 原生开关切换：显示/隐藏某分类
  toggleType(e) {
    const type = e.currentTarget.dataset.type
    const show = e.detail.value
    const hidden = this.data.hiddenTypes.slice()
    const i = hidden.indexOf(type)
    if (show && i > -1) hidden.splice(i, 1)
    if (!show && i === -1) hidden.push(type)
    this.setData({ hiddenTypes: hidden })
    app.setPoiTypesHidden(hidden)
  }
})
