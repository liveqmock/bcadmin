<template>
  <div class="once-ticket">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>陪同票</el-breadcrumb-item>
        <el-breadcrumb-item>新增陪同票</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px">
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
        <el-form-item label="最高可送:">
          <el-col :span="4">
            <el-input v-model="formData.freeCompTicket"></el-input>张
          </el-col>
        </el-form-item>
        <el-form-item label="规则:">
          <el-col :span="12">
            <el-input v-model="formData.description" type="textarea" :rows="3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="addOnceTicket">
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
            price: '',
            description: '',
            isFree: 0,
            status: '有效',
            freeCompTicket: '',
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          },
          loading: false,
          checked: false
        }
      },
      methods: {
        addOnceTicket () {
          var that = this
          if (that.checked) {
            that.formData.isFree = 1
          } else {
            that.formData.isFree = 0
          }
          that.loading = true
          axios.post(URL.api_name + 'backofficeapi/ticket/define/company.do', that.formData).then((res) => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '创建成功',
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
                message: res.data.message
              })
            }
          }).catch((err) => {
            console.log(err)
            that.loading = false
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
