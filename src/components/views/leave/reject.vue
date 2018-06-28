<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 请假管理</el-breadcrumb-item>
        <el-breadcrumb-item>请假列表</el-breadcrumb-item>
        <el-breadcrumb-item>驳回</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item label="请假人:">
          <el-col :span="12">
          </el-col>
        </el-form-item>
        <el-form-item label="请假类型:">
          <el-col :span="12">
          </el-col>
        </el-form-item>
        <el-form-item label="请假时间:">
          <el-col :span="12">
          </el-col>
        </el-form-item>
        <el-form-item label="合计天数:">
          <el-col :span="12">
          </el-col>
        </el-form-item>
        <el-form-item label="提交时间:">
          <el-col :span="12">
          </el-col>
        </el-form-item>
        <el-form-item label="备注">
          <el-col :span="12">
          </el-col>
        </el-form-item>
        <el-form-item label="意见">
          <el-col :span="12">
            <el-input type="textarea" :rows="4" v-model="formData.remarks"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="loading">
            {{ loading ? '正在提交' : '确定' }}
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
          formData: {},
          loading: false
        }
      },
      methods: {
        onSubmit () {
          var that = this
          that.loading = true
          axios.post(URL.api_name + 'memberapi/information/banner/update.do', that.formData).then(res => {
            that.loading = false
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '添加成功',
                duration: 1000,
                onClose: function () {
                  that.$router.push({
                    path: '/banner'
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
        }
      }
    }
</script>
<style lang="less" scoped>
  .price{
    text-align: center;
  }
</style>
