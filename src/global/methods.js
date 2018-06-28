import Vue from 'vue'
import ElementUi from 'element-ui'

Vue.prototype.$errMsg = (msg) => {
  ElementUi.Message({
    type: 'error',
    message: msg
  })
}

Vue.prototype.$succssMsg = (msg) => {
  ElementUi.Message({
    type: 'success',
    message: msg
  })
}
