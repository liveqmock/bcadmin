/**
 * Created by Administrator on 2017/7/31 0031.
 */
// 日期格式化
const formatDate = (parDate, formatStr) => {
  let date = new Date(parDate)
   // 函数：填充0字符
   // 参数：value-需要填充的字符串, length-总长度
   // 返回：填充后的字符串
  let zeroize = function (value, length) {
    let i, zeros
    if (!length) {
      length = 2
    }
    value = value + ''
    for (i = 0, zeros = ''; i < (length - value.length); i++) {
      zeros += '0'
    }
    return zeros + value
  }
  if (!formatStr) {
    formatStr = 'yyyy-MM-dd'
  }
  return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function ($0) {
    switch ($0) {
      case 'd':
        return date.getDate()
      case 'dd':
        return zeroize(date.getDate())
      case 'ddd':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()]
      case 'dddd':
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
      case 'M':
        return date.getMonth() + 1
      case 'MM':
        return zeroize(date.getMonth() + 1)
      case 'MMM':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
      case 'MMMM':
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]
      case 'yy':
        return (date.getFullYear() + '').substr(2)
      case 'yyyy':
        return date.getFullYear()
      case 'h':
        return date.getHours() % 12 || 12
      case 'hh':
        return zeroize(date.getHours() % 12 || 12)
      case 'H':
        return date.getHours()
      case 'HH':
        return zeroize(date.getHours())
      case 'm':
        return date.getMinutes()
      case 'mm':
        return zeroize(date.getMinutes())
      case 's':
        return date.getSeconds()
      case 'ss':
        return zeroize(date.getSeconds())
      case 'l':
        return date.getMilliseconds()
      case 'll':
        return zeroize(date.getMilliseconds())
      case 'tt':
        return date.getHours() < 12 ? 'am' : 'pm'
      case 'TT':
        return date.getHours() < 12 ? 'AM' : 'PM'
    }
  })
}
// 对象深复制
function clone (obj) {
  // Handle the 3 simple types, and null or undefined
  if (obj === null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    let copy = []
    for (var i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    let copy = {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}
// 判断数组不能重复
// [{"min":3,"percent":4},{"min":3,"percent":5},{"min":3,"percent":7}]
function hasRepeat (arr) {
  let result = []
  if (!Array.isArray(arr)) return false
  for (let a of arr) {
    if (result.indexOf(a.min) > -1) {
      return true
    } else {
      result.push(a.min)
    }
  }
  return false
}
export default {
  formatDate: formatDate,
  cloneObj: clone,
  hasRepeat: hasRepeat
}
