<template>
  <div class="course-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>体验课购买</el-breadcrumb-item>
        <el-breadcrumb-item>选择教练</el-breadcrumb-item>
        <el-breadcrumb-item>订单确认</el-breadcrumb-item>
      </el-breadcrumb>
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
            <p>{{ $route.query.coachGrade | formatCourseLevel }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="每节时长：">
          <el-col :span="12">
            <p>{{ formData.coursePeriod }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="课程总价：">
          <el-col :span="12">
            <p>￥{{ $route.query.price }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="系统折扣：">
          <el-col :span="4">
            <el-input v-model.number="discount" :disabled="hasAtuthory === 0" @keyup.enter.native="getDiscount"></el-input>
          </el-col>
          <el-button @click="authorizeDialog = true" :loading="isLoading">{{ isLoading ? '授权操作中...' : '授权' }}</el-button>
          <small v-show="hasAtuthory === 1">输入完折扣按回车键</small>
        </el-form-item>
        <el-form-item label="现金券：" v-if="$route.query.memberId !== ''">
          <el-col :span="12">
            <el-select v-model="cashCoupon" @change="getDiscount">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in moneyCounts"
                         :label="item.couponName"
                         :value="item.id">
                <span>{{item.couponName}}</span>
                <span class="color_gray">(有效期至：{{ item.useEndTime }})</span>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="课程券：" v-if="$route.query.memberId !== ''">
          <el-col :span="12">
            <el-select v-model="courseCoupon" @change="getDiscount">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in courseCounts" :label="item.couponName"
                         :value="item.id"
                         :key="item.id">{{ item.couponName }}
                <span>{{item.couponName}}</span>
                <span class="color_gray">(有效期至：{{ item.useEndTime }})</span>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="订单总金额：">
          <el-col :span="12">
            <p>¥{{ $route.query.price }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="系统折扣：">
          <el-col :span="12">
            <p>¥{{discountObj.systemDiscountPrice}}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="实付金额：">
          <el-col :span="12">
            <p>¥{{ orderPaid }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input type="textarea" v-model="description" :rows="3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="createOrder" :loading="submitLoading">提交订单</el-button>
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
      this.getCourseDetail()
      if (this.$route.query.memberId) {
        this.getCounts()
      }
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
        isLoading: false,
        discount: '',
        moneys: [],
        courses: [],
        hasAtuthory: 0,
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        authorizer: '',
        submitLoading: false,
        description: '',
        cashCoupon: '',
        courseCoupon: '',
        discountObj: {}
      }
    },
    components: {
      AuthorizePage
    },
    computed: {
      orderPaid () {
        if (this.discountObj.orderTotalPrice !== null && this.discountObj.orderTotalPrice !== undefined) {
          return this.discountObj.orderTotalPrice
        }
        return this.$route.query.price
      }
    },
    methods: {
      getDiscount () {
        axios.post(URL.api_name + 'backofficeapi/course/experience/discount.do', {
          authorizer: this.authorizer,
          cashCouponDiscount: {
            id: this.cashCoupon
          },
          coachId: this.$route.query.coachId,
          courseCouponDiscount: {
            id: this.courseCoupon
          },
          day: this.$route.query.day,
          memberId: this.$route.query.memberId,
          price: this.$route.query.price,
          saleSource: 'Admin',
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          systemDiscount: {
            type: '系统',
            discount: this.discount
          },
          timeOfDay: this.$route.query.timeOfDay
        }).then(res => {
          if (res.data.status === 'success') {
            this.discountObj = res.data.data
            if (this.discountObj.isWarning) {
              this.$errMsg(this.discountObj.isWarning)
            }
          } else {
            this.$errMsg(res.data.message)
          }
        })
      },
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
      getCourseDetail () {
        axios.get(URL.api_name + 'backofficeapi/course/experience/details.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          this.formData = res.data.data
        })
      },
      getCounts () {
        // 获取各种券的折扣
        axios.get(URL.api_name + 'backofficeapi/coupon-user-rel/app-order/find.do', {
          params: {
            storeId: this.storeId,
            memberId: this.$route.query.memberId,
            // 所购物品类型  票：ticket 、课：course
            itemType: 'course',
            // 订单金额  用于判断满多少，哪些券可以用    ----暂时不确定，临时传1000
            orderAmount: this.$route.query.price
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            this.moneyCounts = res.data.data.cashCoupons
            this.courseCounts = res.data.data.courseCoupons
          }
        })
      },
      createOrder () {
        this.submitLoading = true
        axios.post(URL.api_name + 'backofficeapi/course/experience/buy.do', {
          authorizer: this.authorizer,
          cashCouponDiscount: {
            id: this.cashCoupon
          },
          coachId: this.$route.query.coachId,
          courseCouponDiscount: {
            id: this.courseCoupon
          },
          day: this.$route.query.day,
          memberId: this.$route.query.memberId,
          price: this.$route.query.price,
          saleSource: 'Admin',
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          systemDiscount: {
            type: '系统',
            discount: this.discount
          },
          timeOfDay: this.$route.query.timeOfDay,
          description: this.description
        }).then(res => {
          if (res.data.status === 'success') {
            let obj = res.data.data
            this.$router.push({
              path: '/tasteCoursePay/' + obj.coachId + '/' + obj.courseId + '/' + obj.day + '/' + obj.memberId + '/' + obj.orderId + '/' + obj.price + '/' + obj.timeOfDay
            })
          } else {
            this.submitLoading = false
            this.$errMsg(res.data.message)
          }
        }).catch(err => {
          console.error(err)
          this.submitLoading = false
        })
      }
    }
  }
</script>
<style scoped>
  .color_gray{color:#B1B1B1; font-size:12px; margin:0 10px 0 5px;}
</style>
