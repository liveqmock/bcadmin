<template>
  <div class="point-config">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>积分配置规则</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form :model="formData" :rules="rules" ref="formData">
        <el-form-item label="是否兑换积分：">
          <el-col :span="3">
            <el-radio-group v-model="formData.isExchangePoint">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-col>
          <el-col style="width: 100px;">
            兑换比例：消费
          </el-col>
          <el-col :span="2">
            <el-form-item prop="consumeMoney" required>
              <el-input type="text" :disabled="formData.isExchangePoint === 0" v-model="formData.consumeMoney"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 70px;text-align: center">
            元 = 积分
          </el-col>
          <el-col :span="2">
            <el-form-item prop="exchangePoint" required>
              <el-input type="text" :disabled="formData.isExchangePoint === 0" v-model="formData.exchangePoint"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">分</el-col>
        </el-form-item>
        <el-form-item label="是否抵扣积分：">
          <el-col :span="3">
            <el-radio-group v-model="formData.isDeductiblePoint">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-col>
          <el-col style="width: 130px;">
            积分抵扣比例：消费
          </el-col>
          <el-col :span="2">
            <el-form-item prop="deductibleMoney" required>
              <el-input type="text" v-model="formData.deductibleMoney"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 70px;text-align: center">
            积分 =
          </el-col>
          <el-col :span="2">
            <el-form-item prop="consumePoint" required>
              <el-input type="text" v-model="formData.consumePoint"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">元</el-col>
        </el-form-item>
        <el-form-item label="每日签到积分配置：">
          <el-col :span="3">
            <el-form-item prop="signPoint" required>
              <el-input type="number" v-model.number="formData.signPoint"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;积分</el-col>
        </el-form-item>
        <el-form-item label="教练评价学员赠送小红花积分比例：">
          <el-col style="width:80px;">
            1朵小红花=
          </el-col>
          <el-col :span="3">
            <el-form-item prop="evaluatePoint" required>
              <el-input type="text" v-model="formData.evaluatePoint"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;积分</el-col>
        </el-form-item>
        <el-form-item label="积分规则">
          <el-col :span="12">
            <el-input type="textarea" v-model="formData.content" :rows="4"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary" @click="updateConfig('formData')" :loading="isLoading">
            {{ isLoading ? '正在保存' : '保存' }}
          </el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
      this.getConfig()
    },
    data () {
      var checkNumber = (rule, value, callback) => {
        let nums = /^[1-9]\d*(?!.*\.)/
        if (!nums.test(value)) {
          return callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          signPoint: [
            { validator: checkNumber }
          ],
          consumeMoney: [
            { validator: checkNumber }
          ],
          deductibleMoney: [
            { validator: checkNumber }
          ],
          consumePoint: [
            { validator: checkNumber }
          ],
          exchangePoint: [
            { validator: checkNumber }
          ],
          evaluatePoint: [
            { validator: checkNumber }
          ]
        },
        formData: {
          consumeMoney: '',
          isExchangePoint: false,
          exchangePoint: '',
          isDeductiblePoint: false,
          signPoint: '',
          evaluatePoint: '',
          content: '',
          deductibleMoney: '',
          consumePoint: ''
        },
        isLoading: false
      }
    },
    methods: {
      getConfig () {
        var that = this
        axios.get(URL.api_name + 'memberapi/member/point/detail.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((response) => {
          if (response.data.status === 'success') {
            if (response.data.data) {
              that.formData = response.data.data
            }
          }
        }, (error) => {
          console.log(error)
        })
      },
      updateConfig (formName) {
        var that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.isLoading = true
            axios.post(URL.api_name + 'memberapi/member/point/update.do', that.formData).then((response) => {
              that.isLoading = false
              if (response.data.status === 'success') {
                that.$message({
                  message: response.data.message,
                  type: 'success'
                })
              } else {
                that.$message({
                  message: response.data.message,
                  type: 'error'
                })
              }
            }).catch((error) => {
              that.isLoading = false
              console.log(error)
              that.$message({
                message: '修改失败',
                type: 'error'
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .form-data{
    padding-left: 10px;
  }
</style>
