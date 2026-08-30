const poisData = require('../../data/pois.js')
const { routePlan } = require('../../utils/route.js')
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

// ===== 步行导航几何计算 =====
// 两点距离（米）
function navDist(a, b) {
  var R = 6371000
  var rad = function (d) { return d * Math.PI / 180 }
  var dLat = rad(b.latitude - a.latitude)
  var dLng = rad(b.longitude - a.longitude)
  var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 2 * R * Math.asin(Math.sqrt(s))
}

// 点到线段的最近距离与垂足（等距圆柱近似，校园范围足够精确）
function navPointSeg(p, a, b) {
  var R = 6371000
  var rad = function (d) { return d * Math.PI / 180 }
  var px = rad(p.longitude) * R * Math.cos(rad(p.latitude))
  var py = rad(p.latitude) * R
  var ax = rad(a.longitude) * R * Math.cos(rad(a.latitude))
  var ay = rad(a.latitude) * R
  var bx = rad(b.longitude) * R * Math.cos(rad(b.latitude))
  var by = rad(b.latitude) * R
  var abx = bx - ax
  var aby = by - ay
  var apx = px - ax
  var apy = py - ay
  var ab2 = abx * abx + aby * aby
  var t = ab2 === 0 ? 0 : (apx * abx + apy * aby) / ab2
  t = Math.max(0, Math.min(1, t))
  var cx = ax + t * abx
  var cy = ay + t * aby
  var dist = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy))
  var proj = {
    latitude: a.latitude + t * (b.latitude - a.latitude),
    longitude: a.longitude + t * (b.longitude - a.longitude)
  }
  return { t: t, dist: dist, proj: proj }
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
    // 路线模式：walking 步行 / bicycling 骑行
    routeMode: 'walking',
    // 实时导航
    navMode: false,
    navInstruction: '',
    navRemainDist: '',
    navRemainMin: '',
    // 导航地图朝向：heading=前进方向朝上（跟随），north=北向上
    navHeadingMode: 'heading',
    rotate: 0,
    // 顶部导航信息卡：默认展开；收起后地图更大
    navCardOpen: true,
    // 状态栏高度（顶部导航卡避开状态栏）
    navStatusBar: 20,
    // 深色地图（地图个性化样式）：微信小程序的官方高级能力，当前未开通，地图底图保持浅色。
    // 如以后在微信公众平台「地图个性化样式」中配置好样式，
    // 把样式绑定的 key 填到 mapSubkey，并把 mapLayerStyle 设为 1（1 = 微信深色样式）。
    mapSubkey: '',
    mapLayerStyle: 0
  },

  onLoad(options) {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    // 顶部导航卡需要避开手机状态栏
    const winInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    this.setData({ navStatusBar: winInfo.statusBarHeight || 20 })
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

    routePlan(
      { latitude: from.latitude, longitude: from.longitude },
      { latitude: to.latitude, longitude: to.longitude },
      this.data.routeMode
    ).then((r) => {
      // 保存步骤数据，供实时导航使用
      this._steps = r.steps
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

  // 切换步行 / 骑行，重新规划路线
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode
    if (mode === this.data.routeMode) return
    this.setData({ routeMode: mode, navMode: false })
    if (wx.offLocationChange) wx.offLocationChange()
    if (wx.stopLocationUpdate) wx.stopLocationUpdate({ fail: () => {} })
    this.loadRoute()
  },

  // ===== 实时步行导航 =====
  startNav() {
    const steps = this._steps || []
    const to = this.data.to
    if (!steps.length || !to) {
      wx.showToast({ title: '暂无路线可导航', icon: 'none' })
      return
    }
    this._navStepIdx = -1
    // 开启罗盘，获取手机朝向（用于「前进朝上」跟随旋转）
    if (wx.startCompass) wx.startCompass({ fail: () => {} })
    if (wx.onCompassChange) {
      wx.onCompassChange((res) => {
        if (this.data.navMode && this.data.navHeadingMode === 'heading' && typeof res.direction === 'number') {
          const rotate = res.direction % 360
          this._currentRotate = rotate
          this.setData({ rotate })
        }
      })
    }
    this.setData({
      navMode: true,
      scale: 18,
      rotate: 0,
      // 清掉自动缩放适配，让用户手动缩放的级别保持住
      includePoints: [],
      navInstruction: steps[0].instruction || '',
      navRemainDist: '剩余 ' + (this.data.distanceKm || ''),
      navRemainMin: '约 ' + (this.data.durationMin || '') + ' 分钟'
    })
    wx.startLocationUpdate({
      success: () => {
        wx.onLocationChange((res) => this.onNavLocation(res))
        wx.getLocation({
          type: 'gcj02',
          success: (res) => this.onNavLocation(res),
          fail: () => {}
        })
      },
      fail: () => {
        wx.getLocation({
          type: 'gcj02',
          success: (res) => this.onNavLocation(res),
          fail: () => {
            wx.showToast({ title: '无法获取定位，导航不可用', icon: 'none' })
            this.setData({ navMode: false })
          }
        })
      }
    })
  },

  stopNav() {
    if (wx.stopLocationUpdate) wx.stopLocationUpdate({ fail: () => {} })
    if (wx.offLocationChange) wx.offLocationChange()
    if (wx.stopCompass) wx.stopCompass({ fail: () => {} })
    if (wx.offCompassChange) wx.offCompassChange()
    this.setData({ navMode: false, scale: 15, rotate: 0 })
  },

  // 切换导航地图朝向：前进方向朝上 / 北向上
  switchHeadingMode(e) {
    const mode = e.currentTarget.dataset.mode
    if (mode === this.data.navHeadingMode) return
    this.setData({ navHeadingMode: mode, rotate: mode === 'north' ? 0 : (this._currentRotate || 0) })
  },

  // 收起 / 展开顶部导航信息卡（收起后地图可视区域更大）
  toggleNavCard() {
    this.setData({ navCardOpen: !this.data.navCardOpen })
  },

  // 定位变化：地图跟随 + 判断当前走到哪一步 + 更新剩余距离
  onNavLocation(res) {
    const cur = { latitude: res.latitude, longitude: res.longitude }
    const r = this.calcNav(cur)
    if (!r) return
    const remainText = r.remain >= 1000
      ? (r.remain / 1000).toFixed(1) + ' 公里'
      : Math.max(1, Math.round(r.remain)) + ' 米'
    // 只跟随位置，不重置缩放级别（用户手动放大后保持），地图朝向由罗盘控制
    this.setData({
      center: cur,
      navInstruction: r.instruction,
      navRemainDist: '剩余 ' + remainText,
      navRemainMin: '约 ' + Math.max(1, Math.round(r.remain / this.speedPerMin())) + ' 分钟'
    })
    // 进入新的一段路时振动提醒
    if (r.idx !== this._navStepIdx) {
      this._navStepIdx = r.idx
      if (wx.vibrateShort) wx.vibrateShort({ type: 'medium', fail: () => {} })
    }
  },

  // 步行约 70 米/分，骑行约 250 米/分
  speedPerMin() {
    return this.data.routeMode === 'bicycling' ? 250 : 70
  },

  // 计算当前位置对应的路线步骤与剩余距离
  calcNav(cur) {
    const steps = this._steps || []
    const to = this.data.to
    if (!steps.length) return null
    let bestIdx = -1
    let bestDist = Infinity
    let bestProj = null
    let bestSeg = -1
    steps.forEach((s, si) => {
      const pts = s.points
      if (!pts || pts.length < 2) return
      for (let i = 0; i < pts.length - 1; i++) {
        const r = navPointSeg(cur, pts[i], pts[i + 1])
        if (r.dist < bestDist) {
          bestDist = r.dist
          bestIdx = si
          bestProj = r.proj
          bestSeg = i
        }
      }
    })
    if (bestIdx === -1) {
      // 兜底：没有分步路径点时，用直线距离估算
      return {
        idx: 0,
        remain: to ? navDist(cur, to) : 0,
        instruction: steps[0] ? steps[0].instruction : ''
      }
    }
    // 剩余距离 = 当前段剩余 + 后续各段距离
    let remain = 0
    const pts = steps[bestIdx].points
    if (pts && bestSeg + 1 < pts.length) {
      remain += navDist(bestProj, pts[bestSeg + 1])
      for (let i = bestSeg + 1; i < pts.length - 1; i++) {
        remain += navDist(pts[i], pts[i + 1])
      }
    }
    for (let j = bestIdx + 1; j < steps.length; j++) {
      remain += steps[j].distance || 0
    }
    return {
      idx: bestIdx,
      remain: remain,
      instruction: steps[bestIdx].instruction || ''
    }
  },

  back() {
    wx.navigateBack()
  },

  onUnload() {
    this.stopNav()
  }
})
