const app = getApp()
const poisData = require('../../data/pois.js')

Page({
  data: {
    theme: 'lake',
    id: '',
    name: '',
    dayIndex: 0,
    dayOptions: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    startTime: '08:00',
    endTime: '09:40',
    poiIndex: 0,
    poiNames: [],
    isEdit: false,
    navTitle: '添加课程',
    dark: false
  },

  onLoad(options) {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    app.setThemeNav(theme)
    this.setData({ theme, dark, poiNames: poisData.pois.map(p => {
        const c = poisData.campuses.find(c => c.id === p.campus)
        return (c ? c.shortName + '·' : '') + p.name
      }) })
    if (options.id) {
      const list = wx.getStorageSync('schedule') || []
      const c = list.find(x => x.id === options.id)
      if (c) {
        const poiIndex = Math.max(0, poisData.pois.findIndex(p => p.id === c.poiId))
        this.setData({
          id: c.id,
          name: c.name,
          dayIndex: Math.max(0, c.day - 1),
          startTime: c.startTime,
          endTime: c.endTime,
          poiIndex,
          isEdit: true
        })
        this.setData({ navTitle: '编辑课程' })
      }
    }
  },

  onName(e) { this.setData({ name: e.detail.value }) },
  onDay(e) { this.setData({ dayIndex: Number(e.detail.value) }) },
  onStart(e) { this.setData({ startTime: e.detail.value }) },
  onEnd(e) { this.setData({ endTime: e.detail.value }) },
  onPoi(e) { this.setData({ poiIndex: Number(e.detail.value) }) },

  // 保存当前课程（返回是否成功）
  persist() {
    const d = this.data
    const name = d.name.trim()
    if (!name) {
      wx.showToast({ title: '请输入课程名', icon: 'none' })
      return false
    }
    if (d.endTime <= d.startTime) {
      wx.showToast({ title: '结束时间要晚于开始时间', icon: 'none' })
      return false
    }
    const poi = poisData.pois[d.poiIndex]
    const list = wx.getStorageSync('schedule') || []
    const item = {
      id: d.isEdit ? d.id : 'c' + Date.now(),
      name: name,
      day: d.dayIndex + 1,
      startTime: d.startTime,
      endTime: d.endTime,
      poiId: poi ? poi.id : '',
      poiName: poi ? poi.name : ''
    }
    if (d.isEdit) {
      const i = list.findIndex(x => x.id === d.id)
      if (i > -1) list[i] = item
    } else {
      list.push(item)
    }
    wx.setStorageSync('schedule', list)
    return true
  },

  save() {
    if (!this.persist()) return
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 400)
  },

  // 保存并留在本页，继续添加下一节
  saveAndContinue() {
    if (!this.persist()) return
    this.setData({
      id: '',
      isEdit: false,
      name: ''
    })
    this.setData({ navTitle: '添加课程' })
    wx.showToast({ title: '已保存，可继续添加', icon: 'none' })
  },

  remove() {
    wx.showModal({
      title: '删除课程',
      content: '确定删除这节课吗？',
      confirmColor: '#f04137',
      success: (res) => {
        if (res.confirm) {
          const list = (wx.getStorageSync('schedule') || []).filter(x => x.id !== this.data.id)
          wx.setStorageSync('schedule', list)
          wx.navigateBack()
        }
      }
    })
  },

  back() {
    wx.navigateBack()
  }
})
