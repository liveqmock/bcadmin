<template>
  <div class="login-wrap">
    <div class="login-content">
      <h1 class="login-title">冰纷万象管理后台</h1>
      <div class="login-from">
        <el-form :model="formData" :rules="rules" ref="formData" label-width="0px">
          <el-form-item prop="name">
            <el-input type="text" placeholder="请输入用户名" v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码"
                      v-model="formData.password"
                      v-on:keyup.enter.native="login('formData')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="isLogin" type="primary" class="login-btn" v-on:click="login('formData')">
              {{ isLogin ? '登录中' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 下载链接 -->
    <img v-if="isProd" src="../../../assets/androidDownload_wia.png" class="android-download">
    <img v-if="!isProd" src="../../../assets/androidDownload_wiadev.png" class="android-download">
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
          name: '',
          password: ''
        },
        rules: {
          name: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        isLogin: false
      }
    },
    computed: {
      isProd () {
        if (location.href.indexOf('wiadev') > -1) {
          return false
        }
        return true
      }
    },
    methods: {
      login (formName) {
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.isLogin = true
            axios.post(URL.api_name + 'backofficeapi/login.do', {
              employNo: that.formData.name,
              passWord: MD5(that.formData.password),
              // passWord: that.formData.password,
              clientType: 'M'
            }).then((res) => {
              if (res.data.status === 'success') {
                sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))
                // 默认登陆后进入第一个门店
                if (res.data.data.stores && res.data.data.stores.length > 0) {
                  sessionStorage.setItem('store', JSON.stringify(res.data.data.stores[0]))
                } else {
                  // 如果用户没有门店,手动设置当前门店为空，防止页面取门店报错
                  let obj = {
                    k: '',
                    v: ''
                  }
                  sessionStorage.setItem('store', JSON.stringify(obj))
                }
                that.$router.push({
                  path: '/home'
                })
              } else {
                that.isLogin = false
                that.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            }).catch((err) => {
              console.log(err)
              that.isLogin = false
              that.$message({
                type: 'error',
                message: '登录失败'
              })
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style scoped>
  .android-download{
    position: absolute;
    right: 100px;
    top: 100px;
  }
  .login-wrap{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(56,157,170, .8);
    color: #fff;
  }
  .login-content{
    position: absolute;
    margin-top: -200px;
    top: 50%;
    left: 50%;
    margin-left: -190px;
  }
  .login-from{
    width: 300px;
    margin: 0 auto 0 auto;
    background-color: #fff;
    padding: 40px 40px 20px 40px;
    border-radius: 5px;
  }
  .login-btn{
    width: 100%;
    text-align: center;
  }
  .login-title{
    text-align: center;
    font-size: 30px;
    padding-bottom: 40px;
  }
  .errorMsg{
    color: #ff4949;
  }
</style>
