import URL from './URL'
import axios from 'axios'
var getToken = () => {
  return new Promise((resolve, reject) => {
    axios.get(URL.api_name + 'memberapi/api/gettoken.do')
      .then((res) => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// 获取数据字典的冰场调课原因
var getUpdateCourseReason = () => {
  return new Promise((resolve, reject) => {
    axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
      params: {
        systemCode: 'causeType'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
export { getToken, getUpdateCourseReason }
