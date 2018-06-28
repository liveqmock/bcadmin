<template>
  <el-dialog title="折扣授权"
             :close-on-click-modal="false"
             :show-close="false"
             :visible.sync="authorizeDialog">
    <el-form label-width="100px" :model="form" :rules="rules" ref="authorizeForm">
      <el-form-item label="账户：" prop="mobile">
        <el-col :span="12">
          <el-input auto-complete="off" v-model="form.mobile"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-col :span="12">
          <el-input type="password" auto-complete="off" v-model="form.password"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="折扣类型：" prop="discountedType">
        <el-col :span="6">
          <el-select v-model="form.discountedType">
            <el-option v-for="s in discountTypeLists" :key="s.systemCode"
                       :label="s.systemName"
                       :value="s.systemCode"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="备注：" prop="discountedNotes">
        <el-col :span="12">
          <el-input type="textarea" v-model="form.discountedNotes"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="authorize('authorizeForm')" :loading="authorizing">
          {{authorizing ? '授权中...' : '授权'}}
        </el-button>
        <el-button type="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import MD5 from 'md5'
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    name: 'authorize',
    created () {
      this.getDiscountTypeLists()
    },
    props: {
      authorizeDialog: {
        type: Boolean,
        default: false
      },
      exemption: {
        type: Boolean,
        default: false
      },
      orderNo: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        authorizing: false,
        form: {
          mobile: '',
          password: '',
          discountedNotes: '',
          discountedType: ''
        },
        rules: {
          mobile: [
            { required: true, message: '请输入账户', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          discountedType: [
            { required: true, message: '折扣类型不为空', trigger: 'change' }
          ],
          discountedNotes: [
            { required: true, message: '备注字段不能为空', trigger: 'blur' }
          ]
        },
        authorizer: '',
        discountTypeLists: []
      }
    },
    methods: {
      getDiscountTypeLists () {
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'course_discounted_type'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.discountTypeLists = res.data.data
          }
        })
      },
      authorize (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            axios.post(URL.api_name + 'backofficeapi/employee/discount-authority/search.do', {
              mobile: this.form.mobile,
              password: MD5(this.form.password),
              discountedNotes: this.form.discountedNotes,
              discountedType: this.form.discountedType,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }).then((res) => {
              if (res.data.status === 'success') {
                if (res.data.data.discountAuthority === '0') {
                  this.$message({
                    type: 'error',
                    message: '该账户没有折扣权限',
                    duration: 1500
                  })
                } else if (res.data.data.discountAuthority === '1') {
                  if (this.exemption) {
                    // 免单
                    this.exemptionAction()
                  } else {
                    // 只授权
                    this.$message({
                      type: 'success',
                      message: res.data.message,
                      duration: 1500
                    })
                  }
                  this.authorizer = res.data.data.discountedType
                  this.$emit('authorize', {
                    authorizer: res.data.data.authorizer,
                    hasPermission: 1
                  })
                }
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            })
          }
        })
      },
      // 免单操作
      exemptionAction () {
        axios.get(URL.api_name + 'backofficeapi/course/order/join/freeSingle.do', {
          params: {
            orderId: this.orderNo,
            authorizer: this.authorizer
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.$message({
              type: 'success',
              message: res.data.message
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      cancel () {
        this.$emit('cancelAuthorize', !this.authorizeDialog)
      }
    }
  }
</script>
