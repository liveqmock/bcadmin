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
            <el-input v-model="formData.taskName"></el-input>
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
          <el-date-picker v-model="formData.startTime" type="datetime" @change="startTime"></el-date-picker>
          <el-button @click="showDialog = true">选择历史任务时间</el-button>
        </el-form-item>
        <el-form-item label="盘点结束时间：">
          <el-date-picker v-model="formData.endTime" type="datetime" @change="endTime"></el-date-picker>
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
    <el-dialog title="选择开始时间"
               :close-on-click-modal="false"
               :show-close="false"
               :visible.sync="showDialog">
      <el-row type="flex" :gutter="10" justify="center">
        <el-col :span="4">
          历史任务名称
        </el-col>
        <el-col :span="8">
          已盘时间范围
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="10" justify="center">
        <el-col :span="4"></el-col>
        <el-col :span="8"></el-col>
      </el-row>

    </el-dialog>
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
          warehouse: this.operator
        },
        loading: false,
        showDialog: false
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
      startTime (val) {
        this.formData.startTime = val
      },
      endTime (val) {
        this.formData.endTime = val
      },
      saveData () {
        this.loading = true
        this.formData.warehouse = this.operator
        axios.post(URL.api_name + 'merchandiseapi/task/create.do', this.formData).then(res => {
          if (res.data.status === 'success') {
            this.$router.push({
              path: '/inventory'
            })
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
