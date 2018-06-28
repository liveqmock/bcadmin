<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>banner管理</el-breadcrumb-item>
        <el-breadcrumb-item>banner详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="80px">
        <el-form-item label="序号">
          <el-col :span="12">
            {{ formData.sort }}
          </el-col>
        </el-form-item>
        <el-form-item label="描述">
          <el-col :span="12">
            {{ formData.content }}
          </el-col>
        </el-form-item>
        <el-form-item label="卡券图标">
          <el-col :span="12">
            <img class="logo" :src="formData.pictureUrl">
          </el-col>
        </el-form-item>
        <el-form-item label="外部链接">
          <el-col :span="12">
            {{ formData.url }}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goEdit">
            编辑
          </el-button>
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
        getDetail () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/information/banner/detail.do', {
            params: {
              storeId: JSON.parse(sessionStorage.getItem('store')).k,
              id: this.$route.params.bid
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
            }
          })
        },
        goEdit () {
          this.$router.push({
            path: '/bannerEdit/' + this.$route.params.bid
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .price{
    text-align: center;
  }
  .logo{
    width: 100px;
    height: 100px;
  }
</style>
