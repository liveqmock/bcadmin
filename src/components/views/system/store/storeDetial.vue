<template>
    <div class="store-list">
        <div class="crumbs">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="el-icon-date"></i>系统管理</el-breadcrumb-item>
              <el-breadcrumb-item>门店管理</el-breadcrumb-item>
              <el-breadcrumb-item>查看</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-data" style="border:solid 1px #e4e4e4; padding:20px;">
          <el-form ref="storeMsgForm" :model="storeMsgForm" label-width="100px" class="demo-ruleForm">

            <el-form-item label="门店名称：" prop="storeName">
              <span style="color: #999;">{{ storeMsgForm.storeName }}</span>
            </el-form-item>
            <el-form-item label="地区：">
              <p>{{ storeMsgForm.address }}</p>
            </el-form-item>
            <el-form-item label="咨询电话：" prop="phone">
              <p>{{ storeMsgForm.phone }}</p>
            </el-form-item>

            <el-form-item label="营业状态：" >
              <el-radio-group v-model="storeMsgForm.businessStatus">
                <el-radio :label="1" :disabled="storeMsgForm.businessStatus !== 1">正常</el-radio>
                <el-radio :label="2" :disabled="storeMsgForm.businessStatus !== 2">停业</el-radio>
                <el-radio :label="3" :disabled="storeMsgForm.businessStatus !== 3">休业整顿</el-radio>
                <el-radio :label="4" :disabled="storeMsgForm.businessStatus !== 4">待开业</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="营业时间：">
              <el-col :span="5">
                <el-select v-model="storeMsgForm.startBusinessTime" disabled placeholder="选择时间">
                  <el-option :label="item.text" v-for='item in startBusinessTimes' :value="item.value" :key="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="5">
                <el-select v-model="storeMsgForm.endBusinessTime" disabled placeholder="选择时间">
                  <el-option :label="item.text" v-for='item in endBusinessTimes' :value="item.value" :key="item.id"></el-option>
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item label="冰场主画面：" >
              <p v-for="item in storeMsgForm.rinkImages">
                <img :src="item.imagesUrl">
              </p>
            </el-form-item>

            <el-form-item label="门店简介：" prop="skatingIntroduce">
              <p v-html="storeMsgForm.skatingIntroduce"></p>
            </el-form-item>

            <el-form-item label="门店介绍：" prop="storeIntroduce">
              <p v-html="storeMsgForm.storeIntroduce"></p>
            </el-form-item>

            <el-form-item>
              <!-- <el-button type="primary" @click="saveStoreMsg('storeMsgForm')" :loading="isSubmit">完成</el-button> -->
              <el-button @click="$router.go('-1')">返回</el-button>
            </el-form-item>
          </el-form>

        </div>
    </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getListData()
    },
    data () {
      return {
        storeMsgForm: {},
        startBusinessTimes: [],
        endBusinessTimes: []
      }
    },
    methods: {
      getListData () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/store/find.do', {
          params: {
            storeId: this.$route.params.did
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.storeMsgForm = res.data.data
            that.startBusinessTimes = res.data.data.intercepTime
            // 营业时间列表
            that.endBusinessTimes = res.data.data.intercepTime
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.line{ text-align:center;}
</style>
