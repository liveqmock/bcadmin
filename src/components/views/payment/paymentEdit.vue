<template>
  <div class="payment">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 缴费管理</el-breadcrumb-item>
        <el-breadcrumb-item>缴费类目列表</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="缴费名称：" prop="paymentName">
          <el-col :span="12">
            <el-input type="text" v-model="formData.paymentName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="缴费金额：" prop="price">
          <el-col :span="12">
            <el-input v-model.number="formData.price"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="类型描述：" prop="description">
          <el-col :span="12">
            <el-input v-model="formData.description" type="textarea" :rows="4"></el-input>
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
      this.getData()
    },
    data () {
      return {
        formData: {},
        loading: false,
        rules: {
          paymentName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 20, message: '最多输入20个中文字符', trigger: 'blur' }
          ],
          description: [
            { max: 45, message: '最多输入45个中文', trigger: 'blur' }
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
            axios.post(URL.api_name + 'backofficeapi/paymentcategory/update.do', {
              price: that.formData.price,
              description: that.formData.description,
              paymentId: that.formData.paymentId,
              paymentName: that.formData.paymentName,
              storeId: that.storeId
            }).then((res) => {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '保存成功',
                  duration: 500,
                  onClose: function () {
                    that.$router.push({
                      path: '/payment'
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
      getData () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/paymentcategory/search.do', {
          params: {
            id: that.$route.params.pid
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            that.formData = res.data.data
          }
        })
      }
    }
  }
</script>
<style lang="less">

</style
