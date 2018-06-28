<template>
  <div class="once-ticket">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>陪同票</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px" :model="formData" ref="formData" :rules="rules">
        <el-form-item label="票名称:">
          <el-col :span="12">
            <el-input type="text" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="价格:">
          <el-col :span="12">
            <el-input v-model.number="formData.price"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否有免费陪同票:">
          <el-col :span="12">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="最高可送:" prop="freeCompTicket">
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
          <el-button type="primary" :loading="loading" @click="submit('formData')">
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
            freeCompTicket: [
              { validator: Validate.checkInputNumR, trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        submit (name) {
          this.$refs[name].validate(valid => {
            if (valid) {
              this.addOnceTicket()
            }
          })
        },
        addOnceTicket () {
          var that = this
          if (that.checked) {
            that.formData.isFree = 1
          } else {
            that.formData.isFree = 0
          }
          that.loading = true
          axios.post(URL.api_name + 'backofficeapi/ticket/update/company.do', that.formData).then((res) => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '保存成功',
                duration: 1000,
                onClose: function () {
                  that.$router.push({
                    path: '/companyTicketList'
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
        },
        getFormData () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/ticket/find/company.do', {
            params: {
              id: that.$route.params.cid
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
              that.checked = res.data.data.isFree
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
