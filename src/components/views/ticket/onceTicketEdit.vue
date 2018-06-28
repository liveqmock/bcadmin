<template>
  <div class="once-ticket" v-if="storeInfo">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 售票管理</el-breadcrumb-item>
        <el-breadcrumb-item>单次票</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px" ref="formData" :model="formData" :rules="rules">
        <el-form-item label="票名称:">
          <el-col :span="12">
            <el-input type="text" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <!--<el-form-item label="使用时长:">-->
          <!--<el-col :span="12">-->
            <!--<el-input type="text" v-model="formData.hours"></el-input>-->
          <!--</el-col>-->
        <!--</el-form-item>-->
        <el-form-item label="是否常规票:">
          <el-col :span="12">
            <el-checkbox v-model="formData.isDefault"></el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="价格:">
          <el-col :span="12">
            <el-radio-group v-model="formData.dayType">
              <el-radio label="平日">
                <div class="Zvertical">平日　</div><el-input v-model.number="normalObj.duration" class="inline-input" :disabled="formData.dayType !== '平日'"></el-input><div class="Zvertical">小时</div>
                <div class="Zvertical">营业时间　</div><span class="inline-input">{{ startBusinessTime }} - {{ endBusinessTime }}</span>
                <div class="Zvertical">价格　</div><el-input v-model.number="normalObj.price" class="inline-input" :disabled="formData.dayType !== '平日'"></el-input>
              </el-radio>
              <el-radio label="周末">
                <div class="Zvertical">周末　</div><el-input v-model.number="weekendObj.duration" class="inline-input" :disabled="formData.dayType !== '周末'"></el-input><div class="Zvertical">小时</div>
                <div class="Zvertical">营业时间　</div><span class="inline-input">{{ startBusinessTime }} - {{ endBusinessTime }}</span>
                <div class="Zvertical">价格　</div><el-input v-model.number="weekendObj.price" class="inline-input" :disabled="formData.dayType !== '周末'"></el-input>
              </el-radio>
              <el-radio label="节假日">
                <div class="Zvertical">节假日　</div><el-input v-model.number="holidayObj.duration" class="inline-input" :disabled="formData.dayType !== '节假日'"></el-input><div class="Zvertical">小时</div>
                <div class="Zvertical">营业时间　</div><span class="inline-input">{{ startBusinessTime }} - {{ endBusinessTime }}</span>
                <div class="Zvertical">价格　</div><el-input v-model.number="holidayObj.price" class="inline-input" :disabled="formData.dayType !== '节假日'"></el-input>
              </el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="状态:">
          <el-radio-group v-model="formData.status">
            <el-radio label="有效">有效</el-radio>
            <el-radio label="无效">无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="赠送陪同票张数:" prop="freeCompTicket">
          <el-col :span="4">
            <el-input v-model.number="formData.freeCompTicket"></el-input>
          </el-col>
          <el-col :span="2" style="margin-left: 8px">张</el-col>
        </el-form-item>
        <el-form-item label="规则:">
          <el-col :span="12">
            <el-input v-model="formData.description" type="textarea" :rows="3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submit('formData')">
            {{ loading ? '正在保存' : '保存' }}
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
    import Validate from '@/common/js/validate'
    export default {
      created () {
        this.getTicketInfo()
        // 获取当前门店的资料
        this.getStoreInfo()
      },
      data () {
        return {
          storeInfo: {},
          formData: {},
          loading: false,
          normalObj: {
            duration: '',
            price: ''
          },
          weekendObj: {
            duration: '',
            price: ''
          },
          holidayObj: {
            duration: '',
            price: ''
          },
          rules: {
            freeCompTicket: [
              { validator: Validate.checkInputNumR, trigger: 'blur' }
            ]
          }
        }
      },
      computed: {
        endBusinessTime () {
          if (this.storeInfo && this.storeInfo.endBusinessTime) {
            return this.storeInfo.intercepTime[this.storeInfo.endBusinessTime].text
          } else {
            return ''
          }
        },
        startBusinessTime () {
          if (this.storeInfo && this.storeInfo.startBusinessTime) {
            return this.storeInfo.intercepTime[this.storeInfo.startBusinessTime].text
          } else {
            return ''
          }
        }
      },
      methods: {
        getStoreInfo () {
          let that = this
          axios.get(URL.api_name + 'backofficeapi/store/find.do', {
            params: {
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.storeInfo = res.data.data
            }
          })
        },
        submit (name) {
          this.$refs[name].validate(valid => {
            if (valid) {
              this.addOnceTicket()
            }
          })
        },
        addOnceTicket () {
          if (this.formData.dayType === '平日') {
            this.formData.hours = this.normalObj.duration
            this.formData.price = this.normalObj.price
          } else if (this.formData.dayType === '周末') {
            this.formData.hours = this.weekendObj.duration
            this.formData.price = this.weekendObj.price
          } else if (this.formData.dayType === '节假日') {
            this.formData.hours = this.holidayObj.duration
            this.formData.price = this.holidayObj.price
          }
          // 时长为正整数，价格为正数
          if (this.formData.hours < 0 || (this.formData.hours + '').indexOf('.') > -1) {
            this.$message({
              type: 'error',
              message: '时长必须为正整数',
              duration: 1500
            })
            return
          }
          if (this.formData.price < 0) {
            this.$message({
              type: 'error',
              message: '价格必须为正数',
              duration: 1500
            })
            return
          }
          var that = this
          that.loading = true
          axios.post(URL.api_name + 'backofficeapi/ticket/update/once.do', this.formData).then((res) => {
            if (res.data.status === 'success') {
              that.$message({
                type: 'success',
                message: '修改成功',
                duration: 1000,
                onClose: function () {
                  that.$router.push({
                    path: '/produceTicket'
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
          }).catch((err) => {
            console.log(err)
            that.loading = false
          })
        },
        getTicketInfo () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/ticket/find/once.do', {
            params: {
              id: this.$route.params.oid,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
              if (that.formData.dayType === '平日') {
                that.normalObj.duration = that.formData.hours
                that.normalObj.price = that.formData.price
              } else if (that.formData.dayType === '周末') {
                that.weekendObj.duration = that.formData.hours
                that.weekendObj.price = that.formData.price
              } else if (that.formData.dayType === '节假日') {
                that.holidayObj.duration = that.formData.hours
                that.holidayObj.price = that.formData.price
              }
            }
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .inline-input{
    width: 120px;
  }
  .el-radio{
    padding-bottom: 5px;
  }
  .el-radio+.el-radio{
    margin-left: 0;
  }
  .Zvertical{ display:inline-block; line-height: 36px; height:36px;}
  .el-input{ vertical-align: middle;}
</style>
