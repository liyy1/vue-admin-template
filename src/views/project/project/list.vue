<template>
  <div style="padding: 15px;">
    <el-card shadow="never" style="margin-bottom: 15px">
      <el-row>
        <el-col :sm="6" :xs="24">
          <head-info bordered title="总项目数量" content="8个"/>
        </el-col>
        <el-col :sm="6" :xs="24">
          <head-info bordered title="本周新增项目" content="8个"/>
        </el-col>
        <el-col :sm="6" :xs="24">
          <head-info bordered title="本周设计方案" content="32分钟"/>
        </el-col>
        <el-col :sm="6" :xs="24">
          <head-info title="本周立项" content="24个"/>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <el-row v-show="showSearch" style="margin-bottom: 10px">
        <el-form :model="queryParams" label-position="left" label-width="85px">
          <el-col :lg="6" :md="8" style="padding-right: 20px">
            <el-form-item label="项目名称：">
              <el-input v-model="queryParams.name"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" style="padding-right: 20px">
            <el-form-item label="所属单位：">
              <el-input v-model="queryParams.name"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" style="padding-right: 20px">
            <el-form-item label="客户经理：">
              <el-input v-model="queryParams.name"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" style="padding-right: 20px">
            <el-form-item label="客户经理：">
              <el-input v-model="queryParams.name"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" style="padding-right: 20px">
            <el-form-item label="项目名称：">
              <el-input v-model="queryParams.name"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" style="padding-right: 20px">
            <el-form-item label="所属单位：">
              <el-input v-model="queryParams.name"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" style="padding-right: 20px">
            <el-form-item label="客户经理：">
              <el-input v-model="queryParams.name"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" style="padding-right: 20px">
            <el-button type="primary" icon="el-icon-search" @click="reloadCustomer">查询</el-button>
            <el-button plain icon="el-icon-close" @click="reloadCustomer">重置</el-button>
          </el-col>
        </el-form>
      </el-row>
      <div class="table-toolbar">
        <div>
          <el-button v-has="'project_add'" size="small" type="success" icon="el-icon-circle-plus-outline" @click="addProject">新增</el-button>
        </div>
        <div>
          <el-radio-group v-model="queryParams.step" size="small" style="margin-right: 20px">
            <el-radio-button v-for="item in steps" :key="item.id" :label="item.id">{{ item.text }}</el-radio-button>
          </el-radio-group>
          <el-input v-model="queryParams.name" suffix-icon="el-icon-search" size="small" placeholder="请输入内容" style="width: 240px"/>
          <a class="link-type" style="margin-left: 10px;font-size: 14px" @click="showSearch = !showSearch">
            {{ showSearch ? '收起' : '展开' }}
            <i :class="showSearch ? 'el-icon-arrow-up':'el-icon-arrow-down'"/>
          </a>
        </div>
      </div>

      <el-table
        v-loading="projectLoading"
        :data="projectList"
        min-height="600"
        element-loading-text="Loading"
        border
        highlight-current-row>
        <el-table-column prop="name" label="项目名称" fixed width="300">
          <template slot-scope="scope">
            <span class="link-type" @click="viewProject(scope.row.id)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="customerName" label="客户" />
        <el-table-column align="center" prop="realname" label="创建人" width="100" >
          <template slot-scope="scope">
            <el-tag>{{ scope.row.realname }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建日期" width="140">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="150" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateProject(scope.row.id)">修改</el-button>
            <el-button v-if="scope.row.delete_flag==0" size="mini" type="danger" @click="deleteProject(scope.row.id,1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="loadProject" />
    </el-card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import Pagination from '@/components/Pagination'
import HeadInfo from '@/components/tools/HeadInfo'
import Search from '@/components/tools/Search'
import ProjectDialog from '@/views/project/project/detail'
import $http from '@/utils/request'
import { parseTime } from '@/utils/index'

export default {
  components: { Search, HeadInfo, Treeselect, Pagination, ProjectDialog },
  data() {
    return {
      showSearch: true,
      steps: [
        { id: 0, text: '全部' },
        { id: 1, text: '设计' },
        { id: 2, text: '立项' },
        { id: 3, text: '施工' },
        { id: 4, text: '验收' }
      ],
      deptList: null,
      total: 10,
      projectList: null,
      projectLoading: false,
      queryParams: {
        page: 1,
        limit: 10,
        step: 0,
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
    this.reloadProject()
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
      return parseTime(data, '{y}-{m}-{d}')
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
<style rel="stylesheet/scss" lang="scss">
  .table-toolbar{
    height:42px;
    /*border: 1px solid #eeeeee;*/
    border-bottom: 0;
    display: flex;
    justify-content: space-between;
  }
</style>
