const poisData = require('../../data/pois.js')
const app = getApp()

const BADGES = [
  { key: 'newbie', name: '校园新人', icon: '🌟', desc: '打卡 1 个地点' },
  { key: 'walker', name: '初来乍到', icon: '🚶', desc: '打卡 5 个地点' },
  { key: 'explorer', name: '校园探索家', icon: '🧭', desc: '打卡 10 个地点' },
  { key: 'foodie', name: '食堂鉴赏家', icon: '🍜', desc: '打卡全部食堂' },
  { key: 'learner', name: '学习标兵', icon: '📚', desc: '打卡全部教学楼' },
  { key: 'athlete', name: '运动达人', icon: '🏀', desc: '打卡全部运动地点' },
  { key: 'master', name: '图鉴大师', icon: '🏆', desc: '打卡当前校区全部地点' }
]

Page({
  data: {
    theme: 'lake',
    dark: false,
    campusName: '',
    checkedCount: 0,
    totalCount: 0,
    badges: []
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
    const campusId = wx.getStorageSync('currentCampus') || 'changan'
    const campus = poisData.campuses.find(c => c.id === campusId)
    const pois = poisData.pois.filter(p => p.campus === campusId)
    const visited = app.getVisited()
    const checkedCount = pois.filter(p => visited.indexOf(p.id) > -1).length

    const badges = BADGES.map(b => {
      let done = false
      if (b.key === 'newbie') done = checkedCount >= 1
      else if (b.key === 'walker') done = checkedCount >= 5
      else if (b.key === 'explorer') done = checkedCount >= 10
      else if (b.key === 'foodie') done = pois.filter(p => p.type === '食堂').every(p => visited.indexOf(p.id) > -1)
      else if (b.key === 'learner') done = pois.filter(p => p.type === '教学楼').every(p => visited.indexOf(p.id) > -1)
      else if (b.key === 'athlete') done = pois.filter(p => p.type === '运动').every(p => visited.indexOf(p.id) > -1)
      else if (b.key === 'master') done = pois.every(p => visited.indexOf(p.id) > -1)
      return Object.assign({}, b, { done })
    })

    this.setData({
      campusName: campus ? campus.shortName : '',
      checkedCount,
      totalCount: pois.length,
      badges
    })
  }
})
