<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 卡券管理</el-breadcrumb-item>
        <el-breadcrumb-item>卡券列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="卡券类型">
          <el-col :span="12">
            <el-radio-group v-model="formData.category">
              <el-radio :disabled="formData.category !== o.systemCode" :label="o.systemCode" v-for="(o, i) in categoryList" :key="i">{{ o.systemName }}</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="金额:" v-show="formData.category === 'coupon_cash'" required prop="amount">
          <el-col :span="12">
            <el-input v-model.number="formData.amount"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="订单金额满:" v-show="formData.category != 'coupon_gift'" required prop="offsetNeedFull">
          <el-col :span="3">
            <el-input v-model.number="formData.offsetNeedFull"></el-input>
          </el-col>
          <el-col :span='5'>
            元使用
          </el-col>
        </el-form-item>
        <el-form-item label="卡券名称" required>
          <el-col :span="12">
            <el-input v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="卡券描述">
          <el-col :span="12">
            <el-input type="textarea" :rows="4" v-model="formData.instructions"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="卡券图标">
          <el-col :span="12">
            <el-upload
              class="upload-demo"
              :action="imgUploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="uporr"
              list-type="picture"
              :data="{folderName: 'couponmark'}"
              :before-upload="beforeUpload"
              :headers="uploadHeader"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2Mb(推荐尺寸W390 x H234px)</div>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-col :span="12">
            <el-date-picker
            type="datetime"
            :editable="false"
            placeholder="选择日期"
            v-model="formData.usedBeginTime"
            @change="beginTimeRules"
            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-col :span="12">
            <el-date-picker
            type="datetime"
            :editable="false"
            placeholder="选择日期"
            v-model="formData.usedEndTime"
            @change="endTimeRules"
            style="width: 100%;"></el-date-picker>
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
    import moment from 'moment'
    export default {
      created () {
        this.getDetail()
        this.getCategoryList()
      },
      data () {
        var checkNumber = (rule, value, callback) => {
          let nums = /^[1-9]\d*|0$/
          if (!nums.test(value)) {
            return callback(new Error('只能并且得输入数字'))
          } else {
            callback()
          }
        }
        return {
          formData: {
            category: '',
            logo: '',
            amount: 0,
            name: '',
            instructions: '',
            usedBeginTime: '',
            usedEndTime: '',
            offsetNeedFull: 0
          },
          loading: false,
          fileList: [],
          rules: {
            amount: [
              { validator: checkNumber }
            ],
            offsetNeedFull: [
              { validator: checkNumber }
            ]
          },
          imgUploadUrl: URL.api_name + URL.fileUploadUrl,
          categoryList: [],
          storeId: JSON.parse(sessionStorage.getItem('store')).k
        }
      },
      methods: {
        getCategoryList () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
            params: {
              systemCode: 'coupon_category'
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.categoryList = res.data.data
            }
          })
        },
        getDetail () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/coupon/mark/details.do', {
            params: {
              id: that.$route.params.couponId
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
              if (res.data.data.logo !== '') {
                that.fileList.push({
                  url: that.formData.logo
                })
              }
            } else {
              that.$message({
                type: 'error',
                message: '获取数据失败',
                duration: 1000
              })
            }
          }).catch(err => {
            that.$message({
              type: 'error',
              message: '获取数据失败',
              duration: 1000
            })
            console.log(err)
          })
        },
        onSubmit (formName) {
          var that = this
          // 判断图片地址
          if (this.fileList.length === 0) {
            that.formData.logo = ''
          }
          that.loading = true
          if (that.formData.usedBeginTime !== '') {
            that.formData.usedBeginTime = moment(that.formData.usedBeginTime).format('YYYY-MM-DD HH:mm:ss')
          }
          if (that.formData.usedEndTime !== '') {
            that.formData.usedEndTime = moment(that.formData.usedEndTime).format('YYYY-MM-DD HH:mm:ss')
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              axios.post(URL.api_name + '/backofficeapi/coupon/mark/update.do', that.formData).then(res => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '修改成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/coupon'
                      })
                    }
                  })
                } else {
                  that.loading = false
                  that.$message({
                    type: 'error',
                    message: res.data.message
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
            } else {
              that.loading = false
              console.log('error submit!!')
              return false
            }
          })
        },
        beginTimeRules (val) {
          let date1 = moment(val)
          let date2 = moment(this.formData.usedEndTime)
          this.formData.usedBeginTime = val
          // console.log(this.formData.useBeginTime)
          if (date2 !== 'NaN' && date1.diff(date2) >= 0) {
            this.$message({
              message: '开始时间不能大于结束时间',
              type: 'error'
            })
            this.formData.usedBeginTime = ''
          }
        },
        endTimeRules (val) {
          let date1 = moment(this.formData.usedBeginTime)
          let date2 = moment(val)
          this.formData.usedEndTime = val
          // console.log(date2)
          if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'error'
            })
            this.formData.usedEndTime = ''
          }
        },
        handleRemove (file, fileList) {
          this.fileList = fileList
        },
        handleSuccess (response, file, fileList) {
          this.fileList = fileList
          if (response.status === 'success') {
            this.formData.logo = response.data.pictureUrl
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
</style>
