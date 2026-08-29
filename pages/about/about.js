const app = getApp()

Page({
  data: {
    theme: 'lake',
    dark: false,
    eggOpen: false,
    eggHint: false,
    eggText: 'Ciallo～(∠・ω< )⌒★'
  },
  // 彩蛋：连续点击 logo 触发
  logoTapCount: 0,
  logoTapTimer: null,

  onLogoTap() {
    this.logoTapCount += 1
    if (this.logoTapTimer) clearTimeout(this.logoTapTimer)
    this.logoTapTimer = setTimeout(() => {
      this.logoTapCount = 0
    }, 1500)
    if (this.logoTapCount >= 7) {
      this.logoTapCount = 0
      if (wx.vibrateShort) {
        wx.vibrateShort({ type: 'medium', fail: () => {} })
      }
      this.setData({ eggOpen: true, eggHint: true })
      // 弹一下，0.8 秒后自动关闭
      if (this.eggTimer) clearTimeout(this.eggTimer)
      this.eggTimer = setTimeout(() => {
        this.setData({ eggOpen: false })
      }, 800)
      // 图标下方的解锁提示，4 秒后消失
      if (this.hintTimer) clearTimeout(this.hintTimer)
      this.hintTimer = setTimeout(() => {
        this.setData({ eggHint: false })
      }, 4000)
    }
  },

  closeEgg() {
    if (this.eggTimer) clearTimeout(this.eggTimer)
    this.setData({ eggOpen: false })
  },
  onLoad() {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    this.setData({ theme, dark })
    app.setThemeNav(theme)
  },
  onShow() {
    const theme = app.globalData.theme || 'lake'
    const dark = app.globalData.darkMode
    app.setThemeNav(theme)
    if (theme !== this.data.theme || dark !== this.data.dark) {
      this.setData({ theme, dark })
    }
  },
  goChangelog() {
    wx.navigateTo({ url: '/pages/changelog/changelog' })
  },
  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' })
  },
  goTerms() {
    wx.navigateTo({ url: '/pages/terms/terms' })
  }
})
