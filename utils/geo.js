// ============================================
// 公共地理工具
// ============================================

// 两点间距离（米，haversine 公式）
function haversine(a, b) {
  const R = 6371000
  const rad = d => d * Math.PI / 180
  const dLat = rad(b.latitude - a.latitude)
  const dLng = rad(b.longitude - a.longitude)
  const s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 2 * R * Math.asin(Math.sqrt(s))
}

module.exports = { haversine }
