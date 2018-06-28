<template>
  <div class="employee-add">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="员工姓名" prop="name">
          <el-col :span="12">
            <el-input type="text" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <el-col :span="12">
            <el-select placeholder="请选择" v-model="formData.role">
              <el-option v-for="(r, index) in roleList"
                         :key="index"
                         :label="r.roleName"
                         :value="r.roleId">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="所属门店：" prop="storeArr">
          <el-checkbox-group v-model="formData.storeArr">
            <el-checkbox v-for="(s, i) in storeArrList" :key="i" :label="s.id">{{ s.storeName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="职务：" prop="position">
          <el-col :span="12">
            <el-select placeholder="请选择" v-model="formData.position">
              <el-option v-for="(e, index) in employDuty"
                         :key="index"
                         :label="e.systemName"
                         :value="e.systemCode">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="等级：" v-show="formData.position === 'coach'">
          <el-col :span="12">
            <el-select placeholder="请选择" v-model="formData.coachGrade" @change="getCoachCourse">
              <el-option v-for="(c, i) in coachLevel"
                         :key="i"
                         :label="c.systemName"
                         :value="c.systemCode"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="员工工号：" prop="employeeNo">
          <el-col :span="12">
            <el-input type="text" v-model="formData.employeeNo"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="联系手机：" prop="mobile">
          <el-col :span="12">
            <el-input type="text" v-model="formData.mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="登录密码：">
          <el-col :span="12">
            <el-input type="password" :disabled="true" v-model="formData.password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="还原默认：">
          <el-button type="primary" size="small" @click="backDefault">还原默认</el-button>
        </el-form-item>
        <el-form-item label="邮箱地址：" prop="email">
          <el-col :span="12">
            <el-input type="text" v-model="formData.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别：" prop="gender">
          <el-col :span="12">
            <el-select v-model="formData.gender" placeholder="请选择">
              <el-option label="男" value="m"></el-option>
              <el-option label="女" value="f"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="居住地：">
          <el-col :span="12">
            <el-input type="text" v-model="formData.address"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="生日：">
          <el-date-picker
            v-model="formData.birthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="照片：">
          <el-col :span="12">
            <el-upload
              class="upload-demo"
              :action="imgUploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
              :headers="uploadHeader"
              :before-upload="beforeUpload"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2Mb(推荐尺寸W264 x H264px)</div>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="介绍资料：">
          <el-col :span="12">
            <el-input type="textarea" :rows="4" v-model="formData.introduce"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="执教年限：" v-show="formData.position === 'coach'">
          <el-col :span="12">
            <el-input v-model.number="formData.coachYears"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否有折扣权限：" prop="discountAuthority">
          <el-col :span="12">
            <el-radio-group v-model="formData.discountAuthority">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="休息时间：">
          <el-checkbox-group v-model="formData.holidayArr">
            <el-checkbox label="1">周一</el-checkbox>
            <el-checkbox label="2">周二</el-checkbox>
            <el-checkbox label="3">周三</el-checkbox>
            <el-checkbox label="4">周四</el-checkbox>
            <el-checkbox label="5">周五</el-checkbox>
            <el-checkbox label="6">周六</el-checkbox>
            <el-checkbox label="7">周日</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="佣金公式：">
          <el-col :span="8">
            <el-select placeholder="请选择" v-model="formData.comId">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(c, i) in comIds"
                         :key="i"
                         :label="c.formularname"
                         :value="c.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择课程：" v-show="formData.position === 'coach'">
          <el-col :span="18">
            <el-checkbox-group v-model="formData.courseArr">
              <el-checkbox v-for="(c, i) in courseList" :key="i" :label="c.id">{{ c.courseName }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" :loading="isLoading" @click="updateEmployee('formData')">
            {{ isLoading ? '正在保存' : '保存' }}
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
  import MD5 from 'md5'
  export default {
    created () {
      this.getRoleList()
      this.getcoachLevel()
      this.getDetail()
      this.getDuty()
      this.getStoreArr()
      this.getChargeList()
    },
    data () {
      var checkRole = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('角色不能为空'))
        } else {
          callback()
        }
      }
      var checkDuty = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('职务不能为空'))
        } else {
          callback()
        }
      }
      var checkMobile = (rule, value, callback) => {
        let myreg = /^1[3-9]\d{9}$/
        if (!value) {
          return callback(new Error('手机号不能为空'))
        } else if (!myreg.test(value)) {
          return callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
      var checkEmail = (rule, value, callback) => {
        let myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (value) {
          if (!myreg.test(value)) {
            return callback(new Error('邮箱格式有误'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var checkYear = (rule, value, callback) => {
        let nums = /^[1-9]\d*(?!.*\.)/
        if (!nums.test(value)) {
          return callback(new Error('格式不正确，请输入正整数'))
        } else {
          callback()
        }
      }
      var checkStore = (rule, value, callback) => {
        if (value && value.length === 0) {
          return callback(new Error('所属门店不能为空'))
        } else {
          callback()
        }
      }
      var checkEmployeeNo = (rule, value, callback) => {
        let pattern = /^[0-9]{6}$/
        if (!pattern.test(value)) {
          return callback(new Error('员工工号由6位数字组合'))
        } else {
          callback()
        }
      }
      return {
        formData: {},
        fileList: [],
        course: '',
        isFirseIn: true,
        Dialog: false,
        selected: false,
        isLoading: false,
        DialogList: [],
        trueList: [],
        showList: [],
        postList: [],
        imgUploadUrl: URL.api_name + 'backofficeapi/employee/upload.do',
        roleList: [],
        comIds: [],
        coachLevel: [],
        employDuty: [],
        courseList: [],
        storeArrList: [],
        firstEdit: true,
        rules: {
          storeArr: [
            { required: true, validator: checkStore, trigger: 'change' }
          ],
          employeeNo: [
            { required: true, message: '员工工号不能为空', trigger: 'blur' },
            { validator: checkEmployeeNo, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { max: 32, message: '长度不能超过32个字符', trigger: 'blur' }
          ],
          role: [
            { validator: checkRole, trigger: 'change' }
          ],
          position: [
            { validator: checkDuty, trigger: 'change' }
          ],
          mobile: [
            { validator: checkMobile, trigger: 'blur' }
          ],
          coachYears: [
            { validator: checkYear }
          ],
          email: [
            { validator: checkEmail, trigger: 'blur' }
          ],
          gender: [
            { required: true, message: '性别不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      getCoachCourse (val) {
        // 切换教练等级时，手动清空之前选择的课程
        if (!this.firstEdit) {
          this.formData.courseArr = []
        }
        this.firstEdit = false
        // 教练等级有值时获取教练课程
        if (val) {
          this.getCourseList(val)
        }
      },
      getCourseList (coachGrade) {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/course/coach/list.do', {
          params: {
            coachGrade: coachGrade,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.courseList = res.data.data
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
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
        if (response.status === 'success') {
          this.formData.imgUrl = response.data.pictureUrl
          this.fileList = fileList
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
      getChargeList () {
        // 获取佣金公式列表
        var that = this
        axios.get(URL.api_name + 'backofficeapi/employee/formular/search.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            pageSize: 1000,
            pageNum: 1
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.comIds = res.data.data.list
          }
          console.log(that.comIds)
        })
      },
      updateEmployee (formName) {
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.formData.birthday) {
              this.formData.birthday = moment(this.formData.birthday).format('YYYY-MM-DD')
            } else {
              this.formData.birthday = ''
            }
            that.isLoading = true
            axios.post(URL.api_name + 'backofficeapi/employee/update.do', that.formData).then((res) => {
              if (res.data.status === 'success') {
                that.$message({
                  message: res.data.message,
                  type: 'success',
                  duration: 500,
                  onClose: function () {
                    that.$router.push({
                      path: '/employee'
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
          } else {}
        })
      },
      getDetail () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/employee/details.do', {
          params: {
            id: this.$route.params.eid,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
            // 判断是否上传过图片
            if (that.formData.imgUrl && that.formData.imgUrl !== '') {
              that.fileList.push({
                name: that.formData.imgName,
                url: that.formData.imgUrl
              })
            }
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      backDefault () {
        var that = this
        let pass = MD5(this.formData.mobile.toString().substring(5, 11))
        axios.get(URL.api_name + 'backofficeapi/employee/updatePassword.do', {
          params: {
            id: this.$route.params.eid,
            newPassword: pass
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.$message({
              message: res.data.message,
              type: 'success',
              duration: 1000
            })
          } else {
            that.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getRoleList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/role/list.do', {
          params: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.roleList = res.data.data.list
          }
        })
      },
      getcoachLevel () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'coach_grade'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.coachLevel = res.data.data
          }
        })
      },
      getDuty () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'employee_position'
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.employDuty = res.data.data
          }
        })
      },
      getStoreArr () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/employee/searchstores.do', {}).then((res) => {
          if (res.data.status === 'success') {
            that.storeArrList = res.data.data
          }
        })
      }
    },
    computed: {
      uploadHeader () {
        return {
          authtoken: JSON.parse(sessionStorage.getItem('userInfo')).sessionId
        }
      },
      storeArrList_1 () {
        if (JSON.parse(sessionStorage.getItem('userInfo')).stores) {
          return JSON.parse(sessionStorage.getItem('userInfo')).stores
        } else {
          return []
        }
      }
    }
  }
</script>
<style lang="less">
  .employee-add{
    .el-select{
      display: block;
    }
    .el-checkbox+.el-checkbox{
      margin-left: 0;
    }
    .el-checkbox{
      margin-right: 15px;
    }
  }
</style>
