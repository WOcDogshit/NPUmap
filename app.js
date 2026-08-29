App({
  onLaunch() {
    this.globalData.theme = wx.getStorageSync('theme') || 'lake'
    this.globalData.showLabels = wx.getStorageSync('showLabels') !== false
    this.globalData.showBusStops = wx.getStorageSync('showBusStops') !== false
    this.globalData.favorites = wx.getStorageSync('favorites') || []
    this.globalData.pinned = wx.getStorageSync('pinned') || []
    this.globalData.darkMode = wx.getStorageSync('darkMode') === true
    this.globalData.unlockedGolden = wx.getStorageSync('unlockedGolden') === true
    this.globalData.visits = wx.getStorageSync('visits') || {}
    this.globalData.visited = wx.getStorageSync('visited') || []
  },

  globalData: {
    theme: 'lake',
    showLabels: true,
    showBusStops: true,
    favorites: [],
    pinned: [],
    darkMode: false,
    unlockedGolden: false,
    visits: {},
    visited: []
  },

  // 根据主题设置导航栏颜色
  setThemeNav(theme) {
    const map = { lake: '#1464e0', forest: '#0e9f6e', sunset: '#e86a2e', violet: '#8b5cf6', celadon: '#0d9488', night: '#4c6ef5', golden: '#d97706' }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: map[theme] || '#1464e0'
    })
  },

  // 打卡：访问过的地方标记（探索集章）
  checkin(id) {
    const visited = this.globalData.visited || []
    if (visited.indexOf(id) === -1) {
      visited.push(id)
      this.globalData.visited = visited
      wx.setStorageSync('visited', visited)
    }
  },

  // 是否已打卡
  isVisited(id) {
    return (this.globalData.visited || []).indexOf(id) > -1
  },

  // 已打卡地点 id 列表
  getVisited() {
    return this.globalData.visited || []
  },

  // 记录地点访问次数（用于首页按访问频率排序）
  recordVisit(id) {
    const visits = this.globalData.visits || {}
    visits[id] = (visits[id] || 0) + 1
    this.globalData.visits = visits
    wx.setStorageSync('visits', visits)
  },

  // 获取地点访问次数
  getVisitCount(id) {
    return (this.globalData.visits || {})[id] || 0
  },

  // 解锁隐藏主题「逐火救世」（搜索框输入暗号触发）
  unlockGolden() {
    this.globalData.unlockedGolden = true
    wx.setStorageSync('unlockedGolden', true)
  },

  // 深色模式：仅界面 UI 变深色；地图底图暂保持浅色（开通官方深色地图样式后才会变暗，
  // 见 pages/index/index.js 与 pages/route/route.js 中 mapSubkey 的注释）
  setDarkMode(v) {
    this.globalData.darkMode = v
    wx.setStorageSync('darkMode', v)
  },

  // 置顶 / 取消置顶地点，返回是否已置顶
  togglePin(id) {
    const arr = this.globalData.pinned
    const i = arr.indexOf(id)
    if (i > -1) {
      arr.splice(i, 1)
    } else {
      arr.push(id)
    }
    wx.setStorageSync('pinned', arr)
    return i === -1
  },

  isPinned(id) {
    return this.globalData.pinned.indexOf(id) > -1
  },

  // 显示/隐藏公交站图标
  setShowBusStops(v) {
    this.globalData.showBusStops = v
    wx.setStorageSync('showBusStops', v)
  },

  // 显示/隐藏地图上的地点名称
  setShowLabels(v) {
    this.globalData.showLabels = v
    wx.setStorageSync('showLabels', v)
  },

  // 收藏 / 取消收藏，返回是否已收藏
  toggleFavorite(id) {
    const fav = this.globalData.favorites
    const i = fav.indexOf(id)
    if (i > -1) {
      fav.splice(i, 1)
    } else {
      fav.push(id)
    }
    wx.setStorageSync('favorites', fav)
    return i === -1
  },

  isFavorite(id) {
    return this.globalData.favorites.indexOf(id) > -1
  }
})
