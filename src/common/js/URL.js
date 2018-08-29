/**
 * Created by Administrator on 2017/6/3 0003.
 * 管理api环境切换
 */

let protocol = location.href.split('://')[0]
let apiObj
if (protocol === 'https') {
  apiObj = {
    // api_name: '/wx/',
    // api_name: 'http://192.168.31.253/',
    // 测试环境
    api_name: 'https://wiadev.crland.com.cn/',
    // 生产环境
    // api_name: 'https://wia.crland.com.cn/',
    fileUploadUrl: 'fileapi/icefile/upload.do'
  }
} else {
  apiObj = {
    api_name: '/wx/',
    // api_name: 'http://192.168.31.253/',
    // 测试环境
    // api_name: 'http://wiadev.crland.com.cn/',
    // 生产环境
    // api_name: 'http://wia.crland.com.cn/',
    fileUploadUrl: 'fileapi/icefile/upload.do'
  }
}

export default apiObj
