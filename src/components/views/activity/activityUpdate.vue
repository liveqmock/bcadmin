<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改活动</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="formData" label-width="130px">
      <el-form-item label="活动标题：" prop="title">
        <el-col :span="9">
          <el-input v-model="formData.title"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="活动描述：" prop="content">
        <el-col :span="9">
          <el-input type="textarea" :rows="4" v-model="formData.content"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item lable="活动类型："></el-form-item>
      <el-form-item label="活动人数：" prop="countLimit">
        <el-col :span="9">
          <el-input disabled type="number" v-model.number="formData.countLimit"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="活动地点：">
        <!--<el-form-item>
          <el-col :span="4">
            <el-select v-model="formData.province" placeholder="请选择"  @change="chooseCity">
                <el-option :label="item.name" :value="item.id" v-for="(item, i) in provinces" :key="i"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="formData.city" placeholder="请选择" @change="chooseArea">
                <el-option :label="item.name" v-for='(item, i) in citys' :value="item.id" :key="i"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="formData.area" placeholder="请选择">
                <el-option :label="item.name" v-for="(item, i) in areas" :value="item.id" :key="i"></el-option>
            </el-select>
          </el-col>
        </el-form-item>-->
        <el-form-item prop="address">
          <el-col :span="12">
            <el-input disabled v-model="formData.address"></el-input>
          </el-col>
        </el-form-item>
      </el-form-item>
      <el-form-item label="活动起止时间：" required>
        <el-col :span="5">
          <el-form-item prop="beginTime">
            <el-date-picker
              disabled
              v-model="formData.beginTime"
              type="datetime"
              :editable='false'
              @change="beginTimeRules"
              placeholder="选择日期时间">
            </el-date-picker>
            </el-form-item>
        </el-col>
        <el-col :span="1">　至</el-col>
        <el-col :span="5">
          <el-form-item prop="endTime">
            <el-date-picker
              disabled
              v-model="formData.endTime"
              type="datetime"
              :editable='false'
              @change="endTimeRules"
              placeholder="选择日期时间">
            </el-date-picker>
            </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="报名截止时间：" prop="signupEndTime">
        <el-date-picker
          v-model="formData.signupEndTime"
          type="datetime"
          disabled
          :editable='false'
          @change="signupEndTimeRules"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="占用冰面时间：" >
        <el-col :span="12">
          <el-radio-group v-model="formData.isOccupy">
            <el-radio disabled :label="1">是</el-radio>
            <el-radio disabled :label="2">否</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="过闸次数：">
        <el-col :span="12">
          <el-input type="text"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="过闸描述：">
        <el-col :span="12">
          <el-input type="textarea" :row="4"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="活动图片：" >
        <el-col :span="12">
          <el-upload
              class="upload-demo"
              :action="imgUplaodUrl"
              :file-list="rinkImages"
              :on-success="upImgSuccess"
              :multiple="true"
              :before-upload="beforeUpload"
              :on-error="uporr"
              :on-remove="upImgremove"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">上传一张图片时，内页详情图与首页列表图共用。上传两张图片时，图1为首页列表横图（推荐尺寸706x220px），图2为内页详情竖图 （推荐尺寸82x111px）</div>
            </el-upload>
          </el-col>
      </el-form-item>
      <el-form-item label="活动报名凭证：">
        <el-col :span="12">
          <el-input type="text" v-model="formData.voucher"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="活动图文详情：">
        <el-col :span="18">
          <p class="tips">图片推荐尺寸(W1053 x H489px)</p>
          <quill-editor ref="myTextEditor" v-model="formData.imageTextIntroduction"></quill-editor>
        </el-col>
      </el-form-item>
      <el-form-item label="活动须知：">
        <el-col :span="12">
          <el-input type="textarea" :rows="6" v-model="formData.purchaseNotice"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="支付类型：" required>
        <el-checkbox-group v-model="signTypes" @change="checkTypes">
          <el-row>
            <el-col :span="3">
              <el-checkbox disabled label="1" name="signTypes">活动价格
                <el-input disabled type="number" v-model.number="formData.signMoney"></el-input>　元
              </el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-checkbox disabled label="2" name="signTypes">消耗积分
                <el-input disabled type="number" v-model.number="formData.signPoint"></el-input>　分
              </el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-checkbox label="3" name="signTypes">抵消课程
                <el-input v-model.number="formData.signCourse"></el-input>　节
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="其他配置:">
        <el-row>
          <el-col :span="12">
            <el-button type="info" icon="plus" size="small" @click="addStandard"></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-table
              :data="productDetailList"
              border>
              <el-table-column label="品类名称" prop="categoryName"></el-table-column>
              <el-table-column label="原价" prop="originalPrice">
              </el-table-column>
              <el-table-column label="出售价" prop="categoryPrice">
              </el-table-column>
              <el-table-column label="数量" prop="categoryNumber">
              </el-table-column>
              <el-table-column label="描述" prop="categoryRemarks">
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button size="small" type="primary" @click="updateStandard(scope.row)">修改</el-button>
                  <el-button size="small" type="danger" @click="delStandard(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="updateActivity('formData')">
            {{ isLoading ? '正在保存' : '保存' }}
        </el-button>
        <el-button @click="$router.go('-1')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="添加规格" :visible.sync="dialogFormVisible" @close="clearStandard">
      <el-form :model="standard"
               label-width="100px"
               ref="standard"
               :close-on-click-modal="false">
        <el-form-item label="品类名称：" prop="categoryName">
          <el-col>
            <el-input v-model="standard.categoryName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="原价：" prop="originalPrice">
          <el-col>
            <el-input v-model.number="standard.originalPrice"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="出售价：" prop="categoryPrice">
          <el-col>
            <el-input v-model.number="standard.categoryPrice" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="数量：" prop="categoryNumber">
          <el-col>
            <el-input auto-complete="off" v-model.number="standard.categoryNumber"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述：" prop="categoryRemarks">
          <el-col>
            <el-input v-model.number="standard.categoryRemarks" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveStandard('standard')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import URL from '@/common/js/URL.js'
import { quillEditor } from 'vue-quill-editor'
import moment from 'moment'
let tempStandardIndex
export default {
  created () {
    this.getProvince()
    this.getDetail()
  },
  data () {
    var checkNumber = (rule, value, callback) => {
      let nums = /^[1-9]\d*(?!.*\.)/
      if (!nums.test(value)) {
        return callback(new Error('格式不正确，请输入纯数字'))
      } else {
        callback()
      }
    }
    return {
      delType: [],
      productDetailList: [],
      updateType: 0, // 判断添加还是修改规格 0是添加， 1是修改
      dialogFormVisible: false,
      standard: {
        categoryName: '',
        originalPrice: '',
        categoryPrice: '',
        categoryNumber: '',
        categoryRemarks: ''
      },
      yz1: true,
      yz2: true,
      yz3: true,
      isLoading: false,
      formData: {
        id: '',
        province: '',
        city: '',
        area: '',
        address: '',
        isOccupy: '1',
        signType: '',
        eventPictures: [],
        content: '',
        title: '',
        beginTime: '',
        endTime: '',
        signupEndTime: '',
        imageTextIntroduction: '',
        signMoney: 0,
        signPoint: 0,
        status: '',
        signCourse: 0,
        purchaseNotice: ''
      },
      signTypes: [],
      storeId: JSON.parse(sessionStorage.getItem('store')).k,
      imgUplaodUrl: URL.api_name + 'backofficeapi/information/event/upload.do',
      provinces: [],
      citys: [],
      areas: [],
      rinkImages: [],
      nowDate: '',
      filelist: [],
      rules: {
        address: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        graphicDetails: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        countLimit: [
          { validator: checkNumber }
        ],
        beginTime: [
          { required: true, message: '开始日期不能为空' }
        ],
        endTime: [
          { required: true, message: '结束日期不能为空' }
        ],
        signMoney: [
          { validator: checkNumber }
        ],
        signPoint: [
          { validator: checkNumber }
        ],
        signCourse: [
          { validator: checkNumber }
        ],
        signupEndTime: [
          { required: true, message: '报名截止时间不能为空' }
        ]
      },
      isFirst: true,
      isFirstC: true
    }
  },
  methods: {
    clearStandard () {
      this.dialogFormVisible = false
      // 初始化规格表单数据
      this.standard = {
        categoryName: '',
        originalPrice: '',
        categoryPrice: '',
        categoryNumber: '',
        categoryRemarks: ''
      }
    },
    saveStandard (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 校验成功
          if (this.updateType === 0) {
            this.productDetailList.push(this.standard)
          } else if (this.updateType === 1) {
            this.productDetailList.splice(tempStandardIndex, 1, this.standard)
          }
          this.clearStandard()
        }
      })
    },
    updateStandard (item) {
      tempStandardIndex = this.productDetailList.indexOf(item)
      this.standard = item
      this.dialogFormVisible = true
      this.updateType = 1
    },
    addStandard () {
      this.dialogFormVisible = true
      this.updateType = 0
    },
    delStandard (item) {
      if (item.isdetel !== undefined) {
        item.isdetel = true
        this.delType.push(item)
      }
      if (this.productDetailList.indexOf(item) > -1) {
        this.productDetailList.splice(this.productDetailList.indexOf(item), 1)
      }
    },
    getDetail () {
      var that = this
      axios.get(URL.api_name + 'backofficeapi/information/event/detail.do', {
        params: {
          id: that.$route.params.eid
        }
      }).then((res) => {
        if (res.data.status === 'success') {
          that.formData = res.data.data
          that.filelist = res.data.data.eventPictures
          that.productDetailList = res.data.data.eventCategories
          for (let i = 0; i < this.filelist.length; i++) {
            that.rinkImages.push({
              name: that.filelist[i].pictureName,
              url: that.filelist[i].pictureUrl
            })
          }
          if (res.data.data.signType.length > 0) {
            that.formData.signType = res.data.data.signType
            //  let arrayType = '1, 2, 3'.split(',').length
            for (let z = 0; z < that.formData.signType.split(',').length; z++) {
              that.signTypes.push(
                  that.formData.signType.split(',')[z]
                )
            }
          }
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
    getProvince () {
      let that = this
      axios.get(URL.api_name + '/backofficeapi/store/initialPosition.do', {
        params: {}
      }).then((res) => {
        that.provinces = res.data.data.provinces
      })
    },
    checkZore1 () {
      // let nums = /^\d+(\.\d+)?$/
      let nums = /\d{1,}\.\d{2}$/
      if (!nums.test(this.formData.signMoney)) {
        this.$message({
          message: '请输入正数，小数点后面最多2位',
          type: 'error'
        })
        this.formData.signMoney = 0
        this.yz1 = false
      }
    },
    checkZore2 () {
      let nums = /^[1-9]\d*(?!.*\.)/
      if (!nums.test(this.formData.signPoint)) {
        this.$message({
          message: '格式不正确，请输入纯数字',
          type: 'error'
        })
        this.formData.signPoint = 0
        this.yz2 = false
      }
    },
    checkZore3 () {
      let nums = /^[1-9]\d*(?!.*\.)/
      // let nums = /^[1-9]\d*|0$/
      if (!nums.test(this.formData.signCourse)) {
        this.$message({
          message: '格式不正确，请输入纯数字',
          type: 'error'
        })
        this.formData.signCourse = 0
        this.yz3 = false
      }
    },
    chooseCity (val) {
      let that = this
      axios.get(URL.api_name + '/backofficeapi/store/obtainCitiesOrAreas.do', {
        params: {
          province: val
        }
      }).then((res) => {
        that.citys = res.data.data.citys
        if (!that.isFirst) {
          that.formData.city = ''
          that.formData.area = ''
        }
        this.isFirst = false
      }, function (error) {
        console.log(error)
      })
    },
    chooseArea (val) {
      let that = this
      axios.get(URL.api_name + '/backofficeapi/store/obtainCitiesOrAreas.do', {
        params: {
          city: val
        }
      }).then((res) => {
        that.areas = res.data.data.areas
        if (!that.isFirstC) {
          that.formData.area = ''
        }
        that.isFirstC = false
      }, function (error) {
        console.log(error)
      })
    },
    upImgSuccess (response, file, fileList) {
      this.rinkImages = fileList
      console.log(this.rinkImages)
    },
    upImgremove (file, fileList) {
      this.rinkImages = fileList
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
    },
    checkTypes () {
      if (this.signTypes.length <= 0) {
        this.signTypes = ['1']
        this.$message({
          message: '请至少选择一种支付类型',
          type: 'error'
        })
      } else {
        console.log(this.signTypes.length)
      }
    },
    beginTimeRules (val) {
      let date1 = moment(val)
      let date2 = moment(this.formData.endTime)
      this.formData.beginTime = val
      // console.log(date2)
      if (date2 !== 'NaN' && date1.diff(date2) > 0) {
        this.$message({
          message: '活动开始时间不能大于结束时间',
          type: 'error'
        })
        this.formData.beginTime = ''
      }
    },
    endTimeRules (val) {
      let date1 = moment(this.formData.beginTime)
      let date2 = moment(val)
      this.formData.endTime = val
      // console.log(date2)
      if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
        this.$message({
          message: '活动结束时间不能小于开始时间',
          type: 'error'
        })
        this.formData.endTime = ''
      }
    },
    signupEndTimeRules (val) {
      let date1 = moment(val)
      let date2 = moment(this.formData.beginTime)
      // console.log(date2)
      this.formData.signupEndTime = val
      if (date1 !== 'NaN' && date1.diff(date2) >= 0) {
        this.$message({
          message: '活动截止时间不能大于开始时间',
          type: 'error'
        })
        this.formData.signupEndTime = ''
      }
    },
    updateActivity (formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.rinkImages.length <= 0) {
            that.$message({
              message: '请至少上传一张图片',
              type: 'error'
            })
            return false
          }
          if (this.formData.beginTime === undefined || this.formData.endTime === undefined) {
            that.$message({
              message: '部分带*必填项未填写，请完善信息',
              type: 'error'
            })
            return false
          } else {
            this.formData.eventPictures = []
            for (let i = 0; i < that.rinkImages.length; i++) {
              if (that.rinkImages[i].response) {
                that.formData.eventPictures.push({
                  pictureName: that.rinkImages[i].name,
                  pictureUrl: that.rinkImages[i].response.data.pictureUrl
                })
              } else {
                that.formData.eventPictures.push({
                  pictureName: that.rinkImages[i].name,
                  pictureUrl: that.rinkImages[i].url
                })
              }
            }
            console.log(that.formData.eventPictures)
            // 类型转换传输
            that.formData.signType = ''
            let signtypeStr = ''
            if (that.signTypes.length > 0) {
              for (let s = 0; s < that.signTypes.length; s++) {
                signtypeStr = signtypeStr + ',' + that.signTypes[s]
              }
              signtypeStr = signtypeStr.substring(1)
              // console.log(signtypeStr)
            }
            that.formData.signMoney === null ? that.formData.signMoney = 0 : that.formData.signMoney
            that.formData.signPoint === null ? that.formData.signPoint = 0 : that.formData.signPoint
            that.formData.signCourse === null ? that.formData.signCourse = 0 : that.formData.signCourse
            if (that.yz1 === false || that.yz2 === false || that.yz3 === false) {
              return false
            }
            that.isLoading = true
            axios.post(URL.api_name + 'backofficeapi/information/event/update.do', {
              storeId: that.storeId,
              id: that.formData.id,
              status: that.formData.status,
              title: that.formData.title,
              countLimit: that.formData.countLimit,
              province: that.formData.province,
              city: that.formData.city,
              area: that.formData.area,
              address: that.formData.address,
              isOccupy: that.formData.isOccupy,
              signType: signtypeStr,
              eventPictures: that.formData.eventPictures,
              content: that.formData.content,
              beginTime: that.formData.beginTime,
              endTime: that.formData.endTime,
              signupEndTime: that.formData.signupEndTime,
              imageTextIntroduction: that.formData.imageTextIntroduction,
              signMoney: that.formData.signMoney,
              signPoint: that.formData.signPoint,
              signCourse: that.formData.signCourse,
              purchaseNotice: that.formData.purchaseNotice,
              eventCategories: that.productDetailList.concat(this.delType),
              voucher: that.formData.voucher
            }).then((res) => {
              if (res.data.status === 'success') {
                that.$message({
                  message: res.data.message,
                  type: 'success',
                  onClose: function () {
                    that.$router.push({
                      path: '/activity'
                    })
                  }
                })
              } else {
                that.isLoading = false
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
<style lang="less" scoped>
.el-col-6 .el-input{ width:40%; margin:0 5px;}
.el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
.tips{
  font-size: 12px;
  color: rgb(131, 164, 165);
}
</style>
