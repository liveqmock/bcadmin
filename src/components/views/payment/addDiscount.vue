<template>
  <div class="add-discount" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 缴费管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费</el-breadcrumb-item>
        <el-breadcrumb-item>计算折扣</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item class="no-margin" label="订单号：">
          {{ formData.order.code }}
        </el-form-item>
        <el-form-item class="no-margin" label="订单状态：">
          {{ formData.order.status }}
        </el-form-item>
        <div v-for="(item, index) in formData.items" :key="index">
          <el-form-item class="no-margin" label="缴费类目：">
            {{ item.itemDefName }}
          </el-form-item>
          <el-form-item class="no-margin" label="类型：">
            {{ item.itemType | formatTT }}
          </el-form-item>
          <el-form-item class="no-margin" label="单价：">
            {{ item.price }}
          </el-form-item>
          <el-form-item class="no-margin" label="数量：">
            {{ item.quantity }}
          </el-form-item>
          <el-form-item class="no-margin" label="总价：">
            ¥{{ item.quantity * item.price }}
          </el-form-item>
        </div>
      </el-form>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统折扣：">
              <el-col :span="12">
                <el-input :disabled="hasAtuthory === 0" v-model.number="discount" placeholder="请输入0~10的数字"></el-input>
              </el-col>
              <el-button type="info" @click="showDialog" class="ml">授 权</el-button>
              <el-button type="info" @click="calPrice">计算折扣</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(d, i) in formData.discounts" :key="i" class="discount-info cal-price">
          <el-col :span="12">
            <el-form-item :label="d.type + '：'">
              <p>{{ d.discount * 10 }}折</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="discount-info cal-price">
          <el-col :span="12">
            <el-form-item label="原价：">
              <del v-show="formData.discounts.length > 0">¥{{ formData.order.price }}</del>
              <p v-show="formData.discounts.length === 0">¥{{ formData.order.price }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="折扣价：">
              <p>¥{{ formData.order.paid }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="success" @click="goToPay">支付</el-button>
        </el-form-item>
      </el-form>
      <authorize-page :authorizeDialog="dialogFormVisible"
                      @authorize="authorize"
                      @cancelAuthorize="cancel"></authorize-page>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  import AuthorizePage from '@/components/views/common/authorize'
  export default {
    created () {
      this.getOrderInfo()
    },
    data () {
      return {
        formData: null,
        dialogFormVisible: false,
        discount: '',
        form: {
          mobile: '',
          password: ''
        },
        hasAtuthory: 0
      }
    },
    components: {
      AuthorizePage
    },
    methods: {
      authorize (obj) {
        if (obj) {
          this.authorizer = obj.authorizer
          this.hasAtuthory = obj.hasPermission
          this.dialogFormVisible = !this.dialogFormVisible
        }
      },
      cancel (c) {
        this.dialogFormVisible = c
      },
      showDialog () {
        this.dialogFormVisible = !this.dialogFormVisible
      },
      getOrderInfo () {
        // 获取初始订单信息
        var that = this
        axios.get(URL.api_name + 'backofficeapi/order/find.do', {
          params: {
            id: that.$route.params.oid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          }
        }).catch((err) => {
          console.log(err)
          that.$message({
            type: 'error',
            message: '获取数据失败',
            duration: 1000
          })
        })
      },
      addDiscount () {
        this.formData.discounts.push({
          discount: '',
          orderId: this.formData.order.id,
          type: '系统'
        })
      },
      calPrice () {
        // 计算折扣信息
        var that = this
        if (that.discount !== '') {
          if (that.discount < 0 || that.discount > 10) {
            that.$message({
              type: 'error',
              message: '折扣比例应介于0~10'
            })
            return
          } else {
            that.formData.discounts.push({
              discount: that.discount / 10,
              orderId: that.formData.order.id,
              type: '系统',
              endorser: that.authorizer
            })
          }
        }
        axios.post(URL.api_name + 'backofficeapi/order/discount.do', that.formData).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          }
        }).catch((err) => {
          console.log(err)
          that.$message({
            type: 'error',
            message: '计算失败'
          })
        })
      },
      goToPay () {
        this.$router.push({
          path: '/paymentPay/' + this.formData.order.id
        })
      }
    },
    filters: {
      formatTT (val) {
        return val.split('实例')[0]
      }
    }
  }
</script>
<style lang="less" scoped>
  .no-margin{
    margin-bottom: 0;
  }
  .label{
    display: inline-block;
    width: 88px;
  }
  .tc{
    text-align: center;
    margin-bottom: 22px;
  }
  .w-btn{
    width: 100px;
  }
</style>
