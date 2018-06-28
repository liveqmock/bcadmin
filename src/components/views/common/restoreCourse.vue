<template>
  <el-dialog title="还原课程"
             :visible.sync="restoreDialog"
             :close-on-click-modal="false"
             :show-close="false">
    <el-form label-width="120px" ref="restoreForm" :model="form" :rules="rules">
      <el-form-item label="还原原因：" prop="causeType">
        <el-col :span="12">
          <el-select v-model="form.causeType">
            <el-option v-for="c in causeTypeList"
                       :label="c.systemName"
                       :value="c.systemCode"
                       :key="c.systemCode"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="备注：" prop="remarks">
        <el-col :span="12">
          <el-input type="textarea" :rows="3" v-model="form.remarks"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="confirm('restoreForm')">确定</el-button>
        <el-button type="default" @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import { getUpdateCourseReason } from '@/common/js/ajax'
  import axios from 'axios'
  import URL from '@/common/js/URL'
  export default {
    name: 'RestoreCourse',
    props: {
      restoreDialog: Boolean,
      value: [Number, String]
    },
    created () {
      getUpdateCourseReason().then(res => {
        if (res.data.status === 'success') {
          this.causeTypeList = res.data.data
        } else {
          this.$errMsg(res.data.message)
        }
      })
    },
    watch: {
      restoreDialog (newVal, oldVal) {
        this.$nextTick(function () {
          this.$refs['restoreForm'].resetFields()
        })
      }
    },
    data () {
      return {
        form: {
          causeType: '',
          remarks: ''
        },
        causeTypeList: [],
        rules: {
          causeType: [
            { required: true, message: '还原原因不能为空', trigger: 'blue' }
          ],
          remarks: [
            { required: true, message: '备注不能为空', trigger: 'blue' }
          ]
        }
      }
    },
    methods: {
      closeDialog () {
        this.$emit('closeDialog')
      },
      confirm (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            axios.get(URL.api_name + 'backofficeapi/course/member/restorecourse.do', {
              params: {
                causeType: this.form.causeType,
                courseMemberDetailId: this.value,
                remarks: this.form.remarks
              }
            }).then(res => {
              if (res.data.status === 'success') {
                this.$emit('closeDialog', {
                  refresh: true
                })
              } else {
                this.$errMsg(res.data.message)
              }
            })
          }
        })
      }
    }
  }
</script>
