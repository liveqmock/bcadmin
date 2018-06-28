<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 请假管理</el-breadcrumb-item>
        <el-breadcrumb-item>请假列表</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item label="请假人:">
          <el-col :span="12">
            {{ formData.employeeName }}
          </el-col>
        </el-form-item>
        <el-form-item label="请假类型:">
          <el-col :span="12">
            {{ formData.leaveType }}
          </el-col>
        </el-form-item>
        <el-form-item label="请假时间:">
          <el-col :span="12">
            {{ formData.leaveStarttime }} 至 {{ formData.leaveEndtime }}
          </el-col>
        </el-form-item>
        <el-form-item label="请假时长:">
          <el-col :span="12">
            {{ totalDays }}小时
          </el-col>
        </el-form-item>
        <el-form-item label="提交时间:">
          <el-col :span="12">
            {{ formData.createdTime }}
          </el-col>
        </el-form-item>
        <el-form-item label="备注:">
          <el-col :span="12">
            {{ formData.remarks }}
          </el-col>
        </el-form-item>
        <el-form-item label="审批意见:">
          <el-col :span="12">
            {{ formData.approveRemark }}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    import moment from 'moment'
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    export default {
      created () {
        this.getLeaveDetail()
      },
      data () {
        return {
          formData: {},
          approveRemark: '',
          loading: false
        }
      },
      methods: {
        onSubmit (status) {
          var that = this
          that.loading = true
          axios.post(URL.api_name + 'backofficeapi/leave/audit.do', {
            approveRemark: that.approveRemark,
            id: that.formData.id,
            leaveStatus: status
          }).then(res => {
            that.loading = false
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '操作成功',
                duration: 1000,
                onClose: function () {
                  that.$router.push({
                    path: '/leaveList'
                  })
                }
              })
            } else {
              that.$message({
                type: 'success',
                message: res.data.message,
                duration: 1000
              })
            }
          }).catch(err => {
            that.$message({
              type: 'error',
              message: '添加失败',
              duration: 1000
            })
            console.log(err)
          })
        },
        getLeaveDetail () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/leave/find.do', {
            params: {
              id: that.$route.params.lid
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
            } else {
              that.$message({
                type: 'error',
                message: res.data.message,
                duration: 1000
              })
            }
          }).catch((err) => {
            console.log(err)
            that.$message({
              type: 'error',
              message: '获取数据失败',
              duration: 1000
            })
          })
        }
      },
      computed: {
        totalDays () {
          let minutes = moment(this.formData.leaveEndtime).diff(moment(this.formData.leaveStarttime), 'minutes')
          return minutes / 60
        }
      }
    }
</script>
<style lang="less" scoped>
  .price{
    text-align: center;
  }
</style>
