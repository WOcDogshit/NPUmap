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
    const hidden = this.data.hiddenTypes || []
    const map = {}
    poisData.pois.forEach(p => {
      const t = p.type || '其他'
      if (!map[t]) map[t] = { type: t, icon: p.icon || '📍', count: 0 }
      map[t].count++
    })
    // 预先算好每个分类是否显示（避免在 WXML 里调用 indexOf）
    const types = Object.values(map).map(x => Object.assign({}, x, { visible: hidden.indexOf(x.type) === -1 }))
    this.setData({ types })
  },

  // 原生开关切换：显示/隐藏某分类
  toggleType(e) {
    const type = e.currentTarget.dataset.type
    const show = e.detail.value
    const hidden = this.data.hiddenTypes.slice()
    const i = hidden.indexOf(type)
    if (show && i > -1) hidden.splice(i, 1)
    if (!show && i === -1) hidden.push(type)
    // 重新计算每个分类的显示状态
    const types = this.data.types.map(x => Object.assign({}, x, { visible: hidden.indexOf(x.type) === -1 }))
    this.setData({ hiddenTypes: hidden, types })
    app.setPoiTypesHidden(hidden)
  }
})
