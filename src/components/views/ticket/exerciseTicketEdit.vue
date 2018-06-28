<template>
  <div class="once-ticket">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>练习票</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="票名称:" prop="name">
          <el-col :span="12">
            <el-input type="text" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="赠送陪同票张数:" prop="freeCompTicket">
          <el-col :span="4">
            <el-input v-model.number="formData.freeCompTicket"></el-input>
          </el-col>
          <el-col :span="2" style="margin-left: 8px">张</el-col>
        </el-form-item>
        <el-form-item label="规则:">
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
        return {
          formData: {},
          loading: false,
          checked: false,
          rules: {
            name: [
              { required: true, message: '票名称不能为空', trigger: 'blur' }
            ],
            freeCompTicket: [
              { validator: Validate.checkInputNumR, trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        addOnceTicket (name) {
          var that = this
          this.$refs[name].validate((valid) => {
            if (valid) {
              if (that.checked) {
                that.formData.isFree = 0
              } else {
                that.formData.isFree = 1
              }
              that.loading = true
              axios.post(URL.api_name + 'backofficeapi/ticket/update/exercise.do', that.formData).then((res) => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '修改成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/exerciseTicketList'
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
          axios.get(URL.api_name + 'backofficeapi/ticket/find/exercise.do', {
            params: {
              id: that.$route.params.eid
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
