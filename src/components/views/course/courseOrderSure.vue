<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>购课</el-breadcrumb-item>
        <el-breadcrumb-item>课程订单确认</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper stepsss">
      <el-steps :space="150" :active="1" finish-status="success">
        <el-step title="选课"></el-step>
        <el-step title="确认订单"></el-step>
        <el-step title="付款"></el-step>
        <el-step title="完成订单"></el-step>
        <el-step title="选择时间/教练"></el-step>
      </el-steps>
    </div>
    <div class="form-data">
      <el-form label-width="180px">
        <el-form-item label="课程名称：">
          <el-col :span="12">
            <p>{{ formData.courseName }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="教练等级：">
          <el-col :span="12">
            <p>{{ formData.courseLevel }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程图片：">
          <el-col :span="12">
            <img :src="formData.picturePath" class="logo-img">
          </el-col>
        </el-form-item>
        <el-form-item label="课程介绍：">
          <el-col :span="12">
            <p v-html="formData.introduce"></p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程简介：">
          <el-col :span="12">
            <p>{{ formData.brief }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程数量：">
          <el-col :span="12">
            <p>{{ formData.courseNum }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="每节时长：">
          <el-col :span="12">
            <p>{{ formData.coursePeriod }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课节单价：">
          <el-col :span="12">
            <p>￥{{ formData.coursePrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程总价：">
          <el-col :span="12">
            <p>￥{{ formData.courseTotalPrice }}</p>
          </el-col>
        </el-form-item>
        <!--<el-form-item label="赠送陪同票张数：">
          <el-col :span="12">
            <p>{{ formData.freeCompTicket }}张</p>
          </el-col>
        </el-form-item>-->
        <el-form-item label="系统折扣：">
          <!--<el-col :span="4">
            <el-input v-model.number="discount" :disabled="hasAtuthory === 0" @keyup.enter.native="getSystemDiscount"></el-input>
          </el-col>-->
          <el-button @click="authorizeDialog = true">授权</el-button>
        </el-form-item>
        <el-row v-show="hasAtuthory === 1">
          <el-col :span="8">
            <el-radio v-model="radioType" class="f-radio" :label="1">&nbsp;</el-radio>
            <el-form-item label="系统折扣(比例)">
              <el-input v-model.number="discount" :disabled="radioType !== 1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 10px;">
            <el-button :disabled="discount === ''" type="default" @click="getSystemDiscount">确定</el-button>
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
            <el-button :disabled="discountPrice === ''" type="default" @click="getSystemDiscount">确定</el-button>
          </el-col>
        </el-row>
        <el-form-item label="现金券：">
          <el-col :span="12">
            <el-select v-model="formInline.money" placeholder="请选择">
              <el-option :label="o.couponName" :value="o.id" v-for="(o, i) in moneyCounts" :key="i">{{ o.couponName }}<span class="color_gray">(有效期至：{{ o.useEndTime }})</span></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="课程券：">
          <el-col :span="12">
            <el-checkbox-group
              v-model="checkCC"
              :max="2">
              <el-checkbox v-for="item in courseCounts" @change="formatCheckbox" :label="item.id" :key="item.id">{{item.couponName}}<span class="color_gray">(有效期至：{{ item.useEndTime }})</span></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-form-item>
        <el-form-item label="订单总金额：">
          <el-col :span="12">
            <p>¥{{ formData.orderTotalPrice }}</p>
          </el-col>
        </el-form-item>
        <!--<el-form-item label="卡券优惠：">
          <el-col :span="12">
            <p>¥{{ formData.couponDiscountPrice }}</p>
          </el-col>
        </el-form-item>-->
        <el-form-item label="系统折扣：">
          <el-col :span="12">
            <p>¥{{ formData.systemDiscountPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="会员折扣：">
          <el-col :span="12">
            <p>¥{{ formData.memberDiscountPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="实付金额：">
          <el-col :span="12">
            <p>¥{{ formData.orderPaidPrice }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input type="textarea" v-model="description" :rows="3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="submitOrder" :loading="submitLoading">提交订单</el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <authorize-page :authorizeDialog="authorizeDialog"
                    @authorize="authorize"
                    @cancelAuthorize="cancel"></authorize-page>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import AuthorizePage from '@/components/views/common/authorize'
  export default {
    created () {
      this.getDetail()
    },
    data () {
      return {
        formData: {},
        authorizeDialog: false,
        authorForm: {
          mobile: '',
          password: ''
        },
        moneyCounts: [],
        courseCounts: [],
        checkCC: [],
        checkc: [],
        formInline: {
          money: '',
          course: ''
        },
        isLoading: false,
        discount: '',
        courseOrderInfo: {},
        moneys: [],
        courses: [],
        hasAtuthory: 0,
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        authorizer: '',
        submitLoading: false,
        description: '',
        discountPrice: '',
        radioType: 1
      }
    },
    components: {
      AuthorizePage
    },
    computed: {
      memberDiscount () {
        return (this.formData.memberDiscount * 10).toFixed(2)
      }
    },
    methods: {
      authorize (obj) {
        if (obj) {
          this.authorizer = obj.authorizer
          this.hasAtuthory = obj.hasPermission
          this.authorizeDialog = !this.authorizeDialog
        }
      },
      cancel (c) {
        this.authorizeDialog = c
      },
      getCounts () {
        // 获取各种券的折扣
        let that = this
        axios.get(URL.api_name + 'backofficeapi/coupon-user-rel/app-order/find.do', {
          params: {
            storeId: that.storeId,
            memberId: that.$route.params.memberId,
            // 所购物品类型  票：ticket 、课：course
            itemType: 'course',
            // 订单金额  用于判断满多少，哪些券可以用    ----暂时不确定，临时传1000
            orderAmount: that.formData.courseTotalPrice
          }
        }).then((res) => {
          console.log(that.$route.params.memberId)
          if (res.data.status === 'success') {
            that.moneyCounts = res.data.data.cashCoupons
            that.courseCounts = res.data.data.courseCoupons
          }
        })
      },
      formatCheckbox () {
        for (let i = 0; i < this.checkCC.length; i++) {
          this.checkc.push({
            id: this.checkCC[i]
          })
        }
      },
      getSystemDiscount () {
        let that = this
        let systemD = null
        // 获取系统折扣
        if (that.discount >= 0 && that.discount <= 10) {
          if (this.radioType === 1) {
            systemD = {
              discount: that.discount,
              type: '系统',
              afterMemberDiscount: (that.formData.orderTotalPrice - that.formData.memberDiscountPrice).toFixed(2)
            }
          } else {
            systemD = {
              paid: that.discountPrice,
              type: '系统',
              afterMemberDiscount: (that.formData.orderTotalPrice - that.formData.memberDiscountPrice).toFixed(2)
            }
          }
          // 计算折扣
          that.isLoading = true
          axios.post(URL.api_name + 'backofficeapi/course/buy/discount.do', {
            cashCouponDiscount: {
              id: that.formInline.money
            },
            courseCouponDiscounts: that.checkc,
            courseId: that.$route.params.courseId,
            courseLevel: that.$route.params.courseLevel,
            memberId: that.$route.params.memberId,
            storeId: that.storeId,
            systemDiscount: systemD,
            authorizer: that.authorizer
          }).then((res) => {
            if (res.data.status === 'success') {
              // that.discountObj = res.data.data.discount
              that.isLoading = false
              that.formData.orderPaidPrice = res.data.data.orderPaidPrice
              that.formData.systemDiscountPrice = res.data.data.systemDiscountPrice
              that.formData.couponDiscountPrice = res.data.data.couponDiscountPrice
              that.$message({
                type: 'success',
                message: res.data.message
              })
            } else {
              that.isLoading = false
              that.$errMsg(res.data.message)
            }
          })
        } else {
          that.$message({
            type: 'error',
            message: '输入折扣不正确，请输入0-10以内的数字'
          })
          that.discount = ''
        }
      },
      submitOrder () {
        let that = this
        let systemD = null
        // 计算折扣
        if (this.radioType === 1) {
          systemD = {
            discount: that.discount,
            type: '系统'
          }
        } else {
          systemD = {
            paid: that.discountPrice,
            type: '系统'
          }
        }
        that.submitLoading = true
        axios.post(URL.api_name + 'backofficeapi/course/buy/purchase.do', {
          cashCouponDiscount: {
            id: that.formInline.money
          },
          courseCouponDiscounts: that.checkc,
          saleSource: 'web admin',
          courseId: that.$route.params.courseId,
          courseLevel: that.$route.params.courseLevel,
          memberId: that.$route.params.memberId,
          storeId: that.storeId,
          systemDiscount: systemD,
          authorizer: that.authorizer,
          description: this.description
        }).then((res) => {
          if (res.data.status === 'success') {
            that.courseOrderInfo = res.data.data
            this.$router.push({
              path: '/courseOrderPay/' + that.$route.params.courseId + '/' + that.$route.params.courseLevel + '/' + res.data.data.orderId + '/' + res.data.data.orderPaidPrice + '/' + res.data.data.orderTotalPrice + '/' + that.$route.params.memberId
            })
          } else {
            that.submitLoading = false
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
          that.submitLoading = false
        })
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/course/buy/confirmOrder.do', {
          params: {
            courseId: that.$route.params.courseId,
            courseLevel: that.$route.params.courseLevel,
            memberId: that.$route.params.memberId,
            storeId: that.storeId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
            this.getCounts()
          } else {
            that.$message({
              type: 'error',
              message: '获取数据失败',
              duration: 1000
            })
          }
        }).catch(err => {
          that.$message({
            type: 'error',
            message: '获取数据失败',
            duration: 1000
          })
          console.log(err)
        })
      }
    }
  }
</script>
<style scoped>
  .logo-img{
    max-width: 50%;
    height: auto;
    border: 1px solid #ebebeb;
  }
.stepsss{text-align: center;}
.color_gray{color:#B1B1B1; font-size:12px; margin:0 10px 0 5px;}
  .f-radio{
    position: absolute;
    top: 15%;
    left: 3%;
  }
</style>
