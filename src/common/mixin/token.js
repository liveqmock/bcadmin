import { getToken } from '../js/ajax'

var tokenMixin = {
  data () {
    return {
      token: '',
      showSendCode: false
    }
  },
  watch: {
    showSendCode: function (newVal, oldVal) {
      if (newVal) {
        this.setToken()
      }
    }
  },
  methods: {
    setToken () {
      getToken().then((res) => {
        if (res.data.status === 'success') {
          this.token = res.data.data
        } else {
          this.$errMsg(res.data.message)
        }
      })
    }
  }
}
export { tokenMixin }
