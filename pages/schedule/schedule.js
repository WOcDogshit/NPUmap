const poisData = require('../../data/pois.js')
const { haversine } = require('../../utils/geo.js')
const app = getApp()

const DAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// 两点间距离（米）

Page({
  data: {
    theme: 'lake',
    courses: [],
    grouped: [],
    next: null,
    dark: false,
    walkText: ''
  },

  onShow() {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    app.setThemeNav(theme)
    this.setData({ theme, dark })
    this.refresh()
  },

  refresh() {
    const raw = wx.getStorageSync('schedule') || []
    const courses = raw.map(c => Object.assign({}, c, { timeText: c.startTime + ' – ' + c.endTime }))
    courses.sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day
      return a.startTime < b.startTime ? -1 : 1
    })
    const grouped = []
    for (let d = 1; d <= 7; d++) {
      const items = courses.filter(c => c.day === d)
      if (items.length) grouped.push({ day: d, label: DAY_LABELS[d], items })
    }
    const next = this.findNext(courses)
    this.setData({ courses, grouped, next })
    this.estimateWalk(next)
  },

  // 估算步行时间：优先用定位，失败则从宿舍出发
  estimateWalk(course) {
    if (!course || !course.poiId) {
      this.setData({ walkText: '' })
      return
    }
    const to = poisData.pois.find(p => p.id === course.poiId)
    if (!to) {
      this.setData({ walkText: '' })
      return
    }
    const campusId = to.campus
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setWalkTime({ latitude: res.latitude, longitude: res.longitude }, to)
      },
      fail: () => {
        const dorm = poisData.pois.find(p => p.campus === campusId && p.type === '宿舍') ||
          poisData.pois.find(p => p.campus === campusId)
        if (dorm) this.setWalkTime(dorm, to)
      }
    })
  },

  setWalkTime(from, to) {
    const meters = haversine(from, to)
    const min = Math.max(1, Math.round(meters / 80))
    this.setData({ walkText: '步行约 ' + min + ' 分钟' })
  },

  // 计算"下一节课"（按当前时间往后找）
  findNext(courses) {
    const now = new Date()
    const nowDay = now.getDay() === 0 ? 7 : now.getDay()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    const cur = hh + ':' + mm
    for (const c of courses) {
      if (c.day > nowDay || (c.day === nowDay && c.startTime > cur)) return c
    }
    return null
  },

  addCourse() {
    wx.navigateTo({ url: '/pages/schedule/edit' })
  },

  editCourse(e) {
    wx.navigateTo({ url: '/pages/schedule/edit?id=' + e.currentTarget.dataset.id })
  },

  goClass(e) {
    const c = this.data.courses.find(x => x.id === e.currentTarget.dataset.id)
    if (c && c.poiId) {
      wx.navigateTo({ url: '/pages/route/route?toId=' + c.poiId })
    } else {
      wx.showToast({ title: '这节课还没选地点', icon: 'none' })
    }
  }
})
