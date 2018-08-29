<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>banner管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增banner</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="序号" prop="sort">
          <el-col :span="2">
            <el-input v-model.number="formData.sort"></el-input>
          </el-col>
          <el-col :span="12">
            <small class="color-gry">请输入1-9999的数字，数字越大，排序越靠后</small>
          </el-col>
        </el-form-item>
        <el-form-item label="描述">
          <el-col :span="12">
            <el-input :maxlength="300" type="textarea" :rows="4" v-model="formData.content"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="banner图标">
          <el-col :span="12">
            <el-upload
              class="upload-demo"
              :action="imgUploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-error="uporr"
              :data="{folderName: 'banner'}"
              :headers="uploadHeader"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2Mb(推荐尺寸W1125 x H600px)</div>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="外部链接">
          <el-col :span="12">
            <el-input type="text" v-model="formData.url"></el-input>
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
        var checkSort = (rule, value, callback) => {
          if (value) {
            console.log(value)
            if (value > 9999) {
              return callback(new Error('最多输入四位数'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
        return {
          formData: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            content: '',
            id: '',
            pictureUrl: '',
            sort: 99,
            url: ''
          },
          loading: false,
          fileList: [],
          imgUploadUrl: URL.api_name + URL.fileUploadUrl,
          rules: {
            sort: [
              { required: true, validator: checkSort, trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        onSubmit (name) {
          var that = this
          that.$refs[name].validate((valid) => {
            if (valid) {
              if (that.formData.sort < 1) {
                that.$message({
                  type: 'error',
                  message: '序号最小为1，请重新输入',
                  duration: 2000
                })
                that.formData.sort = 99
                return false
              }
              that.loading = true
              axios.post(URL.api_name + 'backofficeapi/information/banner/update.do', that.formData).then(res => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '添加成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/banner'
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
        uporr (err, file, fileList) {
          if (err.status === 'failed') {
            this.$message({
              message: err.message,
              type: 'error'
            })
          } else {
            this.$message({
              message: '上传失败',
              type: 'error'
            })
          }
        },
        beforeUpload (file) {
          // 限定上传图片的格式
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            console.log('格式正确')
          } else {
            this.$message({
              type: 'error',
              message: '不支持的文件格式'
            })
            return false
          }
          if (this.fileList.length > 0) {
            this.$message({
              type: 'error',
              message: '最多上传一张图片',
              duration: 1000
            })
            return false
          }
          // 如果文件大小超过2M，提示用户
          if (file.size > 1024 * 1024 * 2) {
            this.$message({
              type: 'error',
              message: '图片不能大于2M'
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
