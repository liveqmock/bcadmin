<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 消息管理</el-breadcrumb-item>
        <el-breadcrumb-item><i class="el-icon-date"></i> 消息列表</el-breadcrumb-item>
        <el-breadcrumb-item>添加消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="formData" label-width="110px">
      <el-form-item label="消息标题" prop="newsTitle">
        <el-col :span="9">
          <el-input type="text" :maxlength="50" v-model="formData.newsTitle"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="消息副标题" prop="newsSubtitle">
        <el-col :span="9">
          <el-input type="text" :maxlength="50" v-model="formData.newsSubtitle"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="消息图片" >
        <el-col :span="12">
          <el-upload
              class="upload-demo"
              :action="imgUploadUrl"
              :file-list="rinkImages"
              :before-upload="beforeUpload"
              :on-success="upImgSuccess"
              :on-remove="upImgremove"
              :on-error="uporr"
              :headers="uploadHeader"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2M</div>
            </el-upload>
          </el-col>
      </el-form-item>
      <el-form-item label="消息详情" prop='newsDetail'>
        <el-col :span="18">
	        <quill-editor ref="myTextEditor" v-model="formData.newsDetail"></quill-editor>
	      </el-col>
      </el-form-item>
      <el-form-item label="　">
        <el-button type="primary" :loading="isLoading" @click="updateNews('formData')">
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
  created () {
    this.getDetail()
  },
  data () {
    return {
      imgUploadUrl: URL.api_name + '/memberapi/news/upload.do',
      isLoading: false,
      formData: {
        newsTitle: '',
        newsSubtitle: '',
        newsDetail: '',
        newsImage: ''
      },
      rinkImages: [],
      rules: {
        newsTitle: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        newsSubtitle: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        newsDetail: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getDetail () {
      var that = this
      axios.get(URL.api_name + 'memberapi/news/find.do', {
        params: {
          id: that.$route.params.nid
        }
      }).then((res) => {
        that.rinkImages = []
        console.log('x0')
        if (res.data.status === 'success') {
          that.formData.newsTitle = res.data.data.newsTitle
          that.formData.newsSubtitle = res.data.data.newsSubtitle
          that.formData.newsDetail = res.data.data.newsDetail
          that.formData.newsImage = res.data.data.newsImage
          console.log('x1')
          console.log(that.formData.newsImage)
          console.log('x2')
          if (that.formData.newsImage !== '') {
            that.rinkImages.push({
              url: that.formData.newsImage
            })
          }
          console.log(that.rinkImages)
        } else {
          that.$mesage({
            type: 'error',
            message: res.data.message
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    upImgSuccess (response, file, fileList) {
      // this.formData.pictureName = response.data.pictureName
      this.formData.newsImage = response.data.pictureUrl
    },
    upImgremove (file, fileList) {
      // this.rinkImages = fileList
      this.formData.newsImage = ''
      console.log(this.formData.newsImage)
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
      // 如果文件大小超过2M，提示用户
      if (file.size > 1024 * 1024 * 2) {
        this.$message({
          type: 'error',
          message: '图片不能大于2M'
        })
        return false
      }
      if (this.rinkImages.length > 0) {
        this.$message({
          message: '最多上传一张图片',
          type: 'error'
        })
        return false
      }
    },
    updateNews (formName) {
      let that = this
      console.log(this.formData.newsImage)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post(URL.api_name + 'memberapi/news/update.do', {
            id: that.$route.params.nid,
            newsTitle: that.formData.newsTitle,
            newsSubtitle: that.formData.newsSubtitle,
            newsDetail: that.formData.newsDetail,
            newsImage: that.formData.newsImage
          }).then((res) => {
            that.isLoading = false
            if (res.data.status === 'success') {
              that.$message({
                message: res.data.message,
                type: 'success'
              })
              that.$router.push({
                path: '/news'
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
<style>
</style>
