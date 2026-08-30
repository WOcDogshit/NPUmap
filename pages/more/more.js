const poisData = require('../../data/pois.js')
const app = getApp()

const THEMES = [
  { key: 'lake', name: '启真湖蓝', desc: '湖水与天空的蓝', color: '#1464e0' },
  { key: 'forest', name: '秦岭翠绿', desc: '秦岭脚下的绿', color: '#0e9f6e' },
  { key: 'sunset', name: '丹霞夕照', desc: '傍晚的霞光', color: '#e86a2e' },
  { key: 'violet', name: '紫霞漫天', desc: '晚霞的紫与粉', color: '#8b5cf6' },
  { key: 'celadon', name: '青瓷碧水', desc: '青瓷的绿与蓝', color: '#0d9488' },
  { key: 'night', name: '星河夜色', desc: '夜空下的深蓝与紫', color: '#4c6ef5' },
  // 隐藏主题：在首页搜索框输入「爱上雷神」或「33550336」解锁
  { key: 'golden', name: '逐火救世', desc: '卑鄙我去吧瞬间就爱上雷神', color: '#d97706', hidden: true, golden: true }
]

function haversine(a, b) {
  const R = 6371000
  const rad = d => d * Math.PI / 180
  const dLat = rad(b.latitude - a.latitude)
  const dLng = rad(b.longitude - a.longitude)
  const s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 2 * R * Math.asin(Math.sqrt(s))
}

function distText(m) {
  if (m < 1000) return Math.round(m) + ' 米'
  return (m / 1000).toFixed(1) + ' 公里'
}

Page({
  data: {
    theme: 'lake',
    showLabels: true,
    showBusStops: true,
    favorites: [],
    dark: false,
    themes: THEMES,
    nearbyOpen: false,
    nearbyList: [],
    nearbyState: ''
  },

  onShow() {
    const theme = app.globalData.theme || 'lake'
    const showLabels = app.globalData.showLabels
    const showBusStops = app.globalData.showBusStops
    const dark = app.globalData.darkMode
    app.setThemeNav(theme)
    this.setData({
      theme,
      showLabels,
      showBusStops,
      dark,
      favorites: this.buildFavorites(),
      themes: this.buildThemes()
    })
    this.buildTypes()
  },

  // 主题列表：隐藏主题需先解锁才显示
  buildThemes() {
    const unlocked = app.globalData.unlockedGolden
    return THEMES.filter(t => !t.hidden || unlocked)
  },

  // ===== 图标管理：分类开关 =====
  buildTypes() {
    const hidden = app.globalData.hiddenPoiTypes || []
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

  togglePoiType(e) {
    const type = e.currentTarget.dataset.type
    const show = e.detail.value
    const hidden = (app.globalData.hiddenPoiTypes || []).slice()
    const i = hidden.indexOf(type)
    if (show && i > -1) hidden.splice(i, 1)
    if (!show && i === -1) hidden.push(type)
    app.setPoiTypesHidden(hidden)
    this.buildTypes()
  },

  buildFavorites() {
    // 防御：本地收藏数据异常时（非数组）直接返回空，避免整页白屏
    const ids = app.globalData.favorites
    if (!Array.isArray(ids)) return []
    return ids.map(id => poisData.pois.find(p => p.id === id)).filter(Boolean)
  },

  setTheme(e) {
    const key = e.currentTarget.dataset.key
    app.globalData.theme = key
    wx.setStorageSync('theme', key)
    app.setThemeNav(key)
    this.setData({ theme: key })
    wx.showToast({ title: '已切换主题', icon: 'none' })
  },

  toggleLabels(e) {
    const v = e.detail.value
    app.setShowLabels(v)
    this.setData({ showLabels: v })
  },

  toggleBusStops(e) {
    const v = e.detail.value
    app.setShowBusStops(v)
    this.setData({ showBusStops: v })
  },

  // 深色模式开关：界面 UI 变深色；地图底图暂保持浅色（未开通官方深色地图样式）
  toggleDark(e) {
    const v = e.detail.value
    app.setDarkMode(v)
    this.setData({ dark: v })
  },

  // 「？」按钮：说明为什么暂不支持深色地图
  showDarkHelp() {
    wx.showModal({
      title: '关于深色地图',
      content: '深色地图需要微信官方提供的高级地图样式能力，启用后地图底图才会变成深色。目前没有启用该能力，所以深色模式只让界面变暗，地图底图保持浅色。',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#1464e0'
    })
  },

  // 关于我们
  goAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  },

  // 常用路线
  goFavRoutes() {
    wx.navigateTo({ url: '/pages/favroutes/favroutes' })
  },

  // 校园图鉴
  goAlbum() {
    wx.navigateTo({ url: '/pages/album/album' })
  },

  // 我的徽章
  goBadges() {
    wx.navigateTo({ url: '/pages/badges/badges' })
  },

  // 我的课表
  goSchedule() {
    wx.navigateTo({ url: '/pages/schedule/schedule' })
  },

  goPoi(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  },

  openNearby() {
    this.setData({ nearbyOpen: true, nearbyState: 'loading', nearbyList: [] })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const me = { latitude: res.latitude, longitude: res.longitude }
        const campusId = wx.getStorageSync('currentCampus') || 'changan'
        const campusPois = poisData.pois.filter(p => p.campus === campusId)
        const list = campusPois.map(p => {
          const item = Object.assign({}, p)
          const d = haversine(me, p)
          item.dist = d
          item.distText = distText(d)
          return item
        })
        list.sort((a, b) => a.dist - b.dist)
        this.setData({ nearbyList: list, nearbyState: '' })
      },
      fail: () => {
        this.setData({ nearbyState: 'error' })
      }
    })
  },

  closeNearby() {
    this.setData({ nearbyOpen: false })
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '将清除主题、收藏等本地数据并恢复默认（隐藏主题解锁状态会保留），确定吗？',
      confirmColor: '#1464e0',
      success: (res) => {
        if (res.confirm) {
          // 保留隐藏主题「逐火救世」的解锁状态，清除缓存后不重新隐藏
          const unlocked = app.globalData.unlockedGolden || wx.getStorageSync('unlockedGolden') === true
          wx.clearStorageSync()
          if (unlocked) {
            app.globalData.unlockedGolden = true
            wx.setStorageSync('unlockedGolden', true)
          }
          app.globalData.theme = 'lake'
          app.globalData.showLabels = true
          app.globalData.showBusStops = true
          app.globalData.darkMode = false
          app.globalData.favorites = []
          this.setData({ theme: 'lake', showLabels: true, showBusStops: true, dark: false, favorites: [], themes: this.buildThemes() })
          app.setThemeNav('lake')
          wx.showToast({ title: '已清除', icon: 'success' })
        }
      }
    })
  }
})
