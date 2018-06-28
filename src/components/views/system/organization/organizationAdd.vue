<template>
  <div class="menu">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>组织机构</el-breadcrumb-item>
        <el-breadcrumb-item>添加组织机构</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" ref="formData" :rules="rules">
        <el-form-item label="机构名称:" prop="orgName">
          <el-row>
            <el-col :span="12">
              <el-input maxlength="16" type="text" v-model="formData.orgName" placeholder="请输入机构名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item label="机构编码:" required prop="orgCode">
          <el-row>
            <el-col :span="12">
              <el-input type="text" v-model="formData.orgCode" placeholder="请输入机构编码"></el-input>
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="addOrg('formData')" :loading="loading">{{ loading ? '正在保存' : '保存' }}</el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    created () {
    },
    methods: {
      addOrg (formName) {
        var that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.loading = true
            axios.post(URL.api_name + 'backofficeapi/system/organization/create.do', this.formData).then((res) => {
              that.loading = false
              if (res.data.status === 'success') {
                that.$router.push({
                  path: '/organization'
                })
              } else {
                that.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            }).catch((err) => {
              that.loading = false
              console.log(err)
            })
          } else {
            // that.$message({
            //   type: 'error',
            //   message: '表单验证失败，请检查'
            // })
          }
        })
      }
    },
    data () {
      // var checkOrzType = (rule, value, callback) => {
      //   // let num = /^[0-9a-zA-Z]+$/g
      //   let num = /^(?=.*\d.*)(?=.*[a-zA-Z].*).{8,20}$/
      //   if (!value) {
      //     return callback(new Error('机构编码不能为空'))
      //   } else if (!num.test(value)) {
      //     return callback(new Error('编码格式不正确，只能输入数字和字母'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        formData: {
          // orgCode: '',
          orgName: ''
        },
        loading: false,
        rules: {
          orgName: [
            { required: true, message: '机构名称不能为空', trigger: 'blur' }
          ]
          // orgCode: [
          //   { validator: checkOrzType }
          // ]
        }
      }
    }
  }
</script>
<style lang="less">
  .button-group{
    padding: 10px;
  }
</style>
