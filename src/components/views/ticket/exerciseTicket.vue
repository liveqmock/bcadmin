<template>
  <div class="once-ticket">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>制票</el-breadcrumb-item>
        <el-breadcrumb-item>练习票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="票名称:" prop="name">
          <el-col :span="12">
            <el-input type="text" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="规则:">
          <el-col :span="12">
            <el-input v-model="formData.description" type="textarea" :rows="3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="addOnceTicket('formData')">
            {{ loading ? '正在添加' : '添加' }}
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
    export default {
      data () {
        return {
          formData: {
            name: '',
            description: '',
            status: '有效',
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          },
          loading: false,
          checked: false,
          rules: {
            name: [
              { required: true, message: '票名称不能为空', trigger: 'blur' }
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
              axios.post(URL.api_name + 'backofficeapi/ticket/define/exercise.do', that.formData).then((res) => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '创建成功',
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
                    message: res.data.message
                  })
                }
              }).catch((err) => {
                console.log(err)
                that.loading = false
              })
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
