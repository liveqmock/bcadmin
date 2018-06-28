<template>
  <div class="province">
    <el-row>
      <el-col :span="6">
        <el-cascader
          :options="options"
          v-model="selectedOptions"
          @change="handleChange">
        </el-cascader>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    created () {
      this.getData()
    },
    data () {
      return {
        options: [],
        selectedOptions: []
      }
    },
    methods: {
      handleChange (value) {
        console.log(value)
      },
      getData () {
        var that = this
        axios.get('static/country.json').then((res) => {
          console.log(res)
          that.options = res.data.data
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="less">

</style>
