const poisData = require('../../data/pois.js')
const app = getApp()

// emoji → 毛玻璃图标文件
const EMOJI_FILE = {
  '🚪': 'e01', '📚': 'e02', '🏫': 'e03', '🏛️': 'e04',
  '🎭': 'e05', '🏀': 'e06', '🏊': 'e07', '⚽': 'e08',
  '🍜': 'e09', '🛒': 'e10', '🛏️': 'e11', '🏥': 'e12', '🔧': 'e13',
  '🚌': 'e14', '🚍': 'e15'
}

// 顶部问候语池：按时间段分组，自动匹配当前时间（早/中/下午/晚/深夜）
const GREETINGS = {
  morning: [
    '早安，今天也元气满满 ✨',
    '早上好，晨光正好去上课 🏫',
    '新的一天，从好心情开始 ☀️'
  ],
  noon: [
    '中午好，下课去干饭吧 🍜',
    '午饭时间到，别饿着自己 🍱',
    '中午好，吃完饭去散散步 🌤️'
  ],
  afternoon: [
    '下午好，图书馆走起吗 📚',
    '下午好，课上完了去转转 🚶',
    '下午好，有课也别迷路哦 🗺️'
  ],
  evening: [
    '晚上好，回宿舍注意安全 🌙',
    '晚上好，夜宵安排一下吗 🍢',
    '晚上好，今天过得怎么样 ✨'
  ],
  night: [
    '夜深了，早点休息呀 🌙',
    '这么晚还在呀，别熬夜哦 😴',
    '深夜了，记得早点睡好觉 🛏️'
  ]
}

// 当前时间对应的问候时段
function timeKey() {
  const h = new Date().getHours()
  if (h >= 5 && h < 11) return 'morning'
  if (h >= 11 && h < 13) return 'noon'
  if (h >= 13 && h < 18) return 'afternoon'
  if (h >= 18 && h < 23) return 'evening'
  return 'night'
}

// 按当前时间选一句问候
function greetingForNow() {
  const arr = GREETINGS[timeKey()]
  return arr[Math.floor(Math.random() * arr.length)]
}

// 根据 emoji 找对应图标文件（忽略变体选择符差异）
function emojiFile(icon) {
  const norm = s => (s || '').replace(/\uFE0F/g, '')
  for (const k in EMOJI_FILE) {
    if (norm(k) === norm(icon)) return EMOJI_FILE[k]
  }
  return 'e01'
}

Page({
  data: {
    campus: null,
    greet: '',
    campuses: [],
    currentCampus: 'changan',
    pois: [],
    filtered: [],
    keyword: '',
    center: { latitude: 34.0305, longitude: 108.7656 },
    scale: 15,
    markers: [],
    theme: 'lake',
    showLabels: true,
    showBusStops: true,
    listCollapsed: false,
    dark: false,
    // 深色地图（地图个性化样式）：微信小程序的官方高级能力，当前未开通，地图底图保持浅色。
    // 如以后在微信公众平台「地图个性化样式」中配置好样式，
    // 把样式绑定的 key 填到 mapSubkey，并把 mapLayerStyle 设为 1（1 = 微信深色样式）。
    mapSubkey: '',
    mapLayerStyle: 0,
    // 图标分类管理
    poiTypeManagerOpen: false,
    poiTypes: [],
    hiddenTypes: []
  },

  onLoad() {
    const theme = app.globalData.theme || 'lake'
    const showLabels = app.globalData.showLabels
    const showBusStops = app.globalData.showBusStops
    const dark = app.globalData.darkMode
    const greet = greetingForNow()
    const campuses = poisData.campuses
    const saved = wx.getStorageSync('currentCampus') || 'changan'
    const currentCampus = campuses.some(c => c.id === saved) ? saved : 'changan'
    const campus = campuses.find(c => c.id === currentCampus)
    const pois = poisData.pois.filter(p => p.campus === currentCampus)
    const decorated = this.applyPinOrder(this.decorate(pois))
    const hiddenTypes = app.globalData.hiddenPoiTypes || []
    this.currentScale = 15
    this.setData({ campus, greet, campuses, currentCampus, pois, filtered: decorated, center: campus.center, theme, showLabels, showBusStops, dark, hiddenTypes })
    this.buildPoiTypes(decorated)
    app.setThemeNav(theme)
    this.buildMarkers(decorated)
  },

  // 切换校区
  switchCampus(e) {
    const id = e.currentTarget.dataset.campus
    if (id === this.data.currentCampus) return
    const campus = this.data.campuses.find(c => c.id === id)
    if (!campus) return
    const pois = poisData.pois.filter(p => p.campus === id)
    wx.setStorageSync('currentCampus', id)
    this.currentScale = 15
    this.setData({
      currentCampus: id,
      campus,
      pois,
      filtered: this.applyPinOrder(this.decorate(pois)),
      keyword: '',
      center: campus.center,
      scale: 15
    })
    this.buildMarkers(pois)
    this.refreshGreet()
    wx.showToast({ title: '已切换到' + campus.shortName, icon: 'none' })
  },

  // 点击顶部问候语：在当前时段内随机换一句（排除当前这句）
  refreshGreet() {
    const current = this.data.greet
    const arr = GREETINGS[timeKey()]
    let greet = current
    while (greet === current && arr.length > 1) {
      greet = arr[Math.floor(Math.random() * arr.length)]
    }
    this.setData({ greet })
  },

  // 从"更多"页返回时刷新主题/标签设置
  onShow() {
    const theme = app.globalData.theme || 'lake'
    const showLabels = app.globalData.showLabels
    const showBusStops = app.globalData.showBusStops
    const dark = app.globalData.darkMode
    const hiddenTypes = app.globalData.hiddenPoiTypes || []
    app.setThemeNav(theme)
    const changed = theme !== this.data.theme || showLabels !== this.data.showLabels || showBusStops !== this.data.showBusStops || dark !== this.data.dark || hiddenTypes.join(',') !== (this.data.hiddenTypes || []).join(',')
    // 每次都同步主题，确保顶部导航栏渐变一定更新
    this.setData({ theme, showLabels, showBusStops, dark, hiddenTypes })
    // 回到首页时按访问频率刷新列表顺序（搜索中不打扰）
    if (!this.data.keyword && this.data.pois && this.data.pois.length) {
      this.setData({ filtered: this.applyPinOrder(this.decorate(this.data.pois)) })
    }
    if (changed) {
      this.buildMarkers(this.data.filtered)
    }
  },

  // 按关键词过滤地点
  filterByKeyword(kw) {
    return this.data.pois.filter(p => {
      const name = (p.name || '').toLowerCase()
      const type = (p.type || '').toLowerCase()
      const tags = (p.tags || []).map(t => t.toLowerCase())
      return name.indexOf(kw) > -1 || type.indexOf(kw) > -1 || tags.some(t => t.indexOf(kw) > -1)
    })
  },

  // 给地点标上是否置顶
  decorate(arr) {
    return arr.map(p => Object.assign({}, p, { pinned: app.isPinned(p.id) }))
  },

  // 排序：置顶优先，其次按访问频率（常去的靠前），最后保持默认顺序
  applyPinOrder(arr) {
    return arr.slice().sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      const va = app.getVisitCount(a.id)
      const vb = app.getVisitCount(b.id)
      return vb - va
    })
  },

  // 置顶 / 取消置顶
  onTogglePin(e) {
    const id = e.currentTarget.dataset.id
    app.togglePin(id)
    const kw = this.data.keyword.trim().toLowerCase()
    const filtered = kw ? this.filterByKeyword(kw) : this.data.pois
    const ordered = this.applyPinOrder(this.decorate(filtered))
    this.setData({ filtered: ordered })
    this.buildMarkers(ordered)
  },

  // 收起/展开校园地点列表
  toggleList() {
    this.setData({ listCollapsed: !this.data.listCollapsed })
  },

  // 把地点数据转换成地图上的毛玻璃 emoji 标记
  buildMarkers(pois) {
    // 名称标签：需要在「更多-显示地点名称」开启，且地图放大到 16 级及以上
    const zoom = this.currentScale || this.data.scale
    const showLabels = this.data.showLabels && zoom >= 16
    const showBusStops = this.data.showBusStops
    // 图标管理：先过滤掉被隐藏的分类
    const hidden = this.data.hiddenTypes || []
    let visible = pois.filter(p => hidden.indexOf(p.type) === -1)
    // 关闭公交站开关时，再过滤掉公交站/校车站
    if (!showBusStops) {
      visible = visible.filter(p => p.type !== '公交站' && p.type !== '校车站')
    }
    const markers = visible.map((p, index) => {
      const m = {
        id: index + 1,
        latitude: p.latitude,
        longitude: p.longitude,
        iconPath: '/images/marker-' + emojiFile(p.icon) + '.png',
        width: 48,
        height: 48,
        anchor: { x: 0.5, y: 0.5 },
        poiId: p.id
      }
      // 校外的公交站不显示名称，只保留图标
      if (showLabels && p.type !== '公交站') {
        m.label = {
          content: p.name,
          color: '#333333',
          fontSize: 11,
          borderRadius: 4,
          bgColor: '#FFFFFF',
          padding: 4,
          textAlign: 'center'
        }
      }
      return m
    })
    this.setData({ markers })
  },

  onSearchInput(e) {
    const raw = (e.detail.value || '').trim()
    // 隐藏主题解锁暗号：输入「爱上雷神」或「33550336」
    if (raw === '爱上雷神' || raw === '33550336') {
      if (!app.globalData.unlockedGolden) {
        app.unlockGolden()
        wx.showToast({ title: '🔓 解锁了隐藏主题「逐火救世」', icon: 'none' })
      } else {
        wx.showToast({ title: '隐藏主题已经解锁过啦', icon: 'none' })
      }
      this.onSearchClear()
      return
    }
    const keyword = raw.toLowerCase()
    const filtered = this.applyPinOrder(this.decorate(this.filterByKeyword(keyword)))
    this.setData({ keyword, filtered })
    this.buildMarkers(filtered)
  },

  onSearchClear() {
    const ordered = this.applyPinOrder(this.decorate(this.data.pois))
    this.setData({ keyword: '', filtered: ordered })
    this.buildMarkers(ordered)
  },

  onTapMarker(e) {
    const marker = this.data.markers.find(m => m.id === e.detail.markerId)
    if (marker) this.goDetail(marker.poiId)
  },

  onTapPoi(e) {
    this.goDetail(e.currentTarget.dataset.id)
  },

  goDetail(id) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  },

  // 去"更多"设置页
  goMore() {
    wx.navigateTo({ url: '/pages/more/more' })
  },

  // ===== 图标分类管理 =====
  openPoiTypes() {
    this.buildPoiTypes(this.data.pois)
    this.setData({ poiTypeManagerOpen: true })
  },

  closePoiTypes() {
    this.setData({ poiTypeManagerOpen: false })
  },

  // 从地点数据汇总分类（图标用该分类第一个地点的 emoji）
  buildPoiTypes(pois) {
    const map = {}
    ;(pois || []).forEach(p => {
      const t = p.type || '其他'
      if (!map[t]) map[t] = { type: t, icon: p.icon || '📍', count: 0 }
      map[t].count++
    })
    this.setData({ poiTypes: Object.values(map) })
  },

  // 开关某个分类的图标显示
  togglePoiType(e) {
    const type = e.currentTarget.dataset.type
    const show = e.detail.value
    const hidden = this.data.hiddenTypes.slice()
    const i = hidden.indexOf(type)
    if (show && i > -1) hidden.splice(i, 1)
    if (!show && i === -1) hidden.push(type)
    this.setData({ hiddenTypes: hidden })
    app.setPoiTypesHidden(hidden)
    this.buildMarkers(this.data.filtered || this.data.pois)
  },

  // 地图缩放变化：放大到 16 级才显示名称标签，缩小则只显示图标
  onRegionChange(e) {
    if (e.detail.type === 'end' && e.detail.scale) {
      // 只记录当前缩放级别，不写回地图，避免地图缩放被"拽回去"
      const prev = this.currentScale || this.data.scale
      const scale = e.detail.scale
      this.currentScale = scale
      const prevShow = this.data.showLabels && prev >= 16
      const nowShow = this.data.showLabels && scale >= 16
      if (prevShow !== nowShow) {
        this.buildMarkers(this.data.filtered)
      }
    }
  },

  // 定位到我当前位置
  locate() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.currentScale = 17
        this.setData({
          center: { latitude: res.latitude, longitude: res.longitude },
          scale: 17
        })
        wx.showToast({ title: '已定位到你附近', icon: 'none' })
      },
      fail: () => {
        wx.showToast({ title: '定位失败，请检查定位权限', icon: 'none' })
      }
    })
  }
})
