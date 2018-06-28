<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 版本管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增版本</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="端口:" prop="versionType">
          <el-col :span="6">
            <el-select v-model="formData.versionType">
              <el-option label="android" value="android"></el-option>
              <el-option label="ios" value="ios"></el-option>
              <el-option label="ipad" value="ipad"></el-option>
              <el-option label="android_Staff" value="android_Staff"></el-option>
              <el-option label="iOS_Staff" value="iOS_Staff"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="版本号:" prop="versionNo">
          <el-col :span="12">
            <el-input type="text" v-model="formData.versionNo"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="版本链接:" prop="versionUrl">
          <el-col :span="12">
            <el-input :rows="4" type="textarea" v-model="formData.versionUrl"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否强制更新:" prop="isUpdate">
          <el-col :span="12">
            <el-radio-group v-model="formData.isUpdate">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('formData')" :loading="loading">
            {{ loading ? '正在保存' : '保存' }}
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
      data () {
        return {
          formData: {
            versionType: '',
            versionNo: '',
            versionUrl: '',
            isUpdate: 0
          },
          loading: false,
          fileList: [],
          imgUploadUrl: URL.api_name + 'backofficeapi/information/banner/upload.do',
          rules: {
            versionType: [
              { required: true, message: '端口不能为空', trigger: 'change' }
            ],
            versionNo: [
              { required: true, message: '版本号不能为空', trigger: 'blur' },
              { max: 8, message: '长度不能超过8个字符', trigger: 'blur' }
            ],
            versionUrl: [
              { required: true, message: '版本链接不能为空', trigger: 'blur' },
              { max: 300, message: '长度不能超过300个字符', trigger: 'blur' }
            ],
            isUpdate: [
              {required: true, message: '是否强制更新字段不能为空'}
            ]
          }
        }
      },
      methods: {
        onSubmit (name) {
          var that = this
          that.$refs[name].validate((valid) => {
            if (valid) {
              that.loading = true
              axios.post(URL.api_name + 'memberapi/version/create.do', that.formData).then(res => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '添加成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/version'
                      })
                    }
                  })
                } else {
                  that.loading = false
                  that.$message({
                    type: 'error',
                    message: res.data.message,
                    duration: 1000
                  })
                }
              }).catch(err => {
                that.loading = false
                that.$message({
                  type: 'error',
                  message: '添加失败',
                  duration: 1000
                })
                console.log(err)
              })
            }
          })
        },
        handleRemove (file, fileList) {
          this.fileList = fileList
        },
        handlePreview (file) {
        },
        handleSuccess (response, file, fileList) {
          this.fileList = fileList
          if (response.status === 'success') {
            this.formData.pictureUrl = response.data.pictureUrl
            this.formData.pictureName = response.data.pictureName
          } else {
            this.fileList = []
          }
        },
        beforeUpload (file) {
          if (this.fileList.length > 0) {
            this.$message({
              type: 'error',
              message: '最多上传一张图片',
              duration: 1000
            })
            return false
          }
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
<style lang="less" scoped>
  .price{
    text-align: center;
  }
  .color-gry{ color:#999; font-size:12px; margin-left:10px;}
</style>
