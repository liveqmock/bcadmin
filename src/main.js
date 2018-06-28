// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import '@/common/css/reset.css'
import axios from 'axios'
// 添加全局的过滤器
import '@/global/filters'
// 添加全局方法
import '@/global/methods'

Vue.config.productionTip = false
Vue.use(ElementUI)

// axios过滤器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (sessionStorage.getItem('userInfo')) {
    config.headers['authtoken'] = JSON.parse(sessionStorage.getItem('userInfo')).sessionId
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  // Do something with response data
  if (response.data.status === '403') {
    router.push({
      path: '/login'
    })
  } else if (response.data.status === 'forbidden') {
    ElementUI.Message({
      type: 'error',
      message: response.data.message
    })
  }
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
