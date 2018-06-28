<template>
  <div class="once-ticket">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>单次票</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item label="票名称:">
          <el-col :span="12">
            {{ formData.name }}
          </el-col>
        </el-form-item>
        <el-form-item label="是否常规票:">
          <el-col :span="12">
            {{ formData.isDefault ? '是' : '否' }}
          </el-col>
        </el-form-item>
        <el-form-item label="类型:">
          {{ formData.dayType }}
        </el-form-item>
        <el-form-item label="时长:">
          {{ formData.hours }}
        </el-form-item>
        <el-form-item label="价格:">
          {{ formData.price }}
        </el-form-item>
        <el-form-item label="状态:">
          {{ formData.status }}
        </el-form-item>
        <el-form-item label="规则:">
          <el-col :span="12">
            {{ formData.description }}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goEdit">
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
        this.getTicketInfo()
      },
      data () {
        return {
          formData: {}
        }
      },
      methods: {
        getTicketInfo () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/ticket/find/once.do', {
            params: {
              id: this.$route.params.oid,
              storeId: '1'
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
            }
          })
        },
        goEdit () {
          this.$router.push({
            path: '/onceTicketEdit/' + this.$route.params.oid
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
