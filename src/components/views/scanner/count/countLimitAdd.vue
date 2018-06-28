<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 扫描器管理</el-breadcrumb-item>
        <el-breadcrumb-item>闸机过闸次数</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <!--<el-form-item label="所属门店:" prop="storeId">
          <el-col :span="12">
            <el-select v-model="formData.storeId">
              <el-option v-for="(s, i) in storeArrList" :key="i" :label="s.storeName" :value="s.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>-->
        <el-form-item label="票类型:" prop="name">
          <el-col :span="12">
            <el-select v-model="formData.name">
              <el-option label="单次票" value="单次票实例"></el-option>
              <el-option label="陪同票" value="陪同票实例"></el-option>
              <el-option label="练习票" value="练习票实例"></el-option>
              <el-option label="礼券" value="礼券实例"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="次数:" prop="times">
          <el-col :span="12">
            <el-input type="text" v-model.number="formData.times"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述:">
          <el-col :span="12">
            <el-input :rows="4" type="textarea" v-model="formData.description"></el-input>
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
        var checkTimes = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('次数不能为空'))
          } else if (typeof value !== 'number') {
            return callback(new Error('请输入数字'))
          } else {
            callback()
          }
        }
        return {
          formData: {
            description: '',
            times: '',
            name: '',
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            storeName: '',
            passType: ''
          },
          loading: false,
          rules: {
            times: [
              { required: true, validator: checkTimes, trigger: 'blur' }
            ],
            name: [
              { required: true, message: '票类型不能为空', trigger: 'blur' },
              { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
            ],
            description: [
              { required: true, message: '描述不能为空', trigger: 'blur' },
              { max: 300, message: '长度不能超过300个字符', trigger: 'blur' }
            ]
          }
        }
      },
      computed: {
        comPassType () {
          if (this.formData.name === '单次票实例') {
            return 'once'
          } else if (this.formData.name === '陪同票实例') {
            return 'company'
          } else if (this.formData.name === '练习票实例') {
            return 'exercise'
          } else if (this.formData.name === '礼券实例') {
            return 'coupongift'
          }
          return ''
        }
      },
      methods: {
        getStoreArr () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/store/search.do', {
            params: {
              pageNum: 1,
              pageSize: 1000
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.storeArrList = res.data.data.list
            }
          })
        },
        onSubmit (name) {
          var that = this
          that.$refs[name].validate((valid) => {
            if (valid) {
              that.loading = true
              that.formData.passType = that.comPassType
              axios.post(URL.api_name + 'backofficeapi/pass/limit/create.do', that.formData).then(res => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '添加成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/countLimit'
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
</style>
