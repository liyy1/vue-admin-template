<template>
  <div style="padding: 15px;">
    <el-card>
      <div>
        <el-form ref="form" :inline="true" :model="queryParams" class="filter-container" size="mini">
          <el-input v-model="queryParams.name" class="filter-item" clearable placeholder="客户名称" style="width: 200px" @keyup.enter.native="reloadProject"/>
          <treeselect v-model="queryParams.dept" :options="deptList" :default-expand-level="2" style="width: 200px" class="filter-item" placeholder="部门"/>
          <el-input v-model="queryParams.user" class="filter-item" clearable placeholder="增加人" style="width: 150px" @keyup.enter.native="reloadProject"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reloadProject">查询</el-button>
          <el-button v-has="'project_add'" class="filter-item" type="success" icon="el-icon-edit" @click="addProject">新增</el-button>
        </el-form>
        <el-table
          v-loading="projectLoading"
          :data="projectList"
          min-height="600"
          element-loading-text="Loading"
          border
          highlight-current-row>
          <el-table-column align="center" label="ID" width="60">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="客户名称">
            <template slot-scope="scope">
              <span class="link-type" @click="viewProject(scope.row.id)">{{ scope.row.name }}</span>
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
          <el-table-column label="操作" align="left" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateProject(scope.row.id)">修改</el-button>
              <el-button v-if="scope.row.delete_flag==0" size="mini" type="danger" @click="deleteProject(scope.row.id,1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="loadProject" />
      </div>
      <ProjectDialog :type="dialogType" :data="data" @reLoadList="loadProject"/>
    </el-card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import Pagination from '@/components/Pagination'
import ProjectDialog from '@/views/project/project/detail'
import $http from '@/utils/request'
import { parseTime } from '@/utils/index'

export default {
  components: { Treeselect, Pagination, ProjectDialog },
  data() {
    return {
      deptList: null,
      total: 10,
      projectList: null,
      projectLoading: false,
      queryParams: {
        page: 1,
        limit: 10,
        name: '',
        project: ''
      },
      dialogType: 'add',
      data: {}
    }
  },
  computed: {
  },
  created() {
    // this.getDepts()
    // this.reloadProject()
  },
  methods: {
    getDepts() {
      $http.get('/dept/query').then(response => {
        this.deptList = response.data
      })
    },
    loadProject() {
      this.projectLoading = true
      $http.post('/project/queryProject', this.queryParams).then(response => {
        this.projectList = response.data.rows
        this.total = response.data.total
        this.projectLoading = false
      })
    },
    reloadProject() {
      this.queryParams.page = 1
      this.loadProject()
    },
    parseTime(data) {
      return parseTime(data)
    },
    resetData() {
      this.data = {
        contacts: [{ name: '' }]
      }
    },
    addProject() {
      this.$router.push('/project/project/add')
    },
    updateProject(id) {
      $http.post('/project/getById', { id: id }).then(response => {
        this.data = response.data
      })
      this.dialogType = 'edit'
      this.$store.state.project.dialogVisible = true
    },
    viewProject(id) {
      $http.post('/project/getById', { id: id }).then(response => {
        this.data = response.data
      })
      this.dialogType = 'detail'
      this.$store.state.project.dialogVisible = true
    },
    deleteProject(id, tag) {
      this.$confirm('客户删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $http.post('/project/delete', { id, tag }).then(data => {
          this.$message({
            message: '删除客户成功！',
            type: 'success'
          })
          this.loadProject()
        })
      })
    }

  }
}
</script>
