<template>
  <div class="putin-add">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>出库</el-breadcrumb-item>
        <el-breadcrumb-item>新增出库</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="putin-wrapper">
      <el-form :inline="true" :model="stockRecord" :rules="rules" ref="stockRecord"
               label-width="100px"
               class="demo-form-inline">
        <el-form-item label="仓库">
          {{house}}
        </el-form-item>
        <el-form-item label="出库日期" prop="time">
          <el-date-picker v-model="stockRecord.time" type="date" disabled placeholder="入库日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="经办人" required>
          {{operator}}
        </el-form-item>
        <el-form-item label="出库类型" prop="type">
          <el-select v-model="stockRecord.type">
            <el-option label="销售出库" :value="3"></el-option>
            <el-option label="报废出库" :value="4"></el-option>
            <el-option label="其他出库" :value="5"></el-option>
            <el-option label="部门领用" :value="6"></el-option>
            <el-option label="退货出库" :value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领用部门" prop="useDepartment" v-show="stockRecord.type === 6">
          <el-select v-model="stockRecord.useDepartment">
            <el-option v-for="d in departmentList" :key="d.id" :label="d.systemName" :value="d.systemCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库单号" v-show="stockRecord.type === 7">
          <el-input v-model="stockRecord.orderNumber"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data">
      <el-table :data="initList" border style="width: 100%">
        <el-table-column label="操作" width="80">
          <template scope="scope">
            <el-button class="cell-btn" type="text" icon="plus" @click="addStockItem"></el-button>
            <el-button class="cell-btn" type="text" icon="minus" @click="minusStockItem(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="商品条码">
          <template scope="scope">
            <el-input v-model="scope.row.productCode"
                      @keyup.enter.native="querySerach(scope.row.productCode, scope.row)"
                      placeholder="输入商品编码，按回车查询"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品规格名称">
          <template scope="scope">
            {{ scope.row.productDetail.standard }}
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template scope="scope">
            {{ scope.row.productDetail.name }}
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <template scope="scope">
            {{ scope.row.productDetail.unit }}
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template scope="scope">
            <el-input v-model.number="scope.row.number"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="" label="二级类型">
          <template scope="scope">
            {{scope.row.productDetail.childName}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="一级类型">
          <template scope="scope">
            {{scope.row.productDetail.parentName}}
          </template>
        </el-table-column>
        <el-table-column label="进项税率">
          <template scope="scope">
            {{scope.row.productDetail.inputRate}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="进货单价">
          <template scope="scope">
            {{ scope.row.productDetail.buyingPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="进货总价">
          <template scope="scope">
            {{scope.row.productDetail.buyingPrice * scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column width="150" label="销项税率">
          <template scope="scope">
            {{ scope.row.productDetail.taxRate }}
          </template>
        </el-table-column>
        <el-table-column width="150" label="出库总价">
          <template scope="scope">
            {{scope.row.productDetail.treasuryPrice * scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column width="150" label="备注">
          <template scope="scope">
            <el-input v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row class="putin-footer">
      <el-col :span="6">
        <el-upload
          class="upload-demo"
          :action="imgUploadUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="uporr"
          :headers="uploadHeader"
          :file-list="fileList">
          <el-button size="small" type="primary">添加附件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-row class="putin-footer">
      <el-col :span="2" class="label">填写备注:</el-col>
      <el-col :span="10">
        <el-input v-model="stockRecord.remarks" type="text"></el-input>
      </el-col>
    </el-row>
    <div class="putin-btns">
      <el-button type="info" :loading="loading" @click="addStock('stockRecord')">
        {{ loading ? '正在保存' : '保存' }}
      </el-button>
      <el-button @click="$router.go('-1')">取 消</el-button>
    </div>
  </div>
</template>
<script>
  import URL from '@/common/js/URL.js'
  import axios from 'axios'
  import moment from 'moment'

  export default {
    created () {
      this.fetchDeparentment()
    },
    data () {
      var checkType = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('出库类型不能为空'))
        } else {
          callback()
        }
      }
      var checkTime = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('入库日期不能为空'))
        } else {
          callback()
        }
      }
      return {
        operator: JSON.parse(sessionStorage.getItem('userInfo')).userName,
        house: JSON.parse(sessionStorage.getItem('store')).v + '仓库',
        imgUploadUrl: URL.api_name + 'merchandiseapi/stock/upload.do',
        fileList: [],
        departmentList: [],
        initList: [
          {
            number: 0,
            remark: '',
            productDetail: {},
            supplierId: '',
            productCode: ''
          }
        ],
        stockRecord: {
          remarks: '',
          time: moment().format('YYYY-MM-DD'),
          type: '',
          useDepartment: '',
          stockType: 2,
          fileName: '',
          fileUrl: '',
          storeId: JSON.parse(sessionStorage.getItem('store')).k,
          orderNumber: '',
          operator: JSON.parse(sessionStorage.getItem('userInfo')).userName
        },
        tableData: [],
        loading: false,
        rules: {
          time: [
            { required: true, validator: checkTime, trigger: 'blur' }
          ],
          type: [
            { required: true, validator: checkType, trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      uploadHeader () {
        return {
          authtoken: JSON.parse(sessionStorage.getItem('userInfo')).sessionId
        }
      }
    },
    methods: {
      fetchDeparentment () {
        axios.get(URL.api_name + 'backofficeapi/system/rict/obtainChild.do', {
          params: {
            systemCode: 'departmentName'
          }
        }).then(res => {
          if (res.data.status === 'success') {
            this.departmentList = res.data.data
          }
        })
      },
      beforeUpload (file) {
        if (this.fileList.length > 0) {
          this.$errMsg('最多上传一个附件')
          return false
        }
      },
      handleRemove (file, fileList) {
        this.fileList = fileList
      },
      handlePreview (file) {
      },
      handleSuccess (response, file, fileList) {
        this.fileList = fileList
        this.stockRecord.fileName = this.fileList[0].response.data.fileName
        this.stockRecord.fileUrl = this.fileList[0].response.data.fileUrl
      },
      uporr (err, file, fileList) {
        if (err.status === 'failed') {
          this.$message({
            message: err.message,
            type: 'error'
          })
        } else {
          this.$message({
            message: '上传失败',
            type: 'error'
          })
        }
      },
      querySerach (prodCode, item) {
        let index = this.initList.indexOf(item)
        axios.get(URL.api_name + 'merchandiseapi/product/findByProductCode.do', {
          params: {
            type: 2,
            productCode: prodCode,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
        }).then(res => {
          if (res.data.status === 'success') {
            console.log(index)
            this.initList[index].productDetail = res.data.data
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      addStockItem () {
        this.initList.push({
          number: 0,
          buyingPrice: '',
          remark: '',
          productCode: '',
          productDetail: {}
        })
      },
      minusStockItem (item) {
        if (this.initList.length > 1) {
          this.initList.splice(this.initList.indexOf(item), 1)
        }
      },
      addStock (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let that = this
            // 判断出库类型是否是部门领用
            if (this.stockRecord.type === 6 && !this.stockRecord.useDepartment) {
              this.$errMsg('请填写部门领用')
              return
            }
            // 循环获取填写的数据单
            for (let i = 0; i < this.initList.length; i++) {
              if (this.initList[i].productCode !== '' && this.initList[i].number !== 0) {
              } else {
                this.$errMsg('出库数量必须大于0')
                return
              }
            }
            // 组装提交的数据
            const submitList = []
            for (let p of this.initList) {
              submitList.push({
                buyingPrice: p.productDetail.buyingPrice,
                childName: p.productDetail.childName,
                expirationDate: p.productDetail.expirationDate,
                number: p.number,
                parentName: p.productDetail.parentName,
                productDetailId: p.productDetail.id,
                remark: p.remark,
                supplierId: p.supplierId,
                totalBuyingPrice: p.productDetail.buyingPrice * p.number,
                storeId: JSON.parse(sessionStorage.getItem('store')).k,
                inputRate: p.productDetail.inputRate.split('%')[0],
                taxRate: p.productDetail.taxRate.split('%')[0],
                treasuryPrice: p.productDetail.treasuryPrice
              })
            }
            that.loading = true
            axios.post(URL.api_name + 'merchandiseapi/stock/create.do', {
              stockDetailList: submitList,
              stockRecord: this.stockRecord
            }).then(res => {
              if (res.data.status === 'success') {
                that.$message({
                  type: 'success',
                  message: '添加成功',
                  onClose: function () {
                    that.$router.push({
                      path: '/putout'
                    })
                  }
                })
              } else {
                that.loading = false
                that.$errMsg(res.data.message)
              }
            }).catch(err => {
              console.log(err)
              that.loading = false
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-select-dropdown__item{
    height: auto;
  }
  .putin-wrapper{
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 10px;
    margin-bottom: 15px;
    background-color: #F5F8FA;
  }
  .cell-btn{
    float: left;
    margin-right: 5px;
  }
  .select-item{
    overflow: hidden;
  }
  .select-img{
    display: inline-block;
    width: 40px;
    height: 40px;
    float: left;
    margin-right: 5px;
  }
  .select-name{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 20px;
    color: #333;
  }
  .putin-footer{
    padding: 10px 0;
    .label{
      line-height: 36px;
      font-size: 14px;
      color: rgb(72, 106, 106);
    }
  }
  .putin-btns{
    text-align: center;
  }
  .banner-img{
    width: 80px;
    height: 60px;
    vertical-align: bottom;
  }
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }
      .img{
        display: inline-block;
        width: 40px;
        height: 40px;
        float: left;
        margin-right: 5px;
      }
      .highlighted .addr {
        color: #ddd;
      }
    }
  }
</style>
