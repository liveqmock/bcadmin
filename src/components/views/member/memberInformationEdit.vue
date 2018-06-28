<template>
  <div class="member-info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员资料管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data">
      <el-form label-width="100px">
        <el-form-item label="学员姓名：">
          <el-col :span="12">
            <el-input type="text" :maxlength="8" v-model="formData.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学员性别：">
          <el-col :span="12">
            <el-select placeholder="请选择" v-model="formData.gender">
              <el-option label="保密" value="s"></el-option>
              <el-option label="男" value="m"></el-option>
              <el-option label="女" value="f"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="学员生日：">
          <el-col :span="12">
            <el-date-picker type="date" placeholder="选择日期"
                            :editable='false'
                            v-model="formData.birthday"
                            @change="timeRuls"
                            :picker-options="pickerOptions"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-col :span="12">
            <el-input disabled type="number" v-model.number="formData.mobile"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="联系地址：">
          <el-row>
            <el-col :span="4">
              <el-select v-model="formData.province" @change="chooseProvince" placeholder="请选择">
                <el-option v-for="(p, index) in provinceList"
                           :key="index"
                           :label="p.name"
                           :value="p.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="formData.city" @change="chooseCity" placeholder="请选择">
                <el-option v-for="(c, index) in cityList"
                           :key="index"
                           :label="c.name"
                           :value="c.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="formData.area" placeholder="请选择">
                <el-option v-for="(a, index) in areaList"
                           :key="index"
                           :label="a.name"
                           :value="a.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-input type="text" v-model="formData.address" :maxlength='255' placeholder="请输入详细街道"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="就读学校：">
          <el-col :span="12">
            <el-input type="text" v-model="formData.school"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="冰鞋鞋码：">
          <el-col :span="12">
            <el-input type="number" v-model.number="formData.shoeSize"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <div class="clip-line">
              <span class="line"></span>
              <span class="line-label">个人档案</span>
              <span class="line"></span>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="学员水平">
          <el-col :span="12">
            <el-input type="text" v-model="formData.studentPlane"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学员等级">
          <el-col :span="12">
            <el-input type="text" v-model="formData.studentGrade"></el-input>
          </el-col>
        </el-form-item>
        <div class="title-label">比赛记录</div>
        <div class="activity-area" v-for="(m, index) in formData.matchList" :key="index">
          <div class="deletes">
            <el-button @click="delMatch(m)">删除</el-button>
          </div>
          <el-form-item label="比赛名称" required>
            <el-col :span="12">
              <el-input type="text" :maxlength='50' v-model="m.matchName"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="比赛时间" required>
            <el-col :span="12">
              <el-date-picker
                type="date"
                :editable='false' placeholder="选择日期" v-model="m.matchTime"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="比赛地点">
            <el-col :span="12">
              <el-input type="text" :maxlength='255' v-model="m.matchPlace"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="比赛等级">
            <el-col :span="12">
              <el-input type="text" :maxlength='20' v-model="m.matchLevel"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="比赛成绩">
            <el-col :span="12">
              <el-input type="text" v-model="m.matchAchievement"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div class="buttons">
          <el-button type="info" @click="addMatch">添加</el-button>
        </div>
        <div class="title-label">活动记录</div>
        <!-- 默认展示一个空的 -->
        <div class="activity-area" v-for="(a, index) in formData.activityList" :key="index">
          <div class="deletes">
            <el-button @click="delActivity(a)">删除</el-button>
          </div>
          <el-form-item label="活动名称">
            <el-col :span="12">
              <el-input type="text" :maxlength='50' v-model="a.activityName"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="12">
              <el-date-picker type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              :editable='false'
                              v-model="a.activityTime"></el-date-picker>
            </el-col>
          </el-form-item>
        </div>
        <div class="buttons">
          <el-button type="info" @click="addActivity">添加</el-button>
        </div>
        <el-form-item>
          <el-button type="primary" @click="updateMemberInfo" :loading="isLoading">保存</el-button>
          <el-button @click="$router.go('-1')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    import URL from '@/common/js/URL.js'
    import axios from 'axios'
    import UTILS from '@/common/js/Utils'
    export default {
      created () {
        this.getDetail()
        this.initProvince()
      },
      data () {
        return {
          pickerOptions: {
            disabledDate (time) {
              return time.getTime() > Date.now() - 8.64e7
            }
          },
          formData: {},
          isLoading: false,
          activtyObj: {
            activityName: '',
            activityTime: '',
            createBy: null,
            createTime: null,
            id: null,
            memberId: null
          },
          matchObj: {
            createBy: null,
            createTime: null,
            id: null,
            matchAchievement: '',
            matchLevel: '',
            matchName: '',
            matchPlace: '',
            matchTime: '',
            memberId: ''
          },
          provinceList: [],
          cityList: [],
          areaList: [],
          isFirst: true
        }
      },
      methods: {
        checkDate (val) {
          console.log(val)
        },
        updateMemberInfo () {
          var that = this
          for (let m of this.formData.matchList) {
            if (m.matchTime === '' || m.matchName === '') {
              this.$message({
                type: 'error',
                message: '比赛名称和时间不能为空'
              })
              return
            }
            m.matchTime = UTILS.formatDate(m.matchTime)
          }
          for (let a of this.formData.activityList) {
            if (a.activityTime === '' || a.activityName === '') {
              this.$message({
                type: 'error',
                message: '活动名称和时间不能为空'
              })
              return
            }
            a.activityTime = UTILS.formatDate(a.activityTime)
          }
          that.isLoading = true
          axios.post(URL.api_name + 'memberapi/member/update.do', this.formData).then((res) => {
            if (res.data.status === 'success') {
              that.$message({
                message: res.data.message,
                type: 'success',
                duration: 1000,
                onClose: function () {
                  that.$router.push({
                    path: '/memberInfo'
                  })
                }
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
        },
        getDetail () {
          var that = this
          axios.get(URL.api_name + 'memberapi/member/detail.do', {
            params: {
              id: this.$route.params.mid
            }
          }).then((res) => {
            if (res.data.status === 'success') {
              that.formData = res.data.data
            } else {
              that.$mesage({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        },
        timeRuls (val) {
          console.log(val)
          this.formData.birthday = val
        },
        addActivity () {
          this.formData.activityList.push({
            activityName: '',
            activityTime: '',
            createBy: null,
            createTime: null,
            id: null,
            memberId: null
          })
        },
        delActivity (item) {
          if (this.formData.activityList.indexOf(item) > -1) {
            this.formData.activityList.splice(this.formData.activityList.indexOf(item), 1)
          }
        },
        addMatch () {
          this.formData.matchList.push({
            createBy: null,
            createTime: null,
            id: null,
            matchAchievement: '',
            matchLevel: '',
            matchName: '',
            matchPlace: '',
            matchTime: '',
            memberId: ''
          })
        },
        delMatch (item) {
          if (this.formData.matchList.indexOf(item) > -1) {
            this.formData.matchList.splice(this.formData.matchList.indexOf(item), 1)
          }
        },
        initProvince () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/store/initialPosition.do').then(res => {
            that.provinceList = res.data.data.provinces
          })
        },
        chooseProvince () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/store/obtainCitiesOrAreas.do', {
            params: {
              province: that.formData.province
            }
          }).then(res => {
            that.cityList = res.data.data.citys
            if (!that.isFirst) {
              that.formData.city = ''
              that.formData.area = ''
            }
            that.isFirst = false
          })
        },
        chooseCity () {
          var that = this
          axios.get(URL.api_name + 'backofficeapi/store/obtainCitiesOrAreas.do', {
            params: {
              province: that.formData.province,
              city: that.formData.city
            }
          }).then(res => {
            that.areaList = res.data.data.areas
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .clip-line{
    display: flex;
    align-items: center;
    .line{
      height: 1px;
      background-color: #ccc;
      flex-grow: 1;
    }
    .line-label{
      padding: 0 5px;
    }
  }
  .activity-area{
    position: relative;
    width: 60%;
    border: 1px solid #ccc;
    margin-left: 10px;
    padding-top: 10px;
    margin-bottom: 5px;
  }
  .buttons{
    margin-left: 10px;
    margin-top: 10px;
  }
  .title-label{
    margin-left: 10px;
    padding: 10px 0;
    font-size: 14px;
  }
  .deletes{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
  }
</style>
