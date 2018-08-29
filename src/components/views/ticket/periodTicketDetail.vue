<template>
  <div class="once-ticket">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>时段票</el-breadcrumb-item>
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
        <el-form-item label="时长:">
          <el-col :span="12">
            {{ formData.period }}
          </el-col>
        </el-form-item>
        <el-form-item label="价格:">
          <el-col :span="12">
            {{ formData.price }}
          </el-col>
        </el-form-item>
        <!--<el-form-item label="超时价格:">
          <el-col :span="12">
            {{ formData.exceedPrice }}
          </el-col>
        </el-form-item>-->
        <el-form-item label="有效天数:">
          <el-col :span="12">
            {{ formData.validity }}
          </el-col>
        </el-form-item>
        <el-form-item label="状态:">
          <el-col :span="12">
            {{ formData.status }}
          </el-col>
        </el-form-item>
        <el-form-item label="每天赠送陪同票张数:">
          <el-col :span="12">
            {{ formData.freeCompTicket }} 张
          </el-col>
        </el-form-item>
        <el-form-item label="过期提醒:">
          <el-col :span="12">
            过期前{{ formData.warningDays }}天
          </el-col>
        </el-form-item>
        <el-form-item label="规则:">
          <el-col :span="12">
            {{ formData.description }}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOnceTicket">
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
          loading: false
        }
      },
      methods: {
        addOnceTicket () {
          this.$router.push({
            path: '/periodTicketEdit/' + this.$route.params.pid
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
