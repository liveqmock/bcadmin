<template>
  <div class="add-coupon" v-if="formData">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px" ref="formData">
        <el-form-item label="商品名称:">
          <el-col :span="12">
            {{ formData.product.name }}
          </el-col>
        </el-form-item>
        <el-form-item label="类 别:">
          <el-select v-model="formData.product.typeId" disabled>
            <el-option v-for="(t, i) in typeList" :key="i" :label="t.name" :value="t.id"></el-option>
          </el-select>
          <el-select v-model="formData.product.childTypeId" v-if="childTypeList.length > 0" disabled>
            <el-option v-for="(t, i) in childTypeList" :key="i" :label="t.name" :value="t.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位:">
          <el-col :span="12">
            {{ formData.product.unit }}
          </el-col>
        </el-form-item>
        <el-form-item label="规格:">
          <el-row>
            <el-col :span="24">
              <el-table
                :data="formData.productDetailList">
                <el-table-column type="expand">
                  <template scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="图片：">
                        <img :src="props.row.picture" class="goods-img"/>
                      </el-form-item>
                      <el-form-item label="规格名称：">
                        <span>{{props.row.standard}}</span>
                      </el-form-item>
                      <el-form-item label="商品条码：">
                        <span>{{props.row.productCode}}</span>
                      </el-form-item>
                      <el-form-item label="进货价：">
                        <span>{{props.row.buyingPrice}}</span>
                      </el-form-item>
                      <el-form-item label="进项税率：">
                        <span>{{props.row.inputRate}}</span>
                      </el-form-item>
                      <el-form-item label="建议零售价：">
                        <span>{{props.row.sellingPrice}}</span>
                      </el-form-item>
                      <el-form-item label="实售价：">
                        <span>{{props.row.price}}</span>
                      </el-form-item>
                      <el-form-item label="折扣：">
                        <span>{{props.row.discount}}</span>
                      </el-form-item>
                      <el-form-item label="商品税率：">
                        <span>{{props.row.taxRate}}</span>
                      </el-form-item>
                      <el-form-item label="描述：">
                        <el-col>
                          <span>{{props.row.describes}}</span>
                        </el-col>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="商品条码" prop="productCode">
                </el-table-column>
                <el-table-column label="商品规格名称" prop="standard">
                </el-table-column>
                <el-table-column label="描述" prop="describes">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否为礼品:">
          <el-col :span="12">
            {{ formData.product.isGift === '1' ? '是' : '否' }}
          </el-col>
        </el-form-item>
        <el-form-item label="兑换积分:" v-show="formData.product.isGift === '1'">
          <el-col :span="12">
            {{ formData.product.changeIntegral }}
          </el-col>
        </el-form-item>
        <el-form-item label="状态:">
          <el-col :span="12">
            {{ formData.product.status === '1' ? '已上架' : '已下架' }}
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goEdit">
            修改
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
      created () {
        this.getDetail()
        this.getTypeList()
      },
      data () {
        return {
          formData: null,
          typeList: [],
          childTypeList: [],
          loading: false
        }
      },
      methods: {
        goEdit () {
          this.$router.push({
            path: '/goodsEdit/' + this.$route.params.gid
          })
        },
        getDetail () {
          let that = this
          axios.get(URL.api_name + 'merchandiseapi/product/find.do', {
            params: {
              productId: this.$route.params.gid
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
              if (that.formData.product.childTypeId) {
                that.getChildTypeList(that.formData.product.typeId)
              }
            }
          })
        },
        getTypeList () {
          let that = this
          axios.get(URL.api_name + 'merchandiseapi/product/type/obtain/zero.do', {
            params: {
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.typeList = res.data.data
            }
          })
        },
        getChildTypeList (parentId) {
          let that = this
          axios.get(URL.api_name + 'merchandiseapi/product/type/obtain/child.do', {
            params: {
              parentId: parentId,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.childTypeList = res.data.data
            }
          })
        }
      },
      computed: {
        uploadHeader () {
          return {
            authtoken: JSON.parse(sessionStorage.getItem('userInfo')).sessionId
          }
        }
      }
    }
</script>
<style lang="less" scoped>
  .price{
    text-align: center;
  }
  .color-gry{ color:#999; font-size:12px; margin-left:10px;}
  .goods-img{
    display: inline-block;
    width: 80px;
    height: 80px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
