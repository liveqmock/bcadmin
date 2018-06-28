<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 内容管理</el-breadcrumb-item>
        <el-breadcrumb-item><i class="el-icon-date"></i> 资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item>发布资讯</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="formData" label-width="110px">
      <el-form-item label="所属门店：" prop="organIds">
        <el-col :span="18">
          <el-checkbox-group v-model="formData.organIds">
            <el-checkbox v-for="(s, i) in storeArrList" :key="i" :label="s.k">{{ s.v }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-form-item>
      <el-form-item label="资讯标题" prop="title">
        <el-col :span="9">
          <el-input v-model="formData.title"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="资讯简介" prop="content">
        <el-col :span="9">
          <el-input type="textarea" v-model="formData.content"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="资讯图片" >
        <el-col :span="12">
          <el-upload
              class="upload-demo"
              :action="imgUplaodUrl"
              :file-list="filelist"
              :multiple="true"
              :before-upload="beforeUpload"
              :on-success="upImgSuccess"
              :on-remove="upImgremove"
              :on-error="uporr"
              :headers="uploadHeader"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2MB(推荐尺寸W384 x H279px)</div>
            </el-upload>
          </el-col>
      </el-form-item>
      <el-form-item label="资讯详情" prop='graphicDetails'>
        <el-col :span="18">
          <p class="tips">图片推荐尺寸W1053 x H489px</p>
	        <quill-editor ref="myTextEditor" v-model="formData.graphicDetails"></quill-editor>
	      </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="addNews('formData')">
            {{ isLoading ? '正在保存' : '完成' }}
        </el-button>
        <el-button type="success" @click="preview">预览</el-button>
        <el-button @click="$router.go('-1')">返回</el-button>
      </el-form-item>
    </el-form>
      <div class="previews" v-show="previewToggle">
        <div class="closePre">
          <el-button @click="closePre">关闭</el-button>
        </div>
        <div class="preContBg">
          <div class="preCont">
            <h2>{{ formData.title }}</h2>
            <small>{{ nowDate }}</small>
            <div class="preImg">
              <img :src="formData.pictureUrl">
            </div>
            <div class="preText" v-html="htmlStr"></div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import axios from 'axios'
import URL from '@/common/js/URL.js'
import { quillEditor } from 'vue-quill-editor'
export default {
  created () {
    this.getUsuallTime()
  },
  data () {
    var checkStore = (rule, value, callback) => {
      if (value.length < 0) {
        return callback(new Error('请选择一个门店'))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      visible: false,
      selected: false,
      formData: {
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        organIds: [],
        title: '',
        content: '',
        pictureName: '',
        pictureUrl: '',
        graphicDetails: ''
      },
      imgUplaodUrl: URL.api_name + 'backofficeapi/information/headlines/upload.do',
      previewToggle: false,
      nowDate: '',
      filelist: [],
      rules: {
        organIds: [
          { required: true, validator: checkStore, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        graphicDetails: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getUsuallTime () {
      let myDate = new Date()
      this.nowDate = myDate.toLocaleDateString()
    },
    upImgSuccess (response, file, fileList) {
      // this.storeMsgForm.rinkImages = fileList
      if (response.status === 'success') {
        this.filelist = fileList
        this.formData.pictureName = response.data.pictureName
        this.formData.pictureUrl = response.data.pictureUrl
      } else {
        this.fileList = []
        this.$message({
          type: 'error',
          message: response.message
        })
      }
    },
    upImgremove (file, fileList) {
      this.filelist = fileList
    },
    uporr (err, file, fileList) {
      if (err.status === 'failed') {
        this.$message({
          message: err.message,
          type: 'error'
        })
        return
      }
      this.$message({
        message: '上传失败',
        type: 'error'
      })
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
      if (this.filelist.length > 0) {
        this.$message({
          message: '最多上传一张图片',
          type: 'error'
        })
        return false
      }
    },
    handleCheckChange (data, checked, indeterminate) {
      // console.log(data)
      // console.log(checked)
      // console.log(indeterminate)
    },
    addNews (formName) {
      let that = this
      if (that.formData.organIds === '') {
        that.$message({
          message: '请先选择门店',
          type: 'error'
        })
        return false
      }
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
    },
    preview () {
      this.previewToggle = true
    },
    closePre () {
      this.previewToggle = false
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
    },
    htmlStr () {
      return this.formData.graphicDetails.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    },
    storeArrList () {
      if (JSON.parse(sessionStorage.getItem('userInfo')).stores) {
        return JSON.parse(sessionStorage.getItem('userInfo')).stores
      } else {
        return []
      }
    }
  }
}
</script>
<style lang="less" scoped>
.previews{ background: rgba(0,0,0,.4); position: fixed; height: 100%; width:100%; z-index: 9999999; left: 0; top:0;}
.preContBg{ width: 320px; height:654px; position:fixed; left:50%; top:50%; margin:-327px 0 0 -160px;background:url(./phoneTemplate.png) no-repeat center;}
.preCont{ width:266px; padding: 10px; height:450px; margin:115px 0 0 18px; overflow:auto; background:#fff}
.preCont>h2{ font-size: 18px; line-height: 3;}
.preCont>small{color:#8c91b1; font-size:14px; font-weight: normal; font-family: Helvetica,arial;}
.preCont>.preImg{ padding:20px 0 0 0; text-align: center; }
.preCont>.preImg img{width: auto; max-width:100%;}
.preCont>.preText{ font-size:15px; line-height: 1.5;}
.preCont>.preText img{ width:100%; height:auto;}
.closePre{ position:fixed; right:50%; top:50%; margin:-320px -240px 0 0; }
.el-checkbox+.el-checkbox{
  margin-left: 0;
}
  .el-checkbox{
    margin-right: 10px;
  }
  .tips{
    font-size: 12px;
    color: rgb(131, 164, 165);
  }
</style>
