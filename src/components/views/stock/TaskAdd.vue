<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
        <el-breadcrumb-item>新建盘点任务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="150px">
        <!--<el-form-item label="盘点任务编码："></el-form-item>-->
        <el-form-item label="盘点任务名称：">
          <el-col :span="12">
            <el-input></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="盘点分店：">
          {{ storeName }}
        </el-form-item>
        <el-form-item label="盘点仓库：">
          {{ storeName + '仓库' }}
        </el-form-item>
        <el-form-item label="经办人：">
          {{ operator }}
        </el-form-item>
        <el-form-item label="盘点开始时间：">
          <el-date-picker v-model="formData.startTime" type="datetime"></el-date-picker>
          <el-button>选择历史任务时间</el-button>
        </el-form-item>
        <el-form-item label="盘点结束时间：">
          <el-date-picker v-model="formData.endTime" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
          <el-col :span="12">
            <el-input v-model="formData.remarks" type="textarea" :row="3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveData" :loading="loading">
            {{ loading ? '正在保存' : '保存' }}
          </el-button>
          <el-button type="default" @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    name: 'TaskAdd',
    data () {
      return {
        formData: {
          beforeTaskId: '',
          endTime: '',
          remarks: '',
          startTime: '',
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          taskName: '',
          warehouse: ''
        },
        loading: false
      }
    },
    computed: {
      storeName () {
        return JSON.parse(sessionStorage.getItem('store')).v
      },
      operator () {
        return JSON.parse(sessionStorage.getItem('userInfo')).userName
      }
    },
    methods: {
      saveData () {
        this.loading = true
        axios.post(URL.api_name + 'merchandiseapi/task/create.do', {
          formData: this.formData
        }).then(res => {
          if (res.data.status === 'success') {

          } else {
            this.$errMsg(res.data.message)
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      }
    }
  }
</script>
