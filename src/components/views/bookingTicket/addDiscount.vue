<template>
  <div class="add-discount" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 票务管理</el-breadcrumb-item>
        <el-breadcrumb-item>购票</el-breadcrumb-item>
        <el-breadcrumb-item>折扣</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="150px">
        <el-form-item class="no-margin" label="订单号：">
          {{ formData.order.code }}
        </el-form-item>
        <el-form-item class="no-margin" label="订单状态：">
          {{ formData.order.status }}
        </el-form-item>
        <div v-for="(item, index) in formData.items" :key="index">
          <el-form-item class="no-margin" label="票名称：">
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
      <el-form label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统折扣：">
              <el-button type="info" @click="showDialog" class="ml">授 权</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员折扣：">
              ¥{{memberDiscount}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="hasAtuthory === 1">
          <el-col :span="2">
            <el-radio v-model="radioType" class="f-radio" :label="1">&nbsp;</el-radio>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统折扣(比例)">
              <el-input :disabled="radioType !== 1" v-model.number="discount" placeholder="请输入0~10的数字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 10px;">
            <el-button :disabled="discount === ''" type="default" @click="calPrice">确定</el-button>
          </el-col>
        </el-row>
        <el-row v-show="hasAtuthory === 1">
          <el-col :span="2">
            <el-radio v-model="radioType" class="f-radio" :label="2">&nbsp;</el-radio>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统折后(金额)">
              <el-input :disabled="radioType !== 2" v-model.number="discountPrice" placeholder="请输入折后金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 10px;">
            <el-button :disabled="discountPrice === ''" type="default" @click="calDiscount">确定</el-button>
          </el-col>
        </el-row>
        <el-row class="discount-info cal-price">
          <el-col :span="12">
            <el-form-item label="原价：">
              <del v-show="formData.discounts.length > 0">¥{{ formData.order.price }}</del>
              <p v-show="formData.discounts.length === 0">¥{{ formData.order.price }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="折扣价：">
            <p>¥{{ formData.order.paid }}</p>
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-button type="success" @click="goToPay">支付</el-button>
          <el-button type="default" @click="$router.go('-1')">取消</el-button>
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
        hasAtuthory: 0,
        authorizer: '',
        radioType: 1,
        discountPrice: ''
      }
    },
    components: {
      AuthorizePage
    },
    computed: {
      memberDiscount () {
        for (let d of this.formData.discounts) {
          if (d.type === '会员权益') {
            return d.effect
          }
        }
        return 0
      }
    },
    methods: {
      calDiscount () {
        if (this.formData.order.userId && this.formData.order.userId !== null) {
          // 如果有会员折扣
          this.formData.discounts.length = 1
        } else {
          this.formData.discounts.length = 0
        }
        this.formData.discounts.push({
          paid: this.discountPrice,
          discount: null,
          orderId: this.formData.order.id,
          type: '系统',
          endorser: this.authorizer,
          afterMemberDiscount: (this.formData.order.price - this.memberDiscount).toFixed(2)
        })
        axios.post(URL.api_name + 'backofficeapi/order/discount.do', this.formData).then((res) => {
          if (res.data.status === 'success') {
            this.formData = res.data.data
          } else {
            this.$errMsg(res.data.message)
          }
        }).catch((err) => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '计算失败'
          })
        })
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
      checkDiscount () {
        for (let i = 0; i < this.formData.discounts.length; i++) {
          // 系统折扣只能打一次
          if (this.formData.discounts[i].type === '系统') {
            return true
          }
        }
        return false
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
          }
          if (this.formData.order.userId && this.formData.order.userId !== null) {
            // 如果有会员折扣
            this.formData.discounts.length = 1
          } else {
            this.formData.discounts.length = 0
          }
          that.formData.discounts.push({
            discount: that.discount / 10,
            orderId: that.formData.order.id,
            type: '系统',
            endorser: that.authorizer,
            afterMemberDiscount: (this.formData.order.price - this.memberDiscount).toFixed(2)
          })
        }
        axios.post(URL.api_name + 'backofficeapi/order/discount.do', that.formData).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          } else {
            this.$errMsg(res.data.message)
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
          path: '/chooseWay/' + this.formData.order.id
        })
      },
      authorize (obj) {
        if (obj) {
          this.authorizer = obj.authorizer
          this.hasAtuthory = obj.hasPermission
          this.dialogFormVisible = !this.dialogFormVisible
        }
      },
      cancel (c) {
        this.dialogFormVisible = c
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
  .f-radio{
    position: absolute;
    top: 15%;
    left: 20px;
  }
</style>
