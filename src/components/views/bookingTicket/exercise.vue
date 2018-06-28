<template>
  <div class="booking">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 票务管理</el-breadcrumb-item>
        <el-breadcrumb-item>购票</el-breadcrumb-item>
        <el-breadcrumb-item>练习票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px">
        <div class="order" v-if="order.items && order.items.length > 0">
          <el-form-item class="no-margin" label="订单号：">
            {{ order.order.id }}
          </el-form-item>
          <el-form-item class="no-margin" label="订单状态：">
            {{ order.order.status }}
          </el-form-item>
          <el-row v-for="(o, i) in order.items" :key="i">
            <el-form-item class="no-margin" label="票种类型：">
              {{ o.itemType.split('实例')[0] }}
            </el-form-item>
            <el-form-item class="no-margin" label="数量：">
              {{ o.quantity }}
            </el-form-item>
          </el-row>
        </div>
        <el-form-item label="售票类型:">
          练习
        </el-form-item>
        <el-form-item label="选择票:">
          <el-button v-for="(t, i) in ticketList"
                     :key="i"
                     :class="{ active: i === tIndex }"
                     @click="checkButton(i)">{{ t.name }}</el-button>
        </el-form-item>
        <el-form-item label="单价:">
          ¥{{ price }}
        </el-form-item>
        <el-form-item label="数量:">
          <el-input-number v-model="quantity" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="合计:">
          ¥{{ price * quantity }}
        </el-form-item>
        <div v-if="companyTicket">
          <el-form-item label="是否购买陪同票:">
            <el-switch
              v-model="bugCompany"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="是"
              off-text="否">
            </el-switch>
          </el-form-item>
          <el-row v-show="bugCompany">
            <el-form-item label="单价:">
              ¥{{ companyTicket.price }}
            </el-form-item>
            <el-form-item label="数量:">
              <el-input-number v-model="cQuantity" :min="1" :max="quantity"></el-input-number>
            </el-form-item>
            <el-form-item label="合计:">
              ¥{{ companyTicket.price * cQuantity }}
            </el-form-item>
          </el-row>
        </div>
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input type="textarea" v-model="description" :rows="3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="createOrder" :loading="loading">{{ loading ? '正在提交' : '确定' }}</el-button>
          <el-button @click="$router.go('-1')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import moment from 'moment'
  import axios from 'axios'
  export default {
    created () {
      this.getTicketList()
      this.checkDate()
      this.getCompanyList()
      // this.getOrderDetail()
    },
    data () {
      return {
        loading: false,
        tIndex: 0,
        price: 0,
        quantity: 1,
        itemType: '票',
        itemDefId: '',
        totalPrice: 0,
        ticketList: [],
        submitList: [],
        dayType: '',
        bugCompany: false,
        companyTicket: null,
        cQuantity: 1,
        order: {
          items: []
        },
        description: ''
      }
    },
    methods: {
      getOrderDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/order/find.do', {
          params: {
            id: this.$route.params.bid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.order = res.data.data
            if (!that.order.order) {
              that.$message({
                type: 'error',
                message: '未查到对应的订单信息'
              })
            }
          }
        })
      },
      checkDate () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/ticket/exercise/price.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            if (res.data.data === 0) {
              that.$message({
                type: 'warning',
                message: '未定义常规单次票',
                duration: 2000
              })
            } else {
              that.price = res.data.data
            }
          }
        })
      },
      getTicketList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/ticket/search/exercise.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            status: '有效',
            dayType: that.dayType
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.ticketList = res.data.data
            if (res.data.data.length === 0) {
              this.$errMsg('未查询到有效的练习票')
            }
          }
        })
      },
      getCompanyList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/ticket/search/company.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            status: '有效'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.companyTicket = res.data.data[0]
          }
        })
      },
      createOrder () {
        var that = this
        that.itemDefId = that.ticketList[that.tIndex].id
        let params = {
          itemDefId: that.itemDefId,
          itemDefName: that.ticketList[that.tIndex].name,
          itemType: '练习票实例',
          price: that.price,
          quantity: that.quantity,
          useDate: moment().format('YYYY-MM-DD')
        }
        let cParams = {
          itemDefId: that.companyTicket.id,
          itemDefName: that.companyTicket.name,
          itemType: '陪同票实例',
          price: that.companyTicket.price,
          quantity: that.cQuantity,
          useDate: moment().format('YYYY-MM-DD')
        }
        if (that.bugCompany) {
          if (that.cQuantity > that.quantity) {
            that.$message({
              type: 'error',
              message: '陪同票数量不得超过练习票数量'
            })
            return
          }
          that.submitList.push(cParams)
        }
        that.submitList.push(params)
        that.loading = true
        axios.post(URL.api_name + 'backofficeapi/order/purchase.do', {
          items: that.submitList,
          order: {
            cashierId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            name: that.ticketList[that.tIndex].name + '等共' + that.submitList.length + '件商品',
            saleSource: 'web admin',
            code: 'P',
            type: '票',
            userId: this.$route.params.mid,
            description: that.description
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            let orderId = res.data.data.items[0].orderId
            that.$router.push({
              path: '/addDiscount/' + orderId
            })
          } else {
            that.loading = false
            that.$message({
              type: 'error',
              message: res.data.message,
              duration: '1000'
            })
          }
        }).catch(err => {
          console.log(err)
          that.loading = false
          that.$message({
            type: 'error',
            message: '提交失败'
          })
        })
      },
      checkButton (index) {
        this.tIndex = index
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-button{
    margin-right: 5px;
  }
  .active{
    background-color: #13CE66;
    border-color: #13CE66;
    color: #fff;
  }
  .no-margin{
    margin-bottom: 0;
  }
  .order{
    border-bottom: 1px solid #ebebeb;
  }
</style>
