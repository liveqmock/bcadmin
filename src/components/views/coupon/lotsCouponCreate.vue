<template>
  <div class="create=coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量制卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="选择卡券:" prop='couponId' required>
          <el-col :span="12">
            <el-select v-model="formData.couponId" @change="getSelectCoupon">
              <el-option v-for="(item, index) in coupons" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="卡券数量:" prop='count' required>
          <el-col :span="4">
            <el-input v-model.number="formData.count"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间" prop="useBeginTime">
          <el-date-picker type="datetime" @change="getBegin" v-model="formData.useBeginTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="useEndTime">
          <el-date-picker type="datetime" @change="getEnd" v-model="formData.useEndTime"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="couponCreate('formData')">{{ loading ? '正在提交' : '保存' }}</el-button>
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
        this.getCoupons()
      },
      data () {
        var checkNumber = (rule, value, callback) => {
          let nums = /^[1-9]\d*|0$/
          if (!value) {
            return callback(new Error('不能为空且只能输入大于0的数字'))
          } else if (!nums.test(value)) {
            return callback(new Error('格式不正确'))
          } else {
            callback()
          }
        }
        var checkId = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('卡券不能为空'))
          } else {
            callback()
          }
        }
        return {
          formData: {
            count: '',
            couponId: '',
            category: '',
            couponName: '',
            useBeginTime: '',
            useEndTime: '',
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          },
          coupons: [],
          rules: {
            couponId: [
              { validator: checkId, trigger: 'change' }
            ],
            count: [
              { validator: checkNumber }
            ],
            useEndTime: [
              { required: true, message: '结束时间不能为空', trigger: 'blur' }
            ],
            useBeginTime: [
              { required: true, message: '开始时间不能为空', trigger: 'blur' }
            ]
          },
          loading: false
        }
      },
      methods: {
        getBegin (val) {
          this.formData.useBeginTime = val
        },
        getEnd (val) {
          this.formData.useEndTime = val
        },
        getCoupons () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/coupon/mark/batch-search-list.do', {
            params: {
              storeId: that.formData.storeId
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.coupons = res.data.data
            }
          })
        },
        couponCreate (formName) {
          var that = this
          that.loading = true
          this.$refs[formName].validate((valid) => {
            if (valid) {
              axios.post(URL.api_name + 'backofficeapi/coupon-user-rel/batch/create.do', that.formData).then((res) => {
                that.loading = false
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: res.data.message
                  })
                  that.$router.push({
                    path: '/lotsCoupon'
                  })
                } else {
                  that.$message({
                    type: 'error',
                    message: res.data.message,
                    duration: 1000
                  })
                }
              }).catch((err) => {
                console.log(err)
                that.loading = false
                that.$message({
                  type: 'error',
                  message: '提交失败'
                })
              })
            } else {
              that.loading = false
              console.log('error submit!!')
              return false
            }
          })
        },
        getSelectCoupon (id) {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/coupon/mark/details.do', {
            params: {
              id: this.formData.couponId
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.formData.category = res.data.data.category
              that.formData.couponName = res.data.data.name
              that.formData.useBeginTime = res.data.data.usedBeginTime
              that.formData.useEndTime = res.data.data.usedEndTime
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
<style lang="less">

</style>
