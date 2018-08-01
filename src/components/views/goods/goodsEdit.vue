<template>
  <div class="add-coupon">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>修改</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
        <el-form-item label="商品名称:" prop="name">
          <el-col :span="12">
            <el-input type="text" v-model="formData.name" :disabled="formData.isStock === true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="类 别:" prop="typeId">
          <el-select v-model="formData.typeId" @change="getChildTypeList">
            <el-option v-for="(t, i) in typeList" :key="i" :label="t.name" :value="t.id"></el-option>
          </el-select>
          <el-select v-model="formData.childTypeId" v-if="childTypeList.length > 0">
            <el-option v-for="(t, i) in childTypeList" :key="i" :label="t.name" :value="t.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位:" prop="unit">
          <el-col :span="12">
            <el-input type="text" v-model="formData.unit" placeholder="件(默认)"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="规格添加:">
          <el-row>
            <el-col :span="12">
              <el-button type="info" icon="plus" size="small" @click="addStandard"></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-table
                :data="productDetailList"
                border>
                <el-table-column label="序号" width="88" type="index">
                </el-table-column>
                <el-table-column label="规格名称">
                  <template scope="scope">
                    <span>{{ scope.row.standard }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="图片">
                  <template scope="scope">
                    <img :src="scope.row.picture" width="50" height="50">
                  </template>
                </el-table-column>
                <el-table-column label="销售价" width="150">
                  <template scope="scope">
                    {{scope.row.sellingPrice}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                  <template scope="scope">
                    <el-button size="small" type="primary" @click="updateStandard(scope.row)">修改</el-button>
                    <el-button size="small" type="danger" @click="delStandard(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否为礼品:">
          <el-col :span="12">
            <el-checkbox v-model="formData.isGift" true-label="1" false-label="0"></el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="兑换积分:" prop="changeIntegral" v-show="formData.isGift === '1'">
          <el-col :span="12">
            <el-input v-model.number="formData.changeIntegral" type="text"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-col :span="12">
            <el-select v-model="formData.status">
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
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
    <el-dialog title="添加规格" :visible.sync="dialogFormVisible" @close="clearStandard">
      <el-form :model="standard"
               label-width="100px"
               ref="standard"
               :rules="standardRules">
        <el-form-item label="条码" prop="productCode">
          <el-col :span="16">
            <el-input v-model="standard.productCode" :disabled="standard.flag === true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="规格名称" prop="standard">
          <el-col :span="16">
            <el-input v-model="standard.standard" :disabled="standard.flag === true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="进货价" prop="buyingPrice">
          <el-col :span="16">
            <el-input v-model.number="standard.buyingPrice" auto-complete="off" :disabled="standard.flag === true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="进项税率" prop="inputRate">
          <el-col :span="16">
            <el-input v-model.number="standard.inputRate" auto-complete="off" :disabled="standard.flag === true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="建议零售价" prop="sellingPrice">
          <el-col :span="16">
            <el-input v-model.number="standard.sellingPrice" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-row>
          <el-radio v-model="standard.useType" :label="1" class="before-label">&nbsp;</el-radio>
          <el-form-item label="实售价">
            <el-col :span="16">
              <el-input v-model.number="standard.price" :disabled="standard.useType !== 1"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-radio v-model="standard.useType" :label="2" class="before-label">&nbsp;</el-radio>
          <el-form-item label="折扣" prop="discount">
            <el-col :span="16">
              <el-input v-model.number="standard.discount" :disabled="standard.useType !== 2"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-form-item label="商品税率" prop="taxRate">
          <el-col :span="16">
            <el-input v-model.number="standard.taxRate"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商品图片:">
          <el-col :span="16">
            <el-upload
              class="upload-demo"
              :action="imgUploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :before-upload="beforeUpload"
              :on-error="uporr"
              :on-success="handleSuccess"
              :headers="uploadHeader"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">仅支持jpeg/jpg/png文件，且不超过2Mb</div>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="描述" prop="describes">
          <el-col :span="16">
            <el-input v-model="standard.describes" type="textarea"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveStandard('standard')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    import validate from '@/common/js/validate.js'
    let tempStandardIndex
    export default {
      created () {
        this.getTypeList()
        this.getDetail()
      },
      data () {
        var checkType = (rule, value, callback) => {
          if (value === '') {
            return callback(new Error('类别不能为空'))
          } else {
            return callback()
          }
        }
        var checkChangeIntegral = (rule, value, callback) => {
          if (value && typeof value !== 'number') {
            return callback(new Error('积分请输入数字'))
          } else {
            return callback()
          }
        }
        var checkDiscount = (rule, value, callback) => {
          if (value !== '' && value !== null) {
            if (typeof value === 'number' && value >= 0 && value <= 10) {
              return callback()
            } else {
              return callback(new Error('请输入0-10的数字'))
            }
          } else {
            return callback()
          }
        }
        var checkRate = (rule, value, callback) => {
          if (value !== '' && value !== null) {
            if (typeof value === 'number' && value >= 0 && value <= 100) {
              return callback()
            } else {
              return callback(new Error('请输入0-100的数字'))
            }
          } else {
            return callback()
          }
        }
        return {
          dialogFormVisible: false,
          standard: {
            picture: '',
            buyingPrice: '',
            describes: '',
            discount: 10,
            productCode: '',
            sellingPrice: '',
            standard: '',
            taxRate: '',
            inputRate: '',
            price: '',
            useType: 1,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          },
          formData: {
            storeId: JSON.parse(sessionStorage.getItem('store')).k,
            changeIntegral: '',
            isGift: '0',
            name: '',
            picture: '',
            status: '1',
            typeId: '',
            unit: '件',
            childTypeId: '',
            supplierId: ''
          },
          productDetailList: [],
          delStandardArr: [],
          typeList: [],
          supplyList: [],
          childTypeList: [],
          loading: false,
          fileList: [],
          imgUploadUrl: URL.api_name + 'merchandiseapi/product/upload.do',
          rules: {
            name: [
              { required: true, message: '商品名称不能为空', trigger: 'blur' },
              { max: 30, message: '名称最大长度为30个字符', trigger: 'blur' }
            ],
            typeId: [
              { required: true, validator: checkType, trigger: 'change' }
            ],
            unit: [
              { required: true, message: '单位不能为空', trigger: 'blur' }
            ],
            status: [
              { required: true, message: '状态不能为空', trigger: 'change' }
            ],
            changeIntegral: [
              { validator: checkChangeIntegral, trigger: 'blur' }
            ]
          },
          standardRules: {
            taxRate: [
              { validator: checkRate, trigger: 'blur' }
            ],
            discount: [
              { validator: checkDiscount, trigger: 'blur' }
            ],
            picture: [
              { required: true, message: '商品图片不能为空' }
            ],
            buyingPrice: [
              { required: true, message: '进货价不能为空' },
              { validator: validate.checkInputNum, trigger: 'blur' }
            ],
            describes: [
              { required: true, message: '描述不能为空' },
              { max: 100, message: '描述最多输入100个字符', trigger: 'blur' }
            ],
            sellingPrice: [
              { required: true, message: '出售价不能为空' },
              { validator: validate.checkInputNum, trigger: 'blur' }
            ],
            standard: [
              { required: true, message: '规格名称不能为空' }
            ]
          },
          updateType: 0 // 判断添加还是修改规格 0是添加， 1是修改
        }
      },
      methods: {
        addStandard () {
          this.dialogFormVisible = true
          this.updateType = 0
        },
        delStandard (item) {
          if (item.id) {
            axios.get(URL.api_name + 'merchandiseapi/product/delete.do', {
              params: {
                storeId: item.storeId,
                productDetailId: item.id
              }
            }).then(res => {
              if (res.data.status === 'success') {
                // 可以删除, 在delStandardArr保存可以删除的数据
                item.isdetel = true
                this.delStandardArr.push(item)
                if (this.productDetailList.indexOf(item) > -1) {
                  this.productDetailList.splice(this.productDetailList.indexOf(item), 1)
                }
              } else {
                // 不能删除
                this.$errMsg(res.data.message)
              }
            })
          } else {
            if (this.productDetailList.indexOf(item) > -1) {
              this.productDetailList.splice(this.productDetailList.indexOf(item), 1)
            }
          }
        },
        updateStandard (item) {
          tempStandardIndex = this.productDetailList.indexOf(item)
          this.standard = item
          if (item.picture) {
            this.fileList.push({
              url: item.picture
            })
          }
          this.dialogFormVisible = true
          this.updateType = 1
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
        getDetail () {
          let that = this
          axios.get(URL.api_name + 'merchandiseapi/product/find.do', {
            params: {
              productId: this.$route.params.gid
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.formData = res.data.data.product
              this.$set(this.formData, 'isStock', res.data.data.stock)
              that.productDetailList = res.data.data.productDetailList
            }
          })
        },
        getChildTypeList () {
          let that = this
          axios.get(URL.api_name + 'merchandiseapi/product/type/obtain/child.do', {
            params: {
              parentId: this.formData.typeId,
              storeId: JSON.parse(sessionStorage.getItem('store')).k
            }
          }).then(res => {
            if (res.data.status === 'success') {
              that.childTypeList = res.data.data
            }
          })
        },
        clearStandard () {
          this.dialogFormVisible = false
          // 初始化规格表单数据
          this.standard = {
            picture: '',
            buyingPrice: '',
            describes: '',
            discount: 10,
            productCode: '',
            sellingPrice: '',
            standard: '',
            taxRate: '',
            inputRate: '',
            price: '',
            useType: 1,
            storeId: JSON.parse(sessionStorage.getItem('store')).k
          }
          this.fileList = []
        },
        saveStandard (name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              // 校验成功
              if (this.updateType === 0) {
                this.productDetailList.push(this.standard)
              } else if (this.updateType === 1) {
                this.productDetailList.splice(tempStandardIndex, 1, this.standard)
              }
              this.clearStandard()
            }
          })
        },
        onSubmit (name) {
          var that = this
          that.$refs[name].validate((valid) => {
            if (valid) {
              // 规格不能为空
              if (that.productDetailList.length === 0) {
                that.$message({
                  type: 'error',
                  message: '至少填写一种规格商品'
                })
                return
              }
              // 如果商品为礼品，兑换积分不能为空
              if (that.formData.isGift === '1') {
                if (!that.formData.changeIntegral) {
                  that.$message({
                    type: 'error',
                    message: '兑换积分不能空'
                  })
                  return
                }
              }
              // 如果选择了一级节点，二级节点不能为空
              if (this.childTypeList.length > 0 && !this.formData.childTypeId) {
                this.$message({
                  type: 'error',
                  message: '类型的子节点不能为空'
                })
                return
              }
              // 判断是否提交折扣
              for (let p of this.productDetailList) {
                if (p.useType !== 2) {
                  p.discount = ''
                }
              }
              that.loading = true
              axios.post(URL.api_name + 'merchandiseapi/product/update.do', {
                product: that.formData,
                productDetailList: that.productDetailList.concat(that.delStandardArr)
              }).then(res => {
                if (res.data.status === 'success') {
                  that.$message({
                    type: 'success',
                    message: '添加成功',
                    duration: 1000,
                    onClose: function () {
                      that.$router.push({
                        path: '/goods'
                      })
                    }
                  })
                } else {
                  that.loading = false
                  that.$errMsg(res.data.message)
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
        },
        handleRemove (file, fileList) {
          this.fileList = fileList
        },
        handlePreview (file) {
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
        handleSuccess (response, file, fileList) {
          this.fileList = fileList
          if (response.status === 'success') {
            this.standard.picture = response.data.pictureUrl
          } else {
            this.fileList = []
          }
        },
        beforeUpload (file) {
          // 限定上传图片的格式
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            console.log('格式正确')
          } else {
            this.$message({
              type: 'error',
              message: '不支持的文件格式'
            })
            return false
          }
          // 如果文件大小超过2M，提示用户
          if (file.size > 1024 * 1024 * 2) {
            this.$message({
              type: 'error',
              message: '图片不能大于2M'
            })
            return false
          }
          if (this.fileList.length > 0) {
            this.$message({
              type: 'error',
              message: '最多上传一张图片',
              duration: 1000
            })
            return false
          }
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
  .before-label{
    position: absolute;
    top: 15%;
    left: 3%;
  }
</style>
