import axios from 'axios'
import URL from '@/common/js/URL.js'
export default {
  methods: {
    invoice (orderId) {
      axios.get(URL.api_name + 'backofficeapi/order/update-invoice.do', {
        params: {
          orderId: orderId
        }
      }).then(res => {
        if (res.data.status === 'success') {
          this.$succssMsg(res.data.message)
          this.getListData(this.currentPage)
        } else {
          this.$errMsg(res.data.message)
        }
      })
    }
  }
}
