<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增供应商</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="供应商名称:" prop="supplierName">
          <el-col :span="12">
            <el-input type="text" v-model="formData.supplierName"></el-input>
          </el-col>
        </el-form-item>
        <!--<el-form-item label="供应商编码:" prop="supplierCode">
          <el-col :span="12">
            <el-input type="text" v-model="formData.supplierCode"></el-input>
          </el-col>
        </el-form-item>-->
        <el-form-item label="供应商地址:" prop="supplierAddress">
          <el-col :span="12">
            <el-input type="text" v-model="formData.supplierAddress"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商联系人:" prop="supplierLiaison">
          <el-col :span="12">
            <el-input type="text" v-model="formData.supplierLiaison"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商联系方式:" prop="supplierMobile">
          <el-col :span="12">
            <el-input type="text" v-model="formData.supplierMobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态:" prop="supplierStatus">
          <el-col :span="12">
            <el-select v-model="formData.supplierStatus">
              <el-option label="请选择" value=""></el-option>
              <el-option label="正常供货" value="正常供货"></el-option>
              <el-option label="停供" value="停供"></el-option>
            </el-select>
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
    export default {
      data () {
        return {
          formData: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            supplierAddress: '',
            // supplierCode: '',
            supplierLiaison: '',
            supplierMobile: '',
            supplierName: '',
            supplierStatus: ''
          },
          loading: false,
          rules: {
            supplierAddress: [
              { required: true, message: '供应商地址不能为空', trigger: 'blur' }
            ],
            supplierCode: [
              { required: true, message: '供应商编码不能为空', trigger: 'blur' }
            ],
            supplierLiaison: [
              { required: true, message: '供应商联系人不能为空', trigger: 'blur' }
            ],
            supplierMobile: [
              { required: true, message: '供应商联系方式不能为空', trigger: 'blur' }
            ],
            supplierName: [
              { required: true, message: '供应商名称不能为空', trigger: 'blur' },
              { max: 25, message: '供应商名称最多输入25个字符', trigger: 'blur' }
            ],
            supplierStatus: [
              { required: true, message: '供应商状态不能为空', trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        onSubmit (name) {
          var that = this
          that.$refs[name].validate((valid) => {
            if (valid) {
              that.loading = true
              axios.post(URL.api_name + 'merchandiseapi/supplier/create.do', that.formData).then(res => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '添加成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/supply'
                      })
                    }
                  })
                } else {
                  that.loading = false
                  that.$message({
                    type: 'error',
                    message: res.data.message,
                    duration: 1000
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
            }
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .price{
    text-align: center;
  }
  .color-gry{ color:#999; font-size:12px; margin-left:10px;}
</style>
