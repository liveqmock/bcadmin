<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item><i class="el-icon-date"></i> 购课须知</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="formData" label-width="110px">
      <el-form-item label="须知标题" prop="title">
        <el-col :span="9">
          <el-input v-model="formData.title"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="须知详情" prop='content'>
        <el-col :span="18">
          <quill-editor ref="myTextEditor" v-model="formData.content"></quill-editor>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="addNews('formData')">
          {{ isLoading ? '正在保存' : '完成' }}
        </el-button>
        <el-button @click="$router.go('-1')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  import { quillEditor } from 'vue-quill-editor'
  export default {
    data () {
      return {
        formData: {
          title: '',
          content: ''
        },
        isLoading: false,
        rules: {
          title: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { max: 32, message: '最多输入32个字符', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      addNews (formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 将文本字符串替换掉
            that.formData.graphicDetails = that.formData.graphicDetails.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            // 将门店ID数组转成字符串
            that.formData.organIds = that.formData.organIds.join(',')
            axios.post(URL.api_name + 'backofficeapi/information/headlines/save.do', that.formData).then((res) => {
              that.isLoading = false
              if (res.data.status === 'success') {
                that.$message({
                  message: res.data.message,
                  type: 'success'
                })
                that.$router.push({
                  path: '/information'
                })
              }
            }).catch((error) => {
              that.isLoading = false
              console.log(error)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    components: {
      quillEditor
    }
  }
</script>
