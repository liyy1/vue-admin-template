<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="queryParams" class="filter-container" size="mini">
      <el-input v-model="queryParams.username" class="filter-item" placeholder="用户名" style="width: 200px" @keyup.enter.native="query"/>
      <el-select v-model="queryParams.region" class="filter-item" placeholder="角色" clearable style="width: 150px">
        <el-option label="区域一" value="shanghai"/>
        <el-option label="区域二" value="beijing"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">查询</el-button>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      min-height="600"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="帐号" />
      <el-table-column prop="realname" label="姓名" />
      <el-table-column prop="roleName" label="角色" />
      <el-table-column align="center" prop="createTime" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="query" />

  </div>
</template>

<script>
import { getList } from '@/api/table'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 10,
      listLoading: true,
      queryParams: {
        page: 1,
        limit: 20,
        username: '',
        region: ''
      }
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      this.listLoading = true
      getList(this.queryParams).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    parseTime(data) {
      return parseTime(data)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
