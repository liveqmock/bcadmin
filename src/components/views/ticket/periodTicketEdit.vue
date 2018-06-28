<template>
  <div class="once-ticket">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>时段票</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" ref="formData" :rules="rules">
        <el-form-item label="票名称:" prop="name">
          <el-col :span="12">
            <el-input type="text" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="时长:" prop="period">
          <el-col :span="12">
            <el-input v-model.number="formData.period"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="价格:" prop="price">
          <el-col :span="12">
            <el-input v-model.number="formData.price"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="有效天数:" prop="validity">
          <el-col :span="12">
            <el-input v-model.number="formData.validity"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态:">
          <el-radio-group v-model="formData.status">
            <el-radio label="有效">有效</el-radio>
            <el-radio label="无效">无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每天赠送陪同票张数：" prop="freeCompTicket">
          <el-col :span="4">
            <el-input v-model.number="formData.freeCompTicket"></el-input>
          </el-col>
          <el-col :span="2" style="margin-left: 8px;">张</el-col>
        </el-form-item>
        <el-form-item label="规则:" prop="description">
          <el-col :span="12">
            <el-input v-model="formData.description" type="textarea" :rows="6"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="addOnceTicket('formData')">
            {{ loading ? '正在保存' : '保存' }}
          </el-button>
          <el-button @click="$router.go('-1')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    import Validate from '@/common/js/validate'
    export default {
      created () {
        this.getFormData()
      },
      data () {
        var checkPrice = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('价格不能为空'))
          } else if (value <= 0) {
            return callback(new Error('价格必须大于0'))
          } else {
            callback()
          }
        }
        var checkPeriod = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('时长不能为空'))
          } else if (value <= 0) {
            return callback(new Error('价格必须大于0'))
          } else if ((value + '').indexOf('.') > -1) {
            return callback(new Error('时长不能为小数'))
          } else {
            callback()
          }
        }
        var checkDay = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('有效天数不能为空'))
          } else if (value <= 0) {
            return callback(new Error('有效天数必须大于0'))
          } else if ((value + '').indexOf('.') > -1) {
            return callback(new Error('有效天数不能为小数'))
          } else {
            callback()
          }
        }
        return {
          formData: {},
          loading: false,
          rules: {
            name: [
              { required: true, message: '请输入票名称', trigger: 'blur' }
            ],
            price: [
              { required: true, validator: checkPrice, trigger: 'blur' }
            ],
            period: [
              { required: true, validator: checkPeriod, trigger: 'blur' }
            ],
            validity: [
              { required: true, validator: checkDay, trigger: 'blur' }
            ],
            description: [
              { max: 500, message: '最多输入500个字符', trigger: 'blur' }
            ],
            freeCompTicket: [
              { validator: Validate.checkInputNumR, trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        addOnceTicket (formData) {
          var that = this
          this.$refs[formData].validate((valid) => {
            if (valid) {
              that.loading = true
              axios.post(URL.api_name + '/backofficeapi/ticket/update/period.do', that.formData).then((res) => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '修改成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/periodTicketList'
                      })
                    }
                  })
                } else {
                  that.loading = false
                  that.$message({
                    type: 'error',
                    message: res.data.message,
                    duration: 1000
                  })
                }
              }).catch((err) => {
                console.log(err)
                that.loading = false
              })
            }
          })
        },
        getFormData () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/ticket/find/period.do', {
            params: {
              id: that.$route.params.pid
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
            }
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .inline-input{
    width: 120px;
  }
  .el-radio{
    padding-bottom: 5px;
  }
  .el-radio+.el-radio{
    margin-left: 0;
  }
</style>
