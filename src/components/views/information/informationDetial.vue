<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 内容管理</el-breadcrumb-item>
        <el-breadcrumb-item><i class="el-icon-date"></i> 资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item>资讯详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form label-width="110px">
       <el-form-item label="门店：" prop="organIds">
         <el-row v-for="(s, i) in formData.storeList" :key="i">
           <el-col>
             {{ s.storeName }}
           </el-col>
         </el-row>
      </el-form-item>
      <el-form-item label="资讯标题：" prop="title">
        <el-col :span="9">
          {{ formData.title }}
        </el-col>
      </el-form-item>
      <el-form-item label="资讯简介：" prop="content">
        <el-col :span="9">
          {{ formData.content }}
        </el-col>
      </el-form-item>
      <el-form-item label="资讯图片：" >
        <el-col :span="12">
          <img :src="formData.pictureUrl">
        </el-col>
      </el-form-item>
      <el-form-item label="资讯详情：" prop='graphicDetails'>
        <el-col :span="18">
          <p v-html="formData.graphicDetails"></p>
	      </el-col>
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.go('-1')">返回</el-button>
      </el-form-item>
    </el-form>
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
      isLoading: false,
      formData: {}
    }
  },
  methods: {
    getListData () {
      var that = this
      axios.get(URL.api_name + 'backofficeapi/information/headlines/detail.do', {
        params: {
          id: that.$route.params.id
        }
      }).then(function (res) {
        if (res.data.status === 'success') {
          that.formData = res.data.data
        }
      })
    }
  },
  computed: {
    uploadHeader () {
      return {
        authtoken: JSON.parse(sessionStorage.getItem('userInfo')).sessionId
      }
    }
  }
}
</script>
