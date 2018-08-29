<template>
    <div class="store-list">
        <div class="crumbs">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="el-icon-date"></i>门店维护</el-breadcrumb-item>
              <el-breadcrumb-item>完善资料</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-data" style="border:solid 1px #e4e4e4; padding:20px;">
          <el-form ref="storeMsgForm" :model="storeMsgForm" :rules="rules" label-width="100px" class="demo-ruleForm">

            <el-form-item label="门店名称：" prop="storeName">
              <el-col :span="12">
                <span style="color: #999;">{{ storeMsgForm.storeName }}</span>
              </el-col>
            </el-form-item>

            <el-form-item label="地区：">
              <el-row>
                <el-col :span="4">
                  <el-select v-model="storeMsgForm.province" placeholder="请选择"  @change="chooseCity">
                    <el-option :label="item.name" :value="item.id" v-for="item in provinces" :key="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="storeMsgForm.city" placeholder="请选择" @change="chooseArea">
                    <el-option :label="item.name" v-for='item in citys' :value="item.id" :key="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="storeMsgForm.area" placeholder="请选择">
                    <el-option :label="item.name" v-for="item in areas" :value="item.id" :key="item.id"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-input v-model="storeMsgForm.address" placeholder="详细地址"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="咨询电话：" prop="phone">
              <el-col :span="12">
                <el-input v-model="storeMsgForm.phone" placeholder="电话号码"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="营业状态：" >
              <el-radio-group v-model="storeMsgForm.businessStatus">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="2">停业</el-radio>
                <el-radio :label="3">休业整顿</el-radio>
                <el-radio :label="4">待开业</el-radio>
              </el-radio-group>

            </el-form-item>

            <el-form-item label="营业时间：">
                <el-col :span="5">
                  <el-select v-model="storeMsgForm.startBusinessTime" @change="beginTimes" placeholder="选择时间">
                    <el-option :label="item.text" v-for='item in startBusinessTimes' :value="item.value" :key="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="5">
                  <el-select v-model="storeMsgForm.endBusinessTime" @change="endTimes" placeholder="选择时间">
                    <el-option :label="item.text" v-for='item in endBusinessTimes' :value="item.value" :key="item.id"></el-option>
                  </el-select>
                </el-col>
            </el-form-item>

            <el-form-item label="冰场主画面：" >
              <el-col :span="12">
                <el-upload
                    class="upload-demo"
                    :action="imgUploadUrl"
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :on-success="upImgSuccess"
                    :on-remove="upImgremove"
                    :headers="uploadHeader"
                    :data="{folderName: 'store'}"
                    :on-error="uporr"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2Mb</div>
                  </el-upload>
                </el-col>
            </el-form-item>

            <el-form-item label="门店简介：" prop="storeSummary">
              <el-col :span="12">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="storeMsgForm.storeSummary">
                </el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="门店介绍：" prop="storeIntroduce">
              <el-col :span="18">
                <quill-editor v-model="storeMsgForm.storeIntroduce"></quill-editor>
              </el-col>
            </el-form-item>

            <el-form-item label="购课须知标题：" prop="courseShopTitle">
              <el-col :span="12">
                <el-input
                  type="text"
                  placeholder="请输入购课须知标题..."
                  v-model="storeMsgForm.courseShopTitle">
                </el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="购课须知详情：" prop="courseShopNotes">
              <el-col :span="12">
                <el-input type="textarea"
                          :rows="8"
                          placeholder="请输入购课须知详情..."
                          v-model="storeMsgForm.courseShopNotes"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="购票须知标题：" prop="ticketShopTitle">
              <el-col :span="12">
                <el-input
                  type="text"
                  placeholder="请输入购票须知标题..."
                  v-model="storeMsgForm.ticketShopTitle">
                </el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="购票须知详情：" prop="ticketShopNotes">
              <el-col :span="12">
                <el-input type="textarea"
                          :rows="8"
                          placeholder="请输入购票须知详情..."
                          v-model="storeMsgForm.ticketShopNotes"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="　">
              <el-button type="primary" @click="saveStoreMsg('storeMsgForm')" :loading="isSubmit">完成</el-button>
              <el-button @click="$router.go('-1')">取消</el-button>
            </el-form-item>
          </el-form>

        </div>
    </div>
</template>
<script>
  import axios from 'axios'
  import { quillEditor } from 'vue-quill-editor'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getProvince()
      this.getListData()
    },
    data () {
      var checkPhone = (rule, value, callback) => {
        let patten = /^\d{3,4}-\d{4}\s{1}\d{3,4}$/
        if (!patten.test(value)) {
          return callback(new Error('请输入正确的号码'))
        } else {
          callback()
        }
      }
      return {
        storeMsgForm: {
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          storeName: '罗湖区蔡屋围冰纷冰场 SZ01',
          province: '',
          city: '',
          area: '',
          address: '',
          phone: '',
          businessStatus: 1,
          startBusinessTime: '09:00',
          endBusinessTime: '18:00',
          rinkBusiness: '1',
          storeIntroduce: '',
          storeSummary: '',
          rinkImages: [],
          skatingIntroduce: '',
          courseShopTitle: '',
          courseShopNotes: '',
          ticketShopNotes: '',
          ticketShopTitle: ''
        },
        imgUploadUrl: URL.api_name + URL.fileUploadUrl,
        isSubmit: false,
        fileList: [],
        startBusinessTimes: [],
        endBusinessTimes: [],
        provinces: [],
        citys: [],
        areas: [],
        rules: {
          phone: [
            { validator: checkPhone, trigger: 'blur' }
          ],
          storeSummary: [
            { required: true, message: '请填写简介', trigger: 'blur' }
          ],
          storeIntroduce: [
            { required: true, message: '请填写介绍', trigger: 'blur' }
          ]

        },
        isFirst: true,
        isFirstC: true
      }
    },
    components: {
      quillEditor
    },
    methods: {
      getProvince () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/store/initialPosition.do', {
          params: {}
        }).then((res) => {
          that.provinces = res.data.data.provinces
        })
      },
      getListData () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/store/find.do', {
          params: {
            storeId: this.storeMsgForm.storeId
          }
        }).then(function (response) {
          that.province = response.data
          // 店名
          that.storeMsgForm.storeName = response.data.data.storeName
          // 省市区
          that.storeMsgForm.province = response.data.data.province
          that.storeMsgForm.city = response.data.data.city
          that.storeMsgForm.area = response.data.data.area
          // 门店详细地址
          that.storeMsgForm.address = response.data.data.address
          // 电话
          that.storeMsgForm.phone = response.data.data.phone
          // 营业状态------
          that.storeMsgForm.businessStatus = response.data.data.businessStatus
          // 营业开始时间
          that.storeMsgForm.startBusinessTime = response.data.data.startBusinessTime
          // 营业结束时间
          that.storeMsgForm.endBusinessTime = response.data.data.endBusinessTime
          // 图片列表
          if (response.data.data.rinkImages !== null) {
            for (var i = 0; i < response.data.data.rinkImages.length; i++) {
              that.fileList.push({
                name: response.data.data.rinkImages[i].imagesId,
                url: response.data.data.rinkImages[i].imagesUrl
              })
            }
          }
          // 营业时间列表
          that.startBusinessTimes = response.data.data.intercepTime
          // 营业时间列表
          that.endBusinessTimes = response.data.data.intercepTime
          // 门店介绍
          that.storeMsgForm.storeIntroduce = response.data.data.storeIntroduce
          // 门店简介
          that.storeMsgForm.storeSummary = response.data.data.storeSummary
          that.storeMsgForm.courseShopTitle = response.data.data.courseShopTitle
          that.storeMsgForm.courseShopNotes = response.data.data.courseShopNotes
          that.storeMsgForm.ticketShopTitle = response.data.data.ticketShopTitle
          that.storeMsgForm.ticketShopNotes = response.data.data.ticketShopNotes
        }, function (error) {
          console.log(error)
        })
      },
      chooseCity (val) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/store/obtainCitiesOrAreas.do', {
          params: {
            province: val
          }
        }).then((res) => {
          that.citys = res.data.data.citys
          if (!that.isFirst) {
            that.storeMsgForm.city = ''
            that.storeMsgForm.area = ''
          }
          this.isFirst = false
        }, function (error) {
          console.log(error)
        })
      },
      beginTimes (val) {
        let that = this
        if (val >= that.storeMsgForm.endBusinessTime) {
          that.$message({
            type: 'error',
            message: '开始时间不能大于结束时间'
          })
          that.storeMsgForm.startBusinessTime = ''
        }
      },
      endTimes (val) {
        let that = this
        if (val <= that.storeMsgForm.startBusinessTime) {
          that.$message({
            type: 'error',
            message: '结束时间不能小于开始时间'
          })
          that.storeMsgForm.endBusinessTime = ''
        }
      },
      chooseArea (val) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/store/obtainCitiesOrAreas.do', {
          params: {
            city: val
          }
        }).then((res) => {
          that.areas = res.data.data.areas
          if (!that.isFirstC) {
            that.storeMsgForm.area = ''
          }
          that.isFirstC = false
        }, function (error) {
          console.log(error)
        })
      },
      upImgSuccess (response, file, fileList) {
        this.fileList = fileList
      },
      upImgremove (file, fileList) {
        this.fileList = fileList
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
        if (this.fileList.length >= 5) {
          this.$message({
            type: 'error',
            message: '最多上传五张图片',
            duration: 1000
          })
          return false
        }
      },
      saveStoreMsg (formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 如果验证通过就提交数据
            if (that.fileList.length > 0) {
              that.storeMsgForm.rinkImages = []
              for (let i = 0; i < that.fileList.length; i++) {
                if (that.fileList[i].response) {
                  that.storeMsgForm.rinkImages.push({
                    imagesId: that.fileList[i].response.data.pictureName,
                    imagesUrl: that.fileList[i].response.data.pictureUrl
                  })
                } else {
                  that.storeMsgForm.rinkImages.push({
                    imagesId: that.fileList[i].name,
                    imagesUrl: that.fileList[i].url
                  })
                }
              }
            }
            that.isSubmit = true
            axios.post(URL.api_name + 'backofficeapi/store/update.do', that.storeMsgForm).then(function (response) {
              if (response.data.status === 'success') {
                // 更新表单数据
                that.$message({
                  type: 'success',
                  message: '修改成功',
                  duration: 1000,
                  onClose: function () {
                  }
                })
                that.isSubmit = false
                // that.$router.go('-1')
              }
            }).catch((err) => {
              console.log(err)
              that.isSubmit = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        // this.$refs[formName].resetFields()
        this.getListData()
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
.el-select{ display: block;}
.storefilemsg{
  padding:24px;
  margin:10px 0 0 0;
}
.text-right{ text-align:right; line-height: 1.7; padding:3px 10px;}
.crumbs {
    padding-bottom: 10px;
    border-bottom: 1px solid #ebebeb;
}
 .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    margin:2px 0;
    font-size: 14px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
.line{ text-align:center;}
</style>
