<template>
  <div class="home-page">
    <p class="home-text">
      欢迎使用冰纷万象管理后台
    </p>
    <!--<el-row>
      <el-col :span="12">
        <ve-line :data="chartData1" :settings="chartSettings1" :toolbox="toolbox"></ve-line>
      </el-col>
      <el-col :span="12">
        <ve-pie :data="chartData1" :settings="chartSetting2"></ve-pie>
      </el-col>
    </el-row>-->
  </div>
</template>
<script>
  import axios from 'axios'
  import URL from '@/common/js/URL.js'
  export default {
    created () {
      this.getDictoryData()
    },
    data () {
      return {
        dictionary: {},
        chartSettings1: {
          metrics: ['成本', '利润'],
          dimension: ['日期']
        },
        chartSetting2: {
          limitShowNum: 5
        },
        toolbox: {
          feature: {
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
          }
        }
      }
    },
    methods: {
      getDictoryData () {
        axios.get(URL.api_name + 'backofficeapi/system/rict/search.do', {
          params: {
            pageSize: 1000
          }
        }).then((res) => {
          if (res.data.status === 'success') {
            // 循环数据字典数据，以{ key: value }的形式存储到本地
            let list = res.data.data.list
            for (let i = 0; i < list.length; i++) {
              this.dictionary[list[i].systemCode] = list[i].systemName
            }
            sessionStorage.setItem('dictionary', JSON.stringify(this.dictionary))
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .home-text{
    text-align: center;
  }
</style>
