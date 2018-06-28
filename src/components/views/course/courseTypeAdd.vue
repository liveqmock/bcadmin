<template>
  <div class="courseAdd">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程类型</el-breadcrumb-item>
        <el-breadcrumb-item>添加课类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">
        <el-form-item label="课程名称：" prop="name">
          <el-col :span="8">
            <el-input type="text" maxlength="16" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="最高人数：">
          <el-col :span="8">
            <el-input @change="numsChange" v-model.number="formData.maxnum"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="最低人数：">
          <el-col :span="8">
            <el-input :disabled="minNumSet" v-model.number="formData.minnum"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isLoading" @click="add('formData')">
              {{ isLoading ? '正在保存' : '保存' }}
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
  import { quillEditor } from 'vue-quill-editor'
  // import moment from 'moment'
  export default {
    created () {
    },
    data () {
      return {
        formData: {
          maxnum: 1,
          name: '',
          minnum: 1,
          storeId: JSON.parse(sessionStorage.getItem('store')).k
        },
        minNumSet: true,
        fileList: [],
        imgUploadUrl: URL.api_name + 'backofficeapi/coupon/mark/upload.do',
        checked: false,
        isLoading: false,
        rules: {
          name: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      numsChange (val) {
        if (val <= 1) {
          this.formData.minnum = 1
          this.minNumSet = true
        } else if (val <= 2) {
          this.formData.minnum = 2
          this.minNumSet = true
        } else if (val > 2) {
          this.minNumSet = false
          this.formData.minnum = 3
        }
      },
      add (formName) {
        let that = this
        if (that.minNumSet !== true && that.formData.minnum < 3) {
          that.$message({
            message: '团体类型最少3人',
            type: 'error'
          })
          that.formData.minnum = 3
          return false
        }
        that.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post(URL.api_name + 'backofficeapi/course/type/add.do', that.formData).then((res) => {
              that.isLoading = false
              if (res.data.status === 'success') {
                that.$message({
                  message: res.data.message,
                  type: 'success'
                })
                that.$router.push({
                  path: '/courseType'
                })
              }
            }).catch((error) => {
              that.isLoading = false
              console.log(error)
            })
          }
        })
      }
    },
    components: {
      quillEditor
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
<style scoped>
</style>

