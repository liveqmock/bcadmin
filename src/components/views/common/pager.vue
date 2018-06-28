<template>
  <div class="page-pagination">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="totalCount">
    </el-pagination>
  </div>
</template>
<script>
  import Pager from '@/components/views/common/pager'
  export default {
    props: ['currentPage', 'totalCount'],
    data () {
      return {
        pageSize: 15
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.$emit('handleCurrentChange', val)
      }
    },
    components: {
      Pager: Pager
    }
  }
</script>
<style lang="less">
</style>
