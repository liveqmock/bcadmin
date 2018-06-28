<template>
  <div class="coupon-detail">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>卡券详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="80px">
        <el-form-item label="卡券类型:">
          <el-col :span="12">
            <p>{{ formData.category | formatType }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="卡券名称:">
          <el-col :span="12">
            <p>{{ formData.name }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="卡券金额:" v-show="formData.category === 'coupon_cash'">
          <el-col :span="12">
            <p>¥{{ formData.amount }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="卡券描述:">
          <el-col :span="12">
            <p class="text">{{ formData.instructions }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="卡券图标:">
          <el-col :span="12">
            <img :src="formData.logo" class="logo-img">
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间:">
          <el-col :span="12">
            <p>{{ formData.usedBeginTime }}</p>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-col :span="12">
            <p>{{ formData.usedEndTime }}</p>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goEdit">编辑</el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
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
      this.getDetail()
    },
    data () {
      return {
        formData: {}
      }
    },
    methods: {
      goEdit () {
        this.$router.push({
          path: '/couponEdit/' + this.$route.params.couponId
        })
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/coupon/mark/details.do', {
          params: {
            id: that.$route.params.couponId
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          } else {
            that.$message({
              type: 'error',
              message: '获取数据失败',
              duration: 1000
            })
          }
        }).catch(err => {
          that.$message({
            type: 'error',
            message: '获取数据失败',
            duration: 1000
          })
          console.log(err)
        })
      }
    }
  }
</script>
<style scoped>
  .logo-img{
    width: 80px;
    height: 80px;
    border: 1px solid #ebebeb;
    border-radius: 50%;
  }
  .text{
    word-wrap: break-word;
  }
</style>
