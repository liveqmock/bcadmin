<template>
  <div class="once-ticket">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>陪同票</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px">
        <el-form-item label="票名称:">
          <el-col :span="12">
            {{ formData.name }}
          </el-col>
        </el-form-item>
        <el-form-item label="价格:">
          <el-col :span="12">
            {{ formData.price }} ￥
          </el-col>
        </el-form-item>
        <el-form-item label="是否有免费陪同票:">
          <el-col :span="12">
            {{ formData.isFree ? '是' : '否' }}
          </el-col>
        </el-form-item>
        <el-form-item label="规则:">
          <el-col :span="12">
            {{ formData.description }}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="addOnceTicket">
            编辑
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
      created () {
        this.getFormData()
      },
      data () {
        return {
          formData: {},
          loading: false,
          checked: false
        }
      },
      methods: {
        addOnceTicket () {
          this.$router.push({
            path: '/companyTicketEdit/' + this.$route.params.cid
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
