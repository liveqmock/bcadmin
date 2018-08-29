// 表单常用校验函数
const validate = {
  // 校验输入框只能输入不小于0的数字(但可以为空)
  checkInputNum: (rule, value, callback) => {
    if (value !== '' && value !== null) {
      if (typeof value === 'number' && value >= 0) {
        return callback()
      } else {
        return callback(new Error('请输入正确的数字'))
      }
    } else {
      return callback()
    }
  },
  // 校验输入框必须输入数字
  checkInputNumR: (rule, value, callback) => {
    if (value === '' || value === null) {
      return callback(new Error('该字段不能为空'))
    } else {
      if (typeof value === 'number' && value >= 0) {
        return callback()
      } else {
        return callback(new Error('请输入大于或等于0的数字'))
      }
    }
  }
}

export default validate
