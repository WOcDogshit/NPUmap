// ============================================
// 校内路线规划（腾讯位置服务 · 步行路线 API）
//
// 已配置：
// - KEY：WebServiceAPI key（控制台 → 应用管理 → 我的应用 → key 列表）
// - SK ：签名密钥（已开启「签名校验」，自动生成）
// - 签名算法按腾讯官方规则实现，已实测通过
//
// 使用前必做：
// 1. 开发者工具：详情 → 本地设置 → 勾选「不校验合法域名…」
//    正式发布：在微信公众平台把 https://apis.map.qq.com 加入 request 合法域名
// ============================================

const { md5 } = require('./md5.js')
const config = require('../config.js')

// key / 签名密钥统一从 config.js 读取（该文件不参与版本控制，避免敏感信息泄露）
const KEY = config.TENCENT_MAP_KEY
const SK = config.TENCENT_MAP_SK
const PATH = '/ws/direction/v1/walking'

// 解码腾讯增量压缩折线：第一个点绝对坐标(纬度,经度)，之后每两个数是一个点的增量，单位 1e-6 度
function decodePolyline(flat) {
  var polyline = []
  if (flat && flat.length >= 2) {
    var lat = flat[0]
    var lng = flat[1]
    polyline.push({ latitude: lat, longitude: lng })
    for (var i = 2; i + 1 < flat.length; i += 2) {
      lat += flat[i] * 0.000001
      lng += flat[i + 1] * 0.000001
      polyline.push({ latitude: lat, longitude: lng })
    }
  }
  return polyline
}

// 签名计算（腾讯官方规则，已实测验证）：
// sig = md5( 请求路径 + '?' + 排序后的原始参数 + SK )
// 注意：参数必须用【未编码】的原始值，按参数名升序排序，SK 直接拼在末尾
function buildSig(params) {
  var keys = Object.keys(params).sort()
  var qs = ''
  keys.forEach(function (k) {
    qs += k + '=' + params[k] + '&'
  })
  qs = qs.slice(0, -1)
  return md5(PATH + '?' + qs + SK)
}

/**
 * 获取步行路线
 * @param {{latitude:number, longitude:number}} from 起点
 * @param {{latitude:number, longitude:number}} to 终点
 * @returns {Promise<{polyline:Array, steps:Array, distance:number, duration:number}>}
 */
function walkingRoute(from, to) {
  return new Promise((resolve, reject) => {
    if (KEY.indexOf('PASTE') === 0) {
      reject(new Error('NO_KEY'))
      return
    }
    var params = {
      from: from.latitude + ',' + from.longitude,
      to: to.latitude + ',' + to.longitude,
      key: KEY
    }
    var sig = buildSig(params)
    wx.request({
      url: 'https://apis.map.qq.com' + PATH,
      data: {
        from: params.from,
        to: params.to,
        key: params.key,
        sig: sig
      },
      success(res) {
        var d = res.data
        if (d.status !== 0) {
          // 把腾讯返回的具体错误码带出去（如 121 = 每日调用量达到上限）
          var err = new Error('API_ERROR')
          err.code = d.status
          err.detail = d.message
          reject(err)
          return
        }
        if (!d.result || !d.result.routes || !d.result.routes.length) {
          reject(new Error('ROUTE_EMPTY'))
          return
        }
        var route = d.result.routes[0]
        var polyline = decodePolyline(route.polyline || [])
        var steps = (route.steps || []).map(function (s, idx) {
          return {
            idx: idx,
            instruction: s.instruction || '',
            road: s.road || '',
            distance: s.distance || 0,
            duration: s.duration || 0,
            // 每段路的详细路径点（导航时用来判断当前位置走到哪一步）
            points: decodePolyline(s.polyline || [])
          }
        })
        resolve({
          polyline: polyline,
          steps: steps,
          distance: route.distance || 0,
          duration: route.duration || 0
        })
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

module.exports = { walkingRoute }
