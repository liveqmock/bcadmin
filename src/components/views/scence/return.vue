<template>
  <div class="return-borrow">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 现场管理</el-breadcrumb-item>
        <el-breadcrumb-item>借/还鞋</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-row>
        <el-col :span="12" class="area">
          <!-- 借鞋 -->
          <div class="row borrow">
            <el-input :autoFocus="true"
                      v-model="bCode"
                      type="text"
                      placeholder="获取二维票据信息"
                      @keyup.enter.native="getBorrowDetail"></el-input>
          </div>
          <div class="row">
            <span class="label">票据类型:</span>
            <p class="text">{{ borrowDetail.whoimi }}</p>
          </div>
          <div class="row">
            <span class="label">票据编号:</span>
            <p class="text">{{ borrowDetail.code }}</p>
          </div>
          <div class="row">
            <span class="label">借取状态:</span>
            <p class="text">{{ borrowStatus }}</p>
          </div>
          <div class="row shoeSize">
            <span class="label">鞋码信息:</span>
            <p class="text">
              <el-input @keyup.enter.native="borrowShoes"
                        v-model.number="borrowDetail.shoeSize"
                        placeholder="请输入鞋码信息"></el-input>
            </p>
          </div>
          <div class="row">
            <el-button type="primary" @click="borrowShoes">
              {{ borrowLoading ? '正在提交' : '借 鞋' }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="12" class="area">
          <!-- 还鞋 -->
          <div class="row return">
            <el-input v-model="rCode"
                      type="text"
                      placeholder="获取二维票据信息"
                      @keyup.enter.native="getReturnDetail"></el-input>
          </div>
          <div class="row">
            <span class="label">票据类型:</span>
            <p class="text">{{ returnDetail.whoimi }}</p>
          </div>
          <div class="row">
            <span class="label">票据编号:</span>
            <p class="text">{{ returnDetail.code }}</p>
          </div>
          <div class="row">
            <span class="label">借取状态:</span>
            <p class="text">{{ returnStatus }}</p>
          </div>
          <div class="row">
            <span class="label">鞋码信息:</span>
            <p class="text">{{ returnDetail.shoeSize }}</p>
          </div>
          <div class="row">
            <el-button type="primary" @click="returnShoes">
              {{ returnLoading ? '正在提交' : '还 鞋' }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  export default {
    data () {
      return {
        borrowLoading: false,
        returnLoading: false,
        borrowDetail: {},
        returnDetail: {},
        bCode: '',
        rCode: ''
      }
    },
    mounted () {
      document.querySelector('.borrow input').focus()
    },
    computed: {
      borrowStatus () {
        if (this.borrowDetail.status === null || this.borrowDetail.status === undefined) {
          return '未借鞋'
        } else if (this.borrowDetail.status === '0') {
          return '未借鞋'
        } else if (this.borrowDetail.status === '1') {
          return '已借鞋'
        } else {
          return ''
        }
      },
      returnStatus () {
        if (this.returnDetail.status === null || this.returnDetail.status === undefined) {
          return ''
        } else if (this.returnDetail.status === '0') {
          return '未借鞋'
        } else if (this.returnDetail.status === '1') {
          return '已借鞋'
        } else {
          return ''
        }
      }
    },
    methods: {
      addShoesSize () {
        axios.get(URL.api_name + 'memberapi/member/update/shoesize.do', {
          params: {
            id: this.borrowDetail.userId,
            shoeSize: this.borrowDetail.shoeSize
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.$message({
              type: 'success',
              message: '鞋码添加成功'
            })
          }
        }).catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '鞋码添加失败'
          })
        })
      },
      getBorrowDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/takeshoe/search/qrcontent.do', {
          params: {
            code: this.bCode
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.borrowDetail = res.data.data
            // 获取票信息后，使鞋码输入框自动获取焦点
            document.querySelector('.shoeSize input').focus()
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      getReturnDetail () {
        let that = this
        axios.get(URL.api_name + 'backofficeapi/takeshoe/search/qrcontent.do', {
          params: {
            code: this.rCode
          }
        }).then(res => {
          if (res.data.status === 'success') {
            that.returnDetail = res.data.data
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      borrowShoes () {
        let that = this
        if (!this.borrowDetail.code) {
          this.$message({
            type: 'error',
            message: '未获取到票据信息'
          })
          return
        }
        that.borrowLoading = true
        axios.post(URL.api_name + 'backofficeapi/takeshoe/create.do', {
          passId: this.borrowDetail.code,
          shoeSize: this.borrowDetail.shoeSize,
          ticketType: this.borrowDetail.whoimi,
          storeId: JSON.parse(sessionStorage.getItem('store')).k
        }).then(res => {
          that.borrowLoading = false
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: '借鞋成功'
            })
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
          // 借鞋成功后，清空数据，并是输入框获取焦点
          that.borrowDetail = {}
          that.bCode = ''
          document.querySelector('.borrow input').focus()
        }).catch(err => {
          that.borrowLoading = false
          console.log(err)
          that.$message({
            type: 'error',
            message: '借鞋失败'
          })
          // 借鞋成功后，清空数据，并是输入框获取焦点
          that.borrowDetail = {}
          that.bCode = ''
          document.querySelector('.borrow input').focus()
        })
      },
      returnShoes () {
        let that = this
        if (!this.returnDetail.code) {
          this.$message({
            type: 'error',
            message: '未获取到票据信息'
          })
          return
        }
        that.returnLoading = true
        axios.get(URL.api_name + 'backofficeapi/takeshoe/repay.do', {
          params: {
            passId: this.returnDetail.code,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          that.returnLoading = false
          // 还鞋成功后，清除数据，并是输入框获取焦点
          that.returnDetail = {}
          that.rCode = ''
          document.querySelector('.return input').focus()
          if (res.data.status === 'success') {
            that.$message({
              type: 'success',
              message: '还鞋成功'
            })
          } else {
            that.$message({
              type: 'error',
              message: res.data.message
            })
          }
        }).catch(err => {
          that.returnLoading = false
          console.log(err)
          that.$message({
            type: 'error',
            message: '还鞋失败'
          })
          // 还鞋成功后，清除数据，并是输入框获取焦点
          that.returnDetail = {}
          that.rCode = ''
          document.querySelector('.return input').focus()
        })
      }
    }
  }
</script>
<style lang="less">
  .area{
    padding-right: 20px;
    border-right: 1px solid #E5E8E8;
  }
  .row{
    overflow: hidden;
    padding: 10px;
    .label{
      float: left;
      display: inline-block;
      line-height: 36px;
      margin-right: 10px;
      font-size: 14px;
      color: rgb(72, 106, 106);
    }
    .text{
      overflow: hidden;
      line-height: 36px;
      color: #666;
    }
  }
</style>
