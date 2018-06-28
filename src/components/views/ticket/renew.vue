<template>
  <div class="renew">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 票务管理</el-breadcrumb-item>
        <el-breadcrumb-item>延时续场费</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-wrapper">
      <el-button type="info" @click="timeoutDialog = true">设置超时价格</el-button>
    </div>
    <!-- 超时价格 -->
    <el-dialog title="请输入超时价格" :visible.sync="timeoutDialog">
      <el-form label-width="100px">
        <el-form-item label="价格(半小时)：">
          <el-col :span="12">
            <el-input v-model.number="price" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="timeoutDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm_1">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
      this.getInitPrice()
    },
    data () {
      return {
        timeoutDialog: false,
        price: ''
      }
    },
    methods: {
      getInitPrice () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/delayed/search.do', {
          params: {
            id: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.price = res.data.data.delayedPrice
          }
        })
      },
      confirm_1 () {
        let that = this
        axios.post(URL.api_name + 'backofficeapi/delayed/create.do', {
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          delayedPrice: this.price
        }).then(res => {
          that.timeoutDialog = false
          if (res.data.status === 'success') {
            this.$message({
              type: 'success',
              message: '设置成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '设置失败'
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .search-wrapper{
    padding-bottom: 10px;
  }
</style>
