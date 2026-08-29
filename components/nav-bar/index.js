// 主题 → 渐变配色（亮色 / 深色）
const THEME_GRADIENT = {
  lake: ['#1464e0', '#0a3c91'],
  forest: ['#0e9f6e', '#065f46'],
  sunset: ['#e86a2e', '#b8431a'],
  violet: ['#8b5cf6', '#d946ef'],
  celadon: ['#0d9488', '#0e7490'],
  night: ['#4c6ef5', '#7048e8'],
  golden: ['#d97706', '#7c3aed']
}

const DARK_GRADIENT = {
  lake: ['#3b82f6', '#1e40af'],
  forest: ['#10b981', '#065f46'],
  sunset: ['#f97316', '#9a3412'],
  violet: ['#a78bfa', '#7e22ce'],
  celadon: ['#14b8a6', '#0f766e'],
  night: ['#818cf8', '#4c1d95'],
  golden: ['#fbbf24', '#6d28d9']
}

Component({
  properties: {
    title: { type: String, value: '' },
    showBack: { type: Boolean, value: false },
    theme: { type: String, value: 'lake' },
    dark: { type: Boolean, value: false },
    plain: { type: Boolean, value: false }
  },

  data: {
    statusBarHeight: 20,
    gradient: 'linear-gradient(135deg, #1464e0, #0a3c91)'
  },

  observers: {
    'theme, dark'() {
      const t = this.data.theme || 'lake'
      const c = this.data.dark ? DARK_GRADIENT[t] : THEME_GRADIENT[t]
      const g = c || THEME_GRADIENT.lake
      this.setData({ gradient: 'linear-gradient(135deg, ' + g[0] + ', ' + g[1] + ')' })
    }
  },

  lifetimes: {
    attached() {
      const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
      this.setData({ statusBarHeight: info.statusBarHeight || 20 })
    }
  },

  methods: {
    onBack() {
      wx.navigateBack()
    }
  }
})
