<template>
  <div class="payment">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 缴费管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费类型管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加类别</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="业务名称：" prop="typeName">
          <el-col :span="12">
            <el-input type="text" v-model="formData.typeName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="隶属类别：" prop="dictId">
          <el-col :span="12">
            <el-select v-model="formData.dictId">
              <el-option v-for="d in departmentNames" :key="d.id" :label="d.systemName" :value="d.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="类型描述：" prop="typeDes">
          <el-col :span="12">
            <el-input v-model="formData.typeDes" type="textarea" :rows="4"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-col :span="12">
            <el-input v-model="formData.remarks" type="textarea" :rows="4"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="save('formData')">
            {{ loading ? '正在保存' : '保存' }}
          </el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getDepartmentName()
    },
    data () {
      var checkDictId = (rule, value, callback) => {
        if (value === '' || value === null) {
          return callback(new Error('隶属类别不能为空'))
        } else {
          return callback()
        }
      }
      return {
        formData: {
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          typeName: '',
          typeDes: '',
          remarks: '',
          dictId: ''
        },
        departmentNames: [],
        loading: false,
        rules: {
          typeName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 20, message: '最多输入20个字符', trigger: 'blur' }
          ],
          typeDes: [
            { max: 45, message: '最多输入45个字符', trigger: 'blur' }
          ],
          dictId: [
            { required: true, validator: checkDictId, trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      save (name) {
        var that = this
        this.$refs[name].validate((valid) => {
          if (valid) {
            that.loading = true
            let dictName
            for (let d of this.departmentNames) {
              if (d.id === this.formData.dictId) {
                dictName = d.systemName
                break
              }
            }
            axios.post(URL.api_name + 'backofficeapi/paymenttype/addPaymentType.do', {
              storeId: JSON.parse(sessionStorage.getItem('store')).k,
              typeName: this.formData.typeName,
              typeDes: this.formData.typeDes,
              remarks: this.formData.remarks,
              dictId: this.formData.dictId,
              dictName: dictName
            }).then((res) => {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '创建成功',
                  duration: 500,
                  onClose: function () {
                    that.$router.push({
                      path: '/paymentType'
                    })
                  }
                })
              } else {
                that.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            }).catch((err) => {
              console.log(err)
              that.loading = false
            })
          }
        })
      },
      getDepartmentName () {
        var that = this
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'departmentName',
            pageSize: 100
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.departmentNames = res.data.data
          }
        })
      }
    }
  }
</script>
<style lang="less">

</style
