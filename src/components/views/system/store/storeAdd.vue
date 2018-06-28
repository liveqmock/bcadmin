<template>
  <div class="menu">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>门店管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加门店</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" ref="formData" :rules="rules">
        <el-form-item label="门店名称:" prop="storeName">
          <el-row>
            <el-col :span="12">
              <el-input type="text" v-model="formData.storeName" placeholder="请输入门店名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <!--<el-form-item label="门店编码:" required prop="storeCode">
          <el-row>
            <el-col :span="12">
              <el-input type="text" v-model="formData.storeCode" :disable="true" placeholder="请输入门店编码"></el-input>
            </el-col>
          </el-row>
        </el-form-item>-->
        <el-form-item label="所属机构" prop="orgId">
          <el-select v-model="formData.orgId">
            <el-option v-for="(o, i) in orgList" :key="i" :label="o.orgName" :value="o.id"></el-option>
          </el-select>
        </el-form-item>
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
      this.getOrgList()
    },
    methods: {
      addOrg (formName) {
        var that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.loading = true
            axios.post(URL.api_name + 'backofficeapi/store/create.do', this.formData).then((res) => {
              that.loading = false
              if (res.data.status === 'success') {
                let id = res.data.data
                axios.get(URL.api_name + 'memberapi/member/level/add.do', {
                  params: {
                    storeId: id
                  }
                }).then(resss => {
                  that.$message({
                    type: 'success',
                    message: '门店添加成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/store'
                      })
                    }
                  })
                }).catch(errors => {
                  console.log(errors)
                })
                // that.$router.push({
                //   path: '/store'
                // })
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
            that.$message({
              type: 'error',
              message: '表单验证失败，请检查'
            })
          }
        })
      },
      getOrgList () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/organization/byparentid.do', {
          params: {
            parentId: 0,
            pageSize: 1000,
            pageNum: 1
          }
        }).then((res) => {
          that.orgList = res.data.data.list
        })
      }
    },
    data () {
      var checkOrg = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('所属机构不能为空'))
        } else {
          callback()
        }
      }
      // var checkNumber = (rule, value, callback) => {
      //   let nums = /^[0-9a-zA_Z]+$/
      //   if (!value) {
      //     return callback(new Error('不能为空'))
      //   } else if (!nums.test(value)) {
      //     return callback(new Error('格式不正确，只能输入数字和字母，最长为4位'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        formData: {
          storeName: '',
          storeCode: '',
          orgId: ''
        },
        orgList: [],
        loading: false,
        rules: {
          storeName: [
            { required: true, message: '门店名称不能为空', trigger: 'blur' },
            { max: 25, message: '长度不能超过25个汉字', trigger: 'blur' }
          ],
          // storeCode: [
          //   { validator: checkNumber, trigger: 'change' }
          // ],
          orgId: [
            { validator: checkOrg, trigger: 'change' }
          ]
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
