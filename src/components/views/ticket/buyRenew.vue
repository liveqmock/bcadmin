<template>
  <div class="renew-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>延时续场费</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" v-for="(t, i) in order.items" :key="i">
        <el-form-item label="票名称:">
          {{ t.itemDefName }}
        </el-form-item>
        <el-form-item label="票类型:">
          {{ t.itemType }}
        </el-form-item>
        <el-form-item label="超时价格:">
          ¥{{ t.price }}
        </el-form-item>
        <el-form-item label="需要购买半小时数量:">
          {{ t.quantity }}
        </el-form-item>
        <el-form-item label="合计:">
          ¥{{ t.amount }}
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="gotoPay">
            立即支付
          </el-button>
          <el-button @click="$router.go('-1')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getOrderDetail()
    },
    data () {
      return {
        order: {
          items: [],
          order: {}
        },
        loading: false
      }
    },
    methods: {
      getOrderDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/ticket/purchase-minute.do', {
          params: {
            code: this.$route.params.oid,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.order = res.data.data
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      gotoPay () {
        this.$router.push({
          path: '/timeoutPay/' + this.order.order.id + '/' + this.$route.params.oid
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-form-item{
    margin-bottom: 0;
  }
  .list-item{
    margin: 10px 0;
  }
</style>
