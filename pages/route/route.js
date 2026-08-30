const poisData = require('../../data/pois.js')
const { walkingRoute } = require('../../utils/route.js')
const app = getApp()

const THEME_LINE = {
  lake: '#1464e0',
  forest: '#0e9f6e',
  sunset: '#e86a2e',
  violet: '#8b5cf6',
  celadon: '#0d9488',
  night: '#4c6ef5',
  golden: '#7c3aed'
}

Page({
  data: {
    to: null,
    from: null,
    fromName: '',
    loading: true,
    errorMsg: '',
    distanceKm: '',
    durationMin: '',
    steps: [],
    polyline: [],
    markers: [],
    center: { latitude: 34.0305, longitude: 108.7656 },
    scale: 15,
    includePoints: [],
    theme: 'lake',
    showPicker: false,
    pois: [],
    navTitle: '校内路线',
    dark: false,
    routeFaved: false,
    // 深色地图（地图个性化样式）：微信小程序的官方高级能力，当前未开通，地图底图保持浅色。
    // 如以后在微信公众平台「地图个性化样式」中配置好样式，
    // 把样式绑定的 key 填到 mapSubkey，并把 mapLayerStyle 设为 1（1 = 微信深色样式）。
    mapSubkey: '',
    mapLayerStyle: 0
  },

  onLoad(options) {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    app.setThemeNav(theme)
    const to = poisData.pois.find(p => p.id === options.toId) || null
    this.setData({ to })
    if (to) {
      this.setData({ navTitle: '去' + to.name })
      // 起点选择器只列出终点所在校区的地点，避免跨校区导航
      const campusPois = poisData.pois.filter(p => p.campus === to.campus)
      const campus = poisData.campuses.find(c => c.id === to.campus)
      const center = campus ? campus.center : this.data.center
      this.setData({ pois: campusPois, theme, dark, center })
    } else {
      this.setData({ pois: poisData.pois, theme, dark })
    }
    // 支持从收藏路线带起点进来
    const fromPoi = options.fromId ? poisData.pois.find(p => p.id === options.fromId) : null
    if (fromPoi) {
      this.setData({ from: fromPoi, fromName: fromPoi.name })
      this.loadRoute()
    } else {
      this.setupStart()
    }
  },

  onShow() {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    app.setThemeNav(theme)
    this.setData({ theme, dark })
  },

  // 起点：优先用实时定位；定位失败就用正门
  setupStart() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          from: { latitude: res.latitude, longitude: res.longitude },
          fromName: '我的位置'
        })
        this.loadRoute()
      },
      fail: () => {
        wx.showToast({ title: '未能获取定位，已用校门作起点', icon: 'none' })
        const campusId = this.data.to ? this.data.to.campus : 'changan'
        const gate = poisData.pois.find(p => p.type === '校门' && p.campus === campusId) ||
          poisData.pois.find(p => p.campus === campusId) ||
          poisData.pois[0]
        this.setData({ from: gate, fromName: gate ? gate.name : '' })
        this.loadRoute()
      }
    })
  },

  loadRoute() {
    const from = this.data.from
    const to = this.data.to
    if (!from || !to) {
      this.setData({ loading: false, errorMsg: '缺少起点或终点' })
      return
    }
    this.setData({ loading: true, errorMsg: '', steps: [], polyline: [] })

    walkingRoute(
      { latitude: from.latitude, longitude: from.longitude },
      { latitude: to.latitude, longitude: to.longitude }
    ).then((r) => {
      const markers = [
        {
          id: 1,
          latitude: from.latitude,
          longitude: from.longitude,
          iconPath: '/images/marker-e16.png',
          width: 48,
          height: 48,
          anchor: { x: 0.5, y: 0.5 },
          label: { content: '起点', color: '#FFFFFF', fontSize: 10, bgColor: '#22b08c', padding: 3, borderRadius: 4 }
        },
        {
          id: 2,
          latitude: to.latitude,
          longitude: to.longitude,
          iconPath: '/images/marker-e17.png',
          width: 48,
          height: 48,
          anchor: { x: 0.5, y: 0.5 },
          label: { content: '终点', color: '#FFFFFF', fontSize: 10, bgColor: '#f04137', padding: 3, borderRadius: 4 }
        }
      ]
      this.setData({
        loading: false,
        polyline: [{
          points: r.polyline,
          color: THEME_LINE[this.data.theme] || '#1464e0',
          width: 6,
          arrowLine: true
        }],
        steps: r.steps,
        distanceKm: (r.distance / 1000).toFixed(1),
        durationMin: Math.max(1, Math.round(r.duration / 60)),
        markers,
        center: r.polyline.length ? r.polyline[Math.floor(r.polyline.length / 2)] : { latitude: to.latitude, longitude: to.longitude },
        // 让地图自动缩放，完整显示起点到终点的整条路线
        includePoints: [
          { latitude: from.latitude, longitude: from.longitude },
          { latitude: to.latitude, longitude: to.longitude }
        ],
        routeFaved: this.isFaved()
      })
    }).catch((e) => {
      let msg = '路线获取失败，请稍后重试'
      if (e && e.message === 'NO_KEY') {
        msg = '还没配置 key：请打开 utils/route.js 填入你的腾讯位置服务 key'
      } else if (e && e.message === 'ROUTE_EMPTY') {
        msg = '没找到合适的路线，换个起点试试'
      } else if (e && e.code === 121) {
        msg = '今天的路线查询次数已用完，明天再试'
      }
      this.setData({ loading: false, errorMsg: msg })
    })
  },

  // 打开起点选择
  showStartPicker() {
    this.setData({ showPicker: true })
  },

  hideStartPicker() {
    this.setData({ showPicker: false })
  },

  // 选择起点：0=我的位置，其他=对应地点
  selectFrom(e) {
    const idx = Number(e.currentTarget.dataset.idx)
    this.setData({ showPicker: false })
    if (idx === 0) {
      this.setupStart()
      return
    }
    const p = this.data.pois[idx - 1]
    if (p) {
      this.setData({ from: p, fromName: p.name })
      this.loadRoute()
    }
  },

  // 是否已收藏当前路线
  isFaved() {
    const from = this.data.from
    const to = this.data.to
    if (!from || !to) return false
    const favs = wx.getStorageSync('favRoutes') || []
    return favs.some(f => f.fromId === (from.id || 'loc') && f.toId === to.id)
  },

  // 收藏 / 取消收藏当前路线
  toggleFavRoute() {
    const from = this.data.from
    const to = this.data.to
    if (!from || !to) return
    const favs = wx.getStorageSync('favRoutes') || []
    const fromId = from.id || 'loc'
    const exists = favs.some(f => f.fromId === fromId && f.toId === to.id)
    if (exists) {
      wx.setStorageSync('favRoutes', favs.filter(f => !(f.fromId === fromId && f.toId === to.id)))
      this.setData({ routeFaved: false })
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      favs.push({
        id: 'f' + Date.now(),
        fromId,
        fromName: from.name || '我的位置',
        toId: to.id,
        toName: to.name,
        campus: to.campus,
        time: Date.now()
      })
      wx.setStorageSync('favRoutes', favs)
      this.setData({ routeFaved: true })
      wx.showToast({ title: '已收藏路线 ⭐', icon: 'none' })
    }
  },

  back() {
    wx.navigateBack()
  }
})
