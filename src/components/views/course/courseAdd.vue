<template>
  <div class="courseAdd">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加课程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">
        <el-form-item label="课程名称：" prop="courseName">
          <el-col :span="12">
            <el-input type="text" v-model="formData.courseName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="课程图片：">
          <el-col :span="12">
            <el-upload
              class="upload-demo"
              :action="imgUploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :data="{folderName: 'course'}"
              :on-error="uporr"
              :before-upload="beforeUpload"
              :headers="uploadHeader"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2MB(推荐尺寸W510 x H360px)</div>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="课程介绍：">
          <el-col :span="18">
            <p class="tips">图片推荐尺寸(W1050 x H543)</p>
            <quill-editor ref="myTextEditor" v-model="formData.introduce"></quill-editor>
          </el-col>
        </el-form-item>
        <el-form-item label="课程简介：">
          <el-col :span="18">
            <el-input type="textarea" :rows="4" v-model="formData.brief"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="课程标签：" prop="courseLabel">
          <el-col :span="12">
            <el-select v-model="formData.courseLabel">
              <el-option v-for="c in courseLabelList" :key="c.systemCode"
                          :label="c.systemName"
                          :value="c.systemCode"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="冰面占用：">
          <el-radio-group v-model="formData.useice">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课节数量：" required prop='courseNum'>
          <el-col :span="4">
            <el-input v-model.number="formData.courseNum"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="课程时长：" prop="coursePeriod">
          <el-col :span="4">
            <el-select v-model="formData.coursePeriod" placeholder="请选择">
              <el-option v-for="(e, index) in coursePeriods"
                         :key="index"
                         :label="e.timeLine"
                         :value='e.value'>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="初级价格：">
          <el-col :span="4">
            <el-input v-model.number="formData.primaryPrice"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="中级价格：">
          <el-col :span="4">
            <el-input v-model.number="formData.middlePrice"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="高级价格：">
          <el-col :span="4">
            <el-input v-model.number="formData.seniorPrice"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="国际价格：">
          <el-col :span="4">
            <el-input v-model.number="formData.internationalPrice"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="赠送陪同票张数：" prop="freeCompTicket">
          <el-col :span="4">
            <el-input v-model.number="formData.freeCompTicket"></el-input>
          </el-col>
          <el-col :span="2" style="margin-left: 8px;">张</el-col>
        </el-form-item>
        <el-form-item label="是否上架：">
          <el-col :span="4">
            <el-select v-model="formData.status" placeholder="请选择">
              <el-option v-for="(e, index) in statuses"
                         :key="index"
                         :label="e.label"
                         :value='e.id'>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="　">
          <el-checkbox v-model="checked">是否为推荐课程</el-checkbox>
        </el-form-item>
        <el-form-item label="　">
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
  import Validate from '@/common/js/validate'
  export default {
    created () {
      this.getCourseLabel()
    },
    data () {
      var checkNumber = (rule, value, callback) => {
        let nums = /^[1-9]\d*|0$/
        if (!value) {
          return callback(new Error('不能为空且只能输入大于0的数字'))
        } else if (!nums.test(value)) {
          return callback(new Error('格式不正确'))
        } else {
          callback()
        }
      }
      return {
        formData: {
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          picturePath: '',
          courseName: '',
          introduce: '',
          brief: '',
          useice: 1,
          courseLabel: '',
          courseNum: 0,
          status: 1,
          coursePeriod: '',
          primaryPrice: '',
          middlePrice: '',
          seniorPrice: '',
          internationalPrice: '',
          isrecommended: 1,
          freeCompTicket: ''
        },
        fileList: [],
        coursePeriods: [{
          timeLine: '30分钟',
          value: '30'
        }, {
          timeLine: '1小时',
          value: '60'
        }, {
          timeLine: '1.5小时',
          value: '90'
        }, {
          timeLine: '2小时',
          value: '120'
        }, {
          timeLine: '2.5小时',
          value: '150'
        }, {
          timeLine: '3小时',
          value: '180'
        }, {
          timeLine: '3.5小时',
          value: '210'
        }, {
          timeLine: '4小时',
          value: '240'
        }],
        statuses: [{
          label: '上架',
          id: 1
        }, {
          label: '下架',
          id: 2
        }],
        imgUploadUrl: URL.api_name + URL.fileUploadUrl,
        checked: false,
        isLoading: false,
        rules: {
          courseName: [
            { required: true, message: '课程名称不能为空', trigger: 'blur' },
            { max: 48, message: '最大长度不能超过48个字符', trigger: 'blur' }
          ],
          coursePeriod: [
            { required: true, message: '请选择课程', trigger: 'change' }
          ],
          courseNum: [
            { validator: checkNumber }
          ],
          courseLabel: [
            { required: true, message: '请选择课程标签', trigger: 'change' }
          ],
          freeCompTicket: [
            { validator: Validate.checkInputNumR, trigger: 'blur' }
          ]
        },
        courseLabelList: []
      }
    },
    methods: {
      getCourseLabel () {
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'course_label'
          }
        }).then(res => {
          this.courseLabelList = res.data.data
        })
      },
      add (formName) {
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.isLoading = true
            if (that.fileList.length <= 0) {
              that.$message({
                message: '课程图片不能为空',
                type: 'error'
              })
              return false
            }
            if (that.formData.primaryPrice === '' && that.formData.middlePrice === '' && that.formData.seniorPrice === '' && that.formData.internationalPrice === '') {
              that.$message({
                message: '初、中、高、国际 等 四种价格至少填写一种',
                type: 'error'
              })
              return false
            }
            // 是否为推荐课程判断赋值
            that.formData.isrecommended = that.checked ? 0 : 1
            axios.post(URL.api_name + 'backofficeapi/course/add.do', that.formData).then((res) => {
              if (res.data.status === 'success') {
                that.$message({
                  message: res.data.message,
                  type: 'success'
                })
                that.$router.push({
                  path: '/courseList'
                })
              } else {
                that.isLoading = false
                that.$message({
                  message: res.data.message,
                  type: 'error'
                })
              }
            }).catch((error) => {
              that.isLoading = false
              console.log(error)
            })
          }
        })
      },
      handleRemove (file, fileList) {
        this.fileList = fileList
      },
      handleSuccess (response, file, fileList) {
        this.fileList = fileList
        if (response.status === 'success') {
          this.formData.picturePath = response.data.pictureUrl
        } else {
          this.fileList = []
        }
      },
      handlePreview (file) {
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
  .tips{
    font-size: 12px;
    color: rgb(131, 164, 165);
  }
</style>

