<template>
  <div style="padding: 15px;">
    <el-card shadow="never">
      <div slot="header">
        <span slot="title">客户列表</span>
      </div>
      <div>
        <el-form ref="form" :inline="true" :model="queryParams" class="filter-container" size="mini">
          <el-input v-model="queryParams.name" class="filter-item" clearable placeholder="客户名称" style="width: 200px" @keyup.enter.native="reloadCustomer"/>
          <treeselect v-model="queryParams.dept" :options="deptList" :default-expand-level="2" style="width: 200px" class="filter-item" placeholder="部门"/>
          <el-input v-model="queryParams.user" class="filter-item" clearable placeholder="增加人" style="width: 150px" @keyup.enter.native="reloadCustomer"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reloadCustomer">查询</el-button>
          <el-button class="filter-item" type="success" icon="el-icon-edit" @click="addCustomer">新增</el-button>
        </el-form>
      </div>
      <div>
        <el-table
          v-loading="customerLoading"
          :data="customerList"
          min-height="600"
          element-loading-text="Loading"
          highlight-current-row>
          <el-table-column align="center" label="ID" width="60" fixed>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="客户名称" fixed width="200">
            <template slot-scope="scope">
              <span class="link-type" @click="viewCustomer(scope.row.id)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="addr" label="地址" />
          <el-table-column prop="industry" label="行业" />
          <el-table-column prop="tel" label="联系电话" />
          <el-table-column align="center" prop="grade" label="客户等级" width="200">
            <template slot-scope="scope">
              <el-rate v-model="scope.row.grade"/>
            </template>
          </el-table-column>
          <el-table-column prop="realname" label="创建人" />
          <el-table-column label="操作" align="left" width="150" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateCustomer(scope.row.id)">修改</el-button>
              <el-button v-if="scope.row.delete_flag==0" size="mini" type="danger" @click="deleteCustomer(scope.row.id,1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="loadCustomer" />
      </div>
      <CustomerDialog :type="dialogType" :data="data" @reLoadList="loadCustomer"/>
    </el-card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import Pagination from '@/components/Pagination'
import CustomerDialog from '@/views/project/customer/info'
import $http from '@/utils/request'
import { parseTime } from '@/utils/index'

export default {
  components: { Treeselect, Pagination, CustomerDialog },
  data() {
    return {
      deptList: null,
      total: 10,
      customerList: null,
      customerLoading: true,
      queryParams: {
        page: 1,
        limit: 10,
        name: '',
        customer: ''
      },
      dialogType: 'add',
      data: {}
    }
  },
  computed: {
  },
  created() {
    this.getDepts()
    this.reloadCustomer()
  },
  methods: {
    getDepts() {
      $http.get('/dept/query').then(response => {
        this.deptList = response.data
      })
    },
    loadCustomer() {
      this.customerLoading = true
      $http.post('/customer/query', this.queryParams).then(response => {
        this.customerList = response.data.rows
        this.total = response.data.total
        this.customerLoading = false
      })
    },
    reloadCustomer() {
      this.queryParams.page = 1
      this.loadCustomer()
    },
    parseTime(data) {
      return parseTime(data)
    },
    resetData() {
      this.data = {
        contacts: [{ name: '' }]
      }
    },
    addCustomer() {
      this.resetData()
      this.dialogType = 'add'
      this.$store.state.customer.dialogVisible = true
    },
    updateCustomer(id) {
      $http.post('/customer/getById', { id: id }).then(response => {
        this.data = response.data
      })
      this.dialogType = 'edit'
      this.$store.state.customer.dialogVisible = true
    },
    viewCustomer(id) {
      $http.post('/customer/getById', { id: id }).then(response => {
        this.data = response.data
      })
      this.dialogType = 'detail'
      this.$store.state.customer.dialogVisible = true
    },
    deleteCustomer(id, tag) {
      this.$confirm('客户删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $http.post('/customer/delete', { id, tag }).then(data => {
          this.$message({
            message: '删除客户成功！',
            type: 'success'
          })
          this.loadCustomer()
        })
      })
    }

  }
}
</script>
