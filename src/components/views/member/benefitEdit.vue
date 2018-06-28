<template>
  <div class="edit-benefit">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员权益</el-breadcrumb-item>
        <el-breadcrumb-item>修改</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="140px">
        <el-form-item label="会员等级:">
          <el-col :span="12">
            <el-input type="text" v-model="formData.level" :disabled="true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item v-for="(item, index) in formData.privilegeList" :key="item.id">
          <el-row v-if="item.code === 'SINGLE_TICKET'">
            <span class="my-label">{{ item.name }}：</span>
            <el-col :span="3">
              <el-input v-model.number="item.discount"></el-input>
            </el-col>
            <el-col :span="1" class="tc">折</el-col>
            <!--<el-col :span="3" class="tc">单次票折扣数</el-col>
            <el-col :span="2">
              <el-input v-model.number="item.times"></el-input>
            </el-col>
            <el-col :span="1" class="tc">张</el-col>-->
          </el-row>
          <el-row v-else-if="item.code === 'CONTINUED_EDUCATION'">
            <span class="my-label">课程折扣：</span>
            <el-col :span="3">
              <el-input v-model.number="item.discount"></el-input>
            </el-col>
            <el-col :span="1" class="tc">折</el-col>
          </el-row>
          <el-row v-else-if="item.code === 'ACTIVITY'">
            <span class="my-label">活动折扣：</span>
            <el-col :span="3">
              <el-input v-model.number="item.discount"></el-input>
            </el-col>
            <el-col :span="1" class="tc">折</el-col>
          </el-row>
          <el-row v-else>
            <span class="my-label">{{ item.name }}：</span>
            <el-col :span="3">
              <el-input v-model.number="item.discount"></el-input>
            </el-col>
            <el-col :span="1" class="tc">折</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="权益说明：">
          <el-col :span="12">
            <el-input :rows="5" type="textarea" v-model="formData.content"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="　">
          <el-button type="primary" @click="updateBenefit" :loading="isLoading">{{ isLoading ? '正在保存' : '保存' }}</el-button>
          <el-button @click="cancel">取消</el-button>
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
        this.getBenefitDetail()
      },
      data () {
        var checkNumber = (rule, value, callback) => {
          let nums = /^[1-9]\d*(?!.*\.)/
          if (!nums.test(value)) {
            return callback(new Error('只能输入数字'))
          } else {
            callback()
          }
        }
        // var checkSort = (rule, value, callback) => {
        //   // 匹配0-10 只有1位小数的正则
        //   let nums = /^(\d(\.\d)?|10)$/
        //   if (value) {
        //     console.log(value)
        //     if (value > 9999) {
        //       return callback(new Error('最多输入四位数'))
        //     } else {
        //       callback()
        //     }
        //   } else {
        //     callback()
        //   }
        // }
        return {
          formData: {
          },
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          isLoading: false,
          rules: {
            amount: [
              { validator: checkNumber }
            ]
          }
        }
      },
      methods: {
        getBenefitDetail () {
          var that = this
          axios.get(URL.api_name + 'memberapi/member/level/detail.do', {
            params: {
              level: this.$route.params.level,
              storeId: that.storeId
            }
          }).then((response) => {
            if (response.data.status === 'success') {
              that.formData = response.data.data
            } else {
              that.$message({
                message: response.data.message,
                type: 'error'
              })
            }
          }).catch((error) => {
            console.log(error)
          })
        },
        updateBenefit () {
          console.log(this.formData.privilegeList)
          var that = this
          // 判断折扣必须大于0小于10
          for (let p of this.formData.privilegeList) {
            if (p.discount < 0 || p.discount > 10) {
              this.$message({
                type: 'error',
                message: '折扣值必须大于等于0小于10'
              })
              return
            }
          }
          that.isLoading = true
          axios.post(URL.api_name + 'memberapi/member/level/update.do', that.formData).then((response) => {
            that.isLoading = false
            if (response.data.status === 'success') {
              this.$message({
                message: response.data.message,
                type: 'success'
              })
              that.$router.push({
                path: '/memberBenefit'
              })
            }
          }).catch((err) => {
            that.isLoading = false
            console.log(err)
          })
        },
        cancel () {
          this.$router.go('-1')
        }
      }
    }
</script>
<style lang="less" scoped>
  .my-label{
    float: left;
    display: inline-block;
    margin-right: 5px;
    width:100px;
  }
  .el-form-item{ margin:0 0 0 0; padding: 10px 0 0 0;}
</style>
