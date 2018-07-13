<template>
  <div class="update-pass">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="当前账号:">
          {{ formData.mobile }}
        </el-form-item>
        <el-form-item label="原始密码:" prop="password">
          <el-col :span="12">
            <el-input type="password" v-model="formData.password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-col :span="12">
            <el-input type="password" v-model="formData.newPassword"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="再次输入密码:" prop="confirmPassword">
          <el-col :span="12">
            <el-input type="password" v-model="formData.confirmPassword"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="update('formData')" :loading="loading">
            {{ loading ? '正在提交' : '修改' }}
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
  import MD5 from 'md5'
  export default {
    data () {
      return {
        formData: {
          password: '',
          newPassword: '',
          confirmPassword: '',
          mobile: JSON.parse(sessionStorage.getItem('userInfo')).mobilePhone
        },
        rules: {
          password: [
            { required: 'true', message: '请输入原始密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: 'true', message: '请输入新密码', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: 'true', message: '请再次输入新密码', trigger: 'blur' }
          ]
        },
        loading: false
      }
    },
    methods: {
      update (formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.formData.newPassword !== this.formData.confirmPassword) {
              that.$message({
                type: 'error',
                message: '两次输入的新密码不一致'
              })
              return
            }
            that.loading = true
            axios.post(URL.api_name + 'backofficeapi/employee/changePassword.do', {
              newPassword: MD5(this.formData.newPassword),
              oldPassword: MD5(this.formData.password)
            }).then(res => {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '修改成功',
                  onClose: function () {
                    sessionStorage.clear()
                    that.$router.push({
                      path: '/login'
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
              console.log(err)
              that.loading = false
            })
          }
        })
      }
    }
  }
</script>
<style lang="less">

</style>
