<template>
  <div class="testCourseSet">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 体验课</el-breadcrumb-item>
        <el-breadcrumb-item>体验课设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="课程类型：" prop="courseName">
          <span>{{ formData.courseName }}</span>
        </el-form-item>
        <el-form-item label="上课时间：">
          <el-row  v-for="(list, index) in formData.times" :key="index">
            <el-col :span="6">
              <el-select v-model="list.dayofweek" placeholder="请选择星期几">
                <el-option v-for="(item, index) in weeks"
                           :label="item.value"
                           :value="item.label" :key="index"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="list.startTimeStr" placeholder="请选择开始时间段">
                <el-option v-for="(item1, index) in times"
                           :label="item1.text"
                           :value="item1.text"
                           :key="index"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="list.endTimeStr" placeholder="请选择结束时间段">
                <el-option v-for="(item1, index) in times"
                           :label="item1.text"
                           :value="item1.text"
                           :key="index"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button @click.prevent="removeFormList(list)" class="reduceBtn">-</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click.prevent="addFormList()" class="reduceBtn">添加时间</el-button>
        </el-form-item>
        <el-form-item>
          <el-col :span="6">
            <el-form-item label="初级教练：" prop="primaryPrice">
              <el-input v-model.number="formData.primaryPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="体验费：" prop="primaryExperiencefee">
              <el-input v-model.number="formData.primaryExperiencefee" style="width:80px;"></el-input>
            </el-form-item>
          </el-col>
          元
        </el-form-item>
        <el-form-item>
          <el-col :span="6">
            <el-form-item label="中级教练：" prop="middlePrice">
              <el-input v-model.number="formData.middlePrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="体验费：" prop="middleExperiencefee">
              <el-input v-model.number="formData.middleExperiencefee" style="width:80px;"></el-input>
            </el-form-item>
          </el-col>
          元
        </el-form-item>
        <el-form-item>
          <el-col :span="6">
            <el-form-item label="高级教练：" prop="seniorPrice">
              <el-input v-model.number="formData.seniorPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="体验费：" prop="seniorExperiencefee">
              <el-input v-model.number="formData.seniorExperiencefee" style="width:80px;"></el-input>
            </el-form-item>
          </el-col>
          元
        </el-form-item>
        <el-form-item>
          <el-col :span="6">
            <el-form-item label="国际教练：" prop="internationalPrice">
              <el-input v-model.number="formData.internationalPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="体验费：" prop="internationalExperiencefee">
              <el-input v-model.number="formData.internationalExperiencefee" style="width:80px;"></el-input>
            </el-form-item>
          </el-col>
          元
        </el-form-item>
        <el-form-item label="课程图片：">
          <el-col :span="12">
            <el-upload
              class="upload-demo"
              :action="imgUploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-error="uporr"
              :on-success="handleSuccess"
              list-type="picture"
              :before-upload="beforeUpload"
              :headers="uploadHeader"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2MB(推荐尺寸W291 x H210)</div>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="体验课介绍：">
          <el-col :span="18">
            <p class="tips">图片推荐尺寸(W1050 x H543)</p>
            <quill-editor ref="myTextEditor" v-model="formData.introduce"></quill-editor>
          </el-col>
        </el-form-item>
        <el-form-item label="赠送陪同票张数：" prop="freeCompTicket">
          <el-col :span="4">
            <el-input v-model.number="formData.freeCompTicket"></el-input>
          </el-col>
          <el-col :span="2" style="margin-left: 8px;">张</el-col>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="dialogSubmit('formData')">保 存</el-button>
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
      this.initialTime()
      this.getDetail()
    },
    data () {
      return {
        formData: {
          times: [{
            dayofweek: '',
            startTimeStr: '',
            endTimeStr: ''
          }],
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          courseName: '体验课',
          primaryPrice: 0,
          primaryExperiencefee: 0,
          middlePrice: 0,
          middleExperiencefee: 0,
          seniorPrice: 0,
          seniorExperiencefee: 0,
          internationalPrice: 0,
          internationalExperiencefee: 0,
          picturePath: '',
          freeCompTicket: ''
        },
        fileList: [],
        storeId: JSON.parse(sessionStorage.getItem('store')).k,
        imgUploadUrl: URL.api_name + 'backofficeapi/course/experience/upload.do',
        weeks: [{
          label: 1,
          value: '星期一'
        }, {
          label: 2,
          value: '星期二'
        }, {
          label: 3,
          value: '星期三'
        }, {
          label: 4,
          value: '星期四'
        }, {
          label: 5,
          value: '星期五'
        }, {
          label: 6,
          value: '星期六'
        }, {
          label: 7,
          value: '星期日'
        }],
        times: [],
        rules: {
          freeCompTicket: [
            { validator: Validate.checkInputNumR, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      weekChange (item) {
        let num = 1
        for (let i = 0; i < this.formData.times.length; i++) {
          if (item.dayofweek === this.formData.times[i].dayofweek && item.timeofday === this.formData.times[i].timeofday) {
            num++
          }
        }
        if (num > 2) {
          this.$message({
            type: 'error',
            message: '时间段重复了'
          })
          item.dayofweek = ''
        }
      },
      timeChange (item) {
        let num = 1
        for (let i = 0; i < this.formData.times.length; i++) {
          if (item.dayofweek === this.formData.times[i].dayofweek && item.timeofday === this.formData.times[i].timeofday) {
            num++
          }
        }
        if (num > 2) {
          this.$message({
            type: 'error',
            message: '时间段重复了'
          })
          item.timeofday = ''
        }
      },
      getDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/experience/details.do', {
          params: {
            storeId: that.storeId
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
            that.fileList = []
            that.fileList.push({
              name: res.data.data.pictureName,
              url: res.data.data.picturePath
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch((err) => {
          console.error(err)
          this.$errMsg('获取数据失败')
        })
      },
      addFormList () {
        this.formData.times.push({
          dayofweek: '',
          startTimeStr: '',
          endTimeStr: ''
        })
      },
      removeFormList (formlist) {
        let index = this.formData.times.indexOf(formlist)
        if (index !== -1) {
          this.formData.times.splice(index, 1)
        }
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
      },
      initialTime () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/store/rink/reserve/initialTime.do', {
          params: {
            storeId: this.storeId
          }
        }).then(function (res) {
          if (res.data.status === 'success') {
            that.times = res.data.data
          }
        })
      },
      dialogSubmit (formName) {
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post(URL.api_name + 'backofficeapi/course/experience/create.do', {
              courseName: that.formData.courseName,
              internationalExperiencefee: parseInt(that.formData.internationalExperiencefee),
              internationalPrice: parseInt(that.formData.internationalPrice),
              introduce: that.formData.introduce,
              middleExperiencefee: parseInt(that.formData.middleExperiencefee),
              middlePrice: parseInt(that.formData.middlePrice),
              picturePath: that.formData.picturePath,
              primaryExperiencefee: parseInt(that.formData.primaryExperiencefee),
              primaryPrice: parseInt(that.formData.primaryPrice),
              seniorExperiencefee: parseInt(that.formData.seniorExperiencefee),
              seniorPrice: parseInt(that.formData.seniorPrice),
              storeId: that.storeId,
              times: that.formData.times,
              freeCompTicket: that.formData.freeCompTicket
            }).then((res) => {
              that.isLoading = false
              if (res.data.status === 'success') {
                that.$message({
                  message: res.data.message,
                  type: 'success'
                })
                that.getDetail()
              } else {
                that.$message({
                  type: 'error',
                  message: res.data.message
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
<style lang="less" scoped>
.el-row{ margin:5px 0;}
.Zvertical{ display:inline-block; text-align:center; line-height: 36px; height:36px; padding:0 10px;}
.el-input{ vertical-align: middle;}
.tips{
  font-size: 12px;
  color: rgb(131, 164, 165);
}
</style>
