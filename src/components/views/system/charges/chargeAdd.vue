<template>
  <div class="charge-add">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>佣金管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加公式</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="公式名称：" prop="formularname">
          <el-col :span="12">
            <el-input type="text" v-model="formData.formularname"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="佣金累加：">
          <el-row>
            <el-col :span="12">
              <el-radio-group v-model="formData.formulartype" >
                <el-radio class="radio" label="course_amount">按课程价值计算</el-radio>
                <el-radio class="radio" label="sale_amount">按销售金额计算</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <div class="tabPanel">
            <el-row v-show="formData.formulartype === 'course_amount'">
              <el-col style="width: 65px">
                <p>默认比例</p>
              </el-col>
              <el-col :span="4">
                <el-input v-model.number="formData.ratioDefault1"></el-input>
              </el-col>
              <el-col :span="1" style="text-align: center">%</el-col>
              <el-col :span="2">
                <el-button type="small" icon="plus" @click="addLine(1)"></el-button>
              </el-col>
            </el-row>
            <el-row v-show="formData.formulartype === 'sale_amount'">
              <el-col style="width: 65px">
                <p>默认比例</p>
              </el-col>
              <el-col :span="4">
                <el-input v-model.number="formData.ratioDefault2"></el-input>
              </el-col>
              <el-col :span="1" style="text-align: center">%</el-col>
              <el-col :span="2">
                <el-button type="small" icon="plus" @click="addLine(2)"></el-button>
              </el-col>
            </el-row>
            <el-row v-for="(c, i) in employeeFormularDetails1" :key="i" v-show="formData.formulartype === 'course_amount'">
              <el-col style="width: 65px">
                当月满
              </el-col>
              <el-col :span="4">
                <el-input v-model.number="c.min"></el-input>
              </el-col>
              <el-col :span="1" style="text-align: center">课时,</el-col>
              <el-col style="width: 65px">佣金比例</el-col>
              <el-col :span="4">
                <el-input v-model.number="c.percent"></el-input>
              </el-col>
              <el-col :span="1" style="text-align: center">%</el-col>
              <el-col :span="2">
                <el-button type="small" icon="minus" @click="minusLine(1, c)"></el-button>
              </el-col>
            </el-row>
            <el-row v-for="(c, i) in employeeFormularDetails2" :key="i" v-show="formData.formulartype === 'sale_amount'">
              <el-col style="width: 65px">
                当月满
              </el-col>
              <el-col :span="4">
                <el-input v-model.number="c.min"></el-input>
              </el-col>
              <el-col :span="1" style="text-align: center">金额,</el-col>
              <el-col style="width: 65px">佣金比例</el-col>
              <el-col :span="4">
                <el-input v-model.number="c.percent"></el-input>
              </el-col>
              <el-col :span="1" style="text-align: center">%</el-col>
              <el-col :span="2">
                <el-button type="small" icon="minus" @click="minusLine(2, c)"></el-button>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="计算方式：">
          <el-radio-group v-model="formData.caltype" >
            <el-radio class="radio" :label="0">按总额算</el-radio>
            <el-radio class="radio" :label="1">按阶梯算</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isLoading" @click="addCharge('formData')">
            {{ isLoading ? '正在保存' : '保存' }}
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
    import Utils from '@/common/js/Utils'
    export default {
      data () {
        return {
          isLoading: false,
          formData: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            formularname: '',
            formulartype: 'course_amount',
            ratioDefault1: '',
            ratioDefault2: '',
            caltype: 0
          },
          employeeFormularDetails1: [],
          employeeFormularDetails2: [],
          radio: '1',
          rules: {
            formularname: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        addLine (type) {
          if (type === 1) {
            // 增加按课程价值计算
            this.employeeFormularDetails1.push({
              min: '',
              percent: ''
            })
          } else if (type === 2) {
            // 增加按佣金比例计算
            this.employeeFormularDetails2.push({
              min: '',
              percent: ''
            })
          }
        },
        minusLine (type, item) {
          if (type === 1) {
            // 减少按课程计算
            this.employeeFormularDetails1.splice(this.employeeFormularDetails1.indexOf(item), 1)
          } else if (type === 2) {
            // 减少按金额计算
            this.employeeFormularDetails2.splice(this.employeeFormularDetails1.indexOf(item), 1)
          }
        },
        addCharge (formName) {
          let that = this
          // 课时是正整数
          let courseReg = /^(([1-9]\d*)|0)$/
          let reg = /^(([1-9]\d?)|100|0|([1-9]\d?\.\d+))$/
          if (this.formData.formulartype === 'course_amount') {
            if (!reg.test(this.formData.ratioDefault1)) {
              this.$message({
                type: 'error',
                message: '默认比例值请输入0~100之间的数字'
              })
              return
            }
            for (let c of this.employeeFormularDetails1) {
              if (c.min && !courseReg.test(c.min)) {
                this.$message({
                  type: 'error',
                  message: '课时请输入正整数'
                })
                return
              } else if (c.percent && !reg.test(c.percent)) {
                this.$message({
                  type: 'error',
                  message: '佣金比例值请输入0~100之间的数字'
                })
                return
              } else if (c.min === '' || c.percent === '') {
                this.$message({
                  type: 'error',
                  message: '输入框不能为空值'
                })
                return
              }
            }
            // 当月满X金额不能重复
            if (Utils.hasRepeat(this.employeeFormularDetails1)) {
              this.$message({
                type: 'error',
                message: '课时不能重复'
              })
              return
            }
          } else if (this.formData.formulartype === 'sale_amount') {
            if (!reg.test(this.formData.ratioDefault2)) {
              this.$message({
                type: 'error',
                message: '比例值请输入0~100之间的数字'
              })
              return
            }
            for (let c of this.employeeFormularDetails2) {
              if (c.min && !courseReg.test(c.min)) {
                this.$message({
                  type: 'error',
                  message: '课时请输入正整数'
                })
                return
              } else if (c.percent && !reg.test(c.percent)) {
                this.$message({
                  type: 'error',
                  message: '佣金比例值请输入0~100之间的数字'
                })
                return
              } else if (c.min === '' || c.percent === '') {
                this.$message({
                  type: 'error',
                  message: '输入框不能为空值'
                })
                return
              }
            }
            // 当月满X金额不能重复
            if (Utils.hasRepeat(this.employeeFormularDetails2)) {
              this.$message({
                type: 'error',
                message: '金额不能重复'
              })
              return
            }
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              that.isLoading = true
              let ratioDefault = ''
              let list = []
              if (this.formData.formulartype === 'course_amount') {
                ratioDefault = this.formData.ratioDefault1
                list = this.employeeFormularDetails1
              } else if (this.formData.formulartype === 'sale_amount') {
                ratioDefault = this.formData.ratioDefault2
                list = this.employeeFormularDetails2
              }
              axios.post(URL.api_name + 'backofficeapi/employee/formular/create.do', {
                formularname: this.formData.formularname,
                formulartype: this.formData.formulartype,
                ratioDefault: ratioDefault,
                storeId: JSON.parse(sessionStorage.getItem('store')).k,
                employeeFormularDetails: list,
                caltype: this.formData.caltype
              }).then((res) => {
                if (res.data.status === 'success') {
                  that.$message({
                    message: res.data.message,
                    type: 'success'
                  })
                  that.$router.push({
                    path: '/charges'
                  })
                } else {
                  that.isLoading = false
                  that.$message({
                    message: res.data.message,
                    type: 'error'
                  })
                }
              }).catch((error) => {
                that.isLoading = false
                console.log(error)
              })
            }
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .list-area{
    border: 1px solid #ccc;
    padding: 10px;
  }
</style>
