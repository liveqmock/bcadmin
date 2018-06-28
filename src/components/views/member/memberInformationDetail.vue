<template>
  <div class="member-info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员资料管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-data" v-if="formData">
      <el-form label-width="80px">
        <el-form-item label="学员姓名:">
          <p>{{ formData.name }}</p>
        </el-form-item>
        <el-form-item label="学员性别:">
          <p>{{ formData.gender | formatSex }}</p>
        </el-form-item>
        <el-form-item label="学员生日:">
          <p>{{ formData.birthday }}</p>
        </el-form-item>
        <el-form-item label="联系电话:">
          <p>{{ formData.mobile }}</p>
        </el-form-item>
        <el-form-item label="联系地址:">
          <el-row>
            <el-col :span="4">
              <el-select v-model="formData.province" @change="chooseProvince" disabled placeholder="请选择">
                <el-option v-for="(p, index) in provinceList"
                           :key="index"
                           :label="p.name"
                           :value="p.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="formData.city" @change="chooseCity" disabled placeholder="请选择">
                <el-option v-for="(c, index) in cityList"
                           :key="index"
                           :label="c.name"
                           :value="c.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="formData.area" disabled placeholder="请选择">
                <el-option v-for="(a, index) in areaList"
                           :key="index"
                           :label="a.name"
                           :value="a.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-input type="text"
                        v-model="formData.address" disabled
                        :maxlength='255'
                        placeholder="请输入详细街道"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="就读学校:">
          <p>{{ formData.school }}</p>
        </el-form-item>
        <el-form-item label="冰鞋鞋码:">
          <p>{{ formData.shoeSize }}</p>
        </el-form-item>
        <el-row>
          <el-col :span="14">
            <div class="clip-line">
              <span class="line"></span>
              <span class="line-label">个人档案</span>
              <span class="line"></span>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="学员水平:">
          <el-col :span="12">
            {{ formData.studentPlane }}
          </el-col>
        </el-form-item>
        <el-form-item label="学员等级:">
          <el-col :span="12">
            {{ formData.studentGrade }}
          </el-col>
        </el-form-item>
        <div class="title-label">比赛记录</div>
        <div class="activity-area" v-for="(m, index) in formData.matchList" :key="index">
          <el-form-item label="比赛名称">
            <el-col :span="12">
              {{ m.matchName }}
            </el-col>
          </el-form-item>
          <el-form-item label="比赛时间">
            <el-col :span="12">
              {{ m.matchTime }}
            </el-col>
          </el-form-item>
          <el-form-item label="比赛地点">
            <el-col :span="12">
              {{ m.matchPlace }}
            </el-col>
          </el-form-item>
          <el-form-item label="比赛等级">
            <el-col :span="12">
              {{ m.matchLevel }}
            </el-col>
          </el-form-item>
          <el-form-item label="比赛成绩">
            <el-col :span="12">
              {{ m.matchAchievement }}
            </el-col>
          </el-form-item>
        </div>
        <div class="activity-area" v-show="formData.matchList.length === 0">
          <p class="empty-data">暂无数据</p>
        </div>
        <div class="title-label">活动记录</div>
        <!-- 默认展示一个空的 -->
        <div class="activity-area" v-for="(a, index) in formData.activityList" :key="index">
          <el-form-item label="活动名称">
            <el-col :span="12">
              {{ a.activityName }}
            </el-col>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="12">
              {{ a.activityTime }}
            </el-col>
          </el-form-item>
        </div>
        <div class="activity-area" v-show="formData.activityList.length === 0">
          <p class="empty-data">暂无数据</p>
        </div>
        <el-form-item>
          <el-button type="primary" @click="goEdit()">编辑</el-button>
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
        this.initProvince()
      },
      data () {
        return {
          formData: {
            matchList: [],
            activityList: []
          },
          provinceList: [],
          cityList: [],
          areaList: []
        }
      },
      methods: {
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
        },
        goEdit () {
          this.$router.push({
            path: '/memberInfoEdit/' + this.$route.params.mid
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
              that.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    }
</script>
<style lang="less" scoped>
  .clip-line{
    margin-left: 12px;
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
  .empty-data{
    padding: 10px;
    color: #999;
  }
</style>
