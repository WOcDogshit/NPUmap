// ============================================
// MD5 计算（用于腾讯位置服务 WebService API 签名）
// 经典 MD5 实现（Paul Johnston 版），已整理为小程序可用
// ============================================

function utf8Encode(str) {
  var out = ''
  var i, c, c2, c3
  for (i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    if (c < 0x80) {
      out += String.fromCharCode(c)
    } else if (c < 0x800) {
      out += String.fromCharCode(0xc0 | (c >> 6), 0x80 | (c & 0x3f))
    } else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
      c2 = str.charCodeAt(i + 1)
      if (c2 >= 0xdc00 && c2 <= 0xdfff) {
        i++
        c3 = ((c - 0xd800) << 10) + (c2 - 0xdc00) + 0x10000
        out += String.fromCharCode(0xf0 | (c3 >> 18), 0x80 | ((c3 >> 12) & 0x3f), 0x80 | ((c3 >> 6) & 0x3f), 0x80 | (c3 & 0x3f))
      } else {
        out += String.fromCharCode(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f))
      }
    } else {
      out += String.fromCharCode(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f))
    }
  }
  return out
}

function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xffff)
}

function bitRotateLeft(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
}
function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }

function md5cycle(x, k) {
  var a = x[0], b = x[1], c = x[2], d = x[3]
  a = md5ff(a, b, c, d, k[0], 7, -680876936)
  d = md5ff(d, a, b, c, k[1], 12, -389564586)
  c = md5ff(c, d, a, b, k[2], 17, 606105819)
  b = md5ff(b, c, d, a, k[3], 22, -1044525330)
  a = md5ff(a, b, c, d, k[4], 7, -176418897)
  d = md5ff(d, a, b, c, k[5], 12, 1200080426)
  c = md5ff(c, d, a, b, k[6], 17, -1473231341)
  b = md5ff(b, c, d, a, k[7], 22, -45705983)
  a = md5ff(a, b, c, d, k[8], 7, 1770035416)
  d = md5ff(d, a, b, c, k[9], 12, -1958414417)
  c = md5ff(c, d, a, b, k[10], 17, -42063)
  b = md5ff(b, c, d, a, k[11], 22, -1990404162)
  a = md5ff(a, b, c, d, k[12], 7, 1804603682)
  d = md5ff(d, a, b, c, k[13], 12, -40341101)
  c = md5ff(c, d, a, b, k[14], 17, -1502002290)
  b = md5ff(b, c, d, a, k[15], 22, 1236535329)
  a = md5gg(a, b, c, d, k[1], 5, -165796510)
  d = md5gg(d, a, b, c, k[6], 9, -1069501632)
  c = md5gg(c, d, a, b, k[11], 14, 643717713)
  b = md5gg(b, c, d, a, k[0], 20, -373897302)
  a = md5gg(a, b, c, d, k[5], 5, -701558691)
  d = md5gg(d, a, b, c, k[10], 9, 38016083)
  c = md5gg(c, d, a, b, k[15], 14, -660478335)
  b = md5gg(b, c, d, a, k[4], 20, -405537848)
  a = md5gg(a, b, c, d, k[9], 5, 568446438)
  d = md5gg(d, a, b, c, k[14], 9, -1019803690)
  c = md5gg(c, d, a, b, k[3], 14, -187363961)
  b = md5gg(b, c, d, a, k[8], 20, 1163531501)
  a = md5gg(a, b, c, d, k[13], 5, -1444681467)
  d = md5gg(d, a, b, c, k[2], 9, -51403784)
  c = md5gg(c, d, a, b, k[7], 14, 1735328473)
  b = md5gg(b, c, d, a, k[12], 20, -1926607734)
  a = md5hh(a, b, c, d, k[5], 4, -378558)
  d = md5hh(d, a, b, c, k[8], 11, -2022574463)
  c = md5hh(c, d, a, b, k[11], 16, 1839030562)
  b = md5hh(b, c, d, a, k[14], 23, -35309556)
  a = md5hh(a, b, c, d, k[1], 4, -1530992060)
  d = md5hh(d, a, b, c, k[4], 11, 1272893353)
  c = md5hh(c, d, a, b, k[7], 16, -155497632)
  b = md5hh(b, c, d, a, k[10], 23, -1094730640)
  a = md5hh(a, b, c, d, k[13], 4, 681279174)
  d = md5hh(d, a, b, c, k[0], 11, -358537222)
  c = md5hh(c, d, a, b, k[3], 16, -722521979)
  b = md5hh(b, c, d, a, k[6], 23, 76029189)
  a = md5hh(a, b, c, d, k[9], 4, -640364487)
  d = md5hh(d, a, b, c, k[12], 11, -421815835)
  c = md5hh(c, d, a, b, k[15], 16, 530742520)
  b = md5hh(b, c, d, a, k[2], 23, -995338651)
  a = md5ii(a, b, c, d, k[0], 6, -198630844)
  d = md5ii(d, a, b, c, k[7], 10, 1126891415)
  c = md5ii(c, d, a, b, k[14], 15, -1416354905)
  b = md5ii(b, c, d, a, k[5], 21, -57434055)
  a = md5ii(a, b, c, d, k[12], 6, 1700485571)
  d = md5ii(d, a, b, c, k[3], 10, -1894986606)
  c = md5ii(c, d, a, b, k[10], 15, -1051523)
  b = md5ii(b, c, d, a, k[1], 21, -2054922799)
  a = md5ii(a, b, c, d, k[8], 6, 1873313359)
  d = md5ii(d, a, b, c, k[15], 10, -30611744)
  c = md5ii(c, d, a, b, k[6], 15, -1560198380)
  b = md5ii(b, c, d, a, k[13], 21, 1309151649)
  a = md5ii(a, b, c, d, k[4], 6, -145523070)
  d = md5ii(d, a, b, c, k[11], 10, -1120210379)
  c = md5ii(c, d, a, b, k[2], 15, 718787259)
  b = md5ii(b, c, d, a, k[9], 21, -343485551)
  x[0] = safeAdd(a, x[0])
  x[1] = safeAdd(b, x[1])
  x[2] = safeAdd(c, x[2])
  x[3] = safeAdd(d, x[3])
}

function md5blks(s) {
  var n = ((s.length + 8) >> 6) + 1
  var blks = new Array(n * 16)
  var i
  for (i = 0; i < n * 16; i += 1) { blks[i] = 0 }
  for (i = 0; i < s.length; i += 1) {
    blks[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3)
  }
  blks[i >> 2] |= 0x80 << ((i % 4) << 3)
  blks[n * 16 - 2] = s.length * 8
  return blks
}

function hexWord(v) {
  var out = ''
  var k
  for (k = 0; k < 4; k += 1) {
    var b = (v >>> (k * 8)) & 0xff
    out += (b < 16 ? '0' : '') + b.toString(16)
  }
  return out
}

function md5(s) {
  s = utf8Encode(s)
  var x = md5blks(s)
  var state = [1732584193, -271733879, -1732584194, 271733878]
  var i
  for (i = 0; i < x.length; i += 16) {
    md5cycle(state, x.slice(i, i + 16))
  }
  return hexWord(state[0]) + hexWord(state[1]) + hexWord(state[2]) + hexWord(state[3])
}

module.exports = { md5: md5 }
