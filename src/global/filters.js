import Vue from 'vue'

// 格式化金额
Vue.filter('formatMoney', function (val) {
  return val.toFixed(2)
})
// 格式化数据字典类型数据
Vue.filter('formatType', function (type) {
  let dictionary = JSON.parse(sessionStorage.getItem('dictionary'))
  return dictionary[type]
})
// 会员等级
Vue.filter('formatMemberLevel', function (val) {
  if (val === 'LOW_LEVEL') {
    return '初级会员'
  } else if (val === 'IN_LEVEL') {
    return '中级会员'
  } else if (val === 'HIGH_LEVEL') {
    return '高级会员'
  } else {
    return ''
  }
})
// 卡券使用状态
Vue.filter('formatCoupon', function (val) {
  if (val === 'unused') {
    return '未使用'
  } else if (val === 'used') {
    return '已使用'
  } else if (val === 'expired') {
    return '已过期'
  } else {
    return ''
  }
})
// 课程等级
Vue.filter('formatCourseLevel', function (val) {
  if (val === 'junior') {
    return '初级'
  } else if (val === 'medium') {
    return '中级'
  } else if (val === 'senior') {
    return '高级'
  } else if (val === 'international') {
    return '国际'
  }
})
// 课程审核状态
Vue.filter('formatApplyStatus', function (val) {
  if (val === 1) {
    return '待批准'
  } else if (val === 2) {
    return '已批准'
  } else if (val === 3) {
    return '不批准'
  } else {
    return ''
  }
})
// 课程日期表
Vue.filter('formatDay', function (val) {
  if (val.indexOf('-') > -1) {
    if (val.split('-').length >= 3) {
      return val.split('-')[2]
    } else {
      return val
    }
  } else {
    return val
  }
})
// 格式化订单类型
Vue.filter('formatOrderType', function (val) {
  if (val === 'curse') {
    return '课程'
  } else if (val === 'courseExperience') {
    return '体验课'
  } else {
    return val.split('实例')[0]
  }
})
// 格式化入库类型
Vue.filter('formatStockType', function (val) {
  if (val === 1) {
    return '商品入库'
  } else if (val === 2) {
    return '其他入库'
  } else if (val === 3) {
    return '销售出库'
  } else if (val === 4) {
    return '报废出库'
  } else if (val === 5) {
    return '其他出库'
  } else if (val === 6) {
    return '部门领用'
  } else if (val === 7) {
    return '退货出库'
  } else if (val === 8) {
    return '赠品入库'
  } else {
    return ''
  }
})
// 格式化性别
Vue.filter('formatSex', function (val) {
  if (val === 'm') {
    return '男'
  } else if (val === 'f') {
    return '女'
  } else {
    return '保密'
  }
})
