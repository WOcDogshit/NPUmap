const app = getApp()

Page({
  data: {
    theme: 'lake',
    dark: false
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
  }
})
