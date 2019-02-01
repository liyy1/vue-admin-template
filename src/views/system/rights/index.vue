<template>
  <el-row :gutter="20" style="padding: 15px;">
    <el-col :span="18">
      <el-card>
        <div>
          <el-form ref="form" :inline="true" :model="queryParams" class="filter-container" size="mini">
            <el-input v-model="queryParams.name" class="filter-item" clearable placeholder="角色名" style="width: 200px" @keyup.enter.native="reloadRole"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reloadRole">查询</el-button>
            <el-button class="filter-item" type="success" icon="el-icon-edit" @click="addRole">新增</el-button>
          </el-form>
          <el-table
            v-loading="roleLoading"
            ref="table"
            :data="roleList"
            min-height="600"
            element-loading-text="Loading"
            border
            highlight-current-row
            @row-click="handleClickRow"
          >
            <el-table-column align="center" label="ID" width="60">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="key" label="关键字" />
            <el-table-column label="操作" align="left" width="150" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="updateRole(scope.row)">修改</el-button>
                <el-button v-if="scope.row.delete_flag==0" size="mini" type="danger" @click="deleteRole(scope.row.id,1)">禁用</el-button>
                <el-button v-if="scope.row.delete_flag==1" size="mini" type="success" @click="deleteRole(scope.row.id,0)">启用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="loadRole" />
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div slot="header">
          <span><svg-icon icon-class="menu"/>&nbsp;菜单</span>
          <el-button-group style="float: right;">
            <el-tooltip effect="dark" content="保存" placement="bottom">
              <i class="el-icon-check" style="color: #85ce61" @click="saveRights()"/>
            </el-tooltip>
          </el-button-group>
        </div>
        <div>
          <el-tree
            v-loading="menuLoading"
            ref="tree"
            :expand-on-click-node="false"
            :data="menuList"
            :default-checked-keys="menuChecked"
            check-strictly="true"
            node-key="id"
            default-expand-all
            show-checkbox
            style="font-size: 14px">
            <span slot-scope="{ node, data }" style="width: 100%">
              {{ node.label }}
            </span>
          </el-tree>
        </div>
      </el-card>
    </el-col>
    <el-dialog :title="roleDialogTitle" :visible.sync="roleDialogVisible" width="600px">
      <el-form ref="roleForm" :rules="roleRules" :model="roleTemp" label-position="left" label-width="100px" style="margin:0px 60px;width:400px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleTemp.name"/>
        </el-form-item>
        <el-form-item label="关键字" prop="key">
          <el-input v-model="roleTemp.key"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import $http from '@/utils/request'
import Treeselect from '@riophae/vue-treeselect'
import Pagination from '@/components/Pagination'
import { clearObjValue } from '@/utils/index'

export default {
  components: { Treeselect, Pagination },
  data() {
    return {
      menuList: null,
      menuLoading: true,
      menuChecked: [],
      roleList: null,
      total: 10,
      roleLoading: true,
      queryParams: {
        page: 1,
        limit: 10,
        name: ''
      },
      roleId: '',
      roleTemp: {},
      roleDialogVisible: false,
      roleDialogTitle: '',
      roleRules: {
        name: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getMenus()
    this.reloadRole()
  },
  methods: {
    getMenus() {
      this.menuLoading = true
      $http.get('/menu/query?type=4').then(response => {
        this.menuList = response.data
        this.menuLoading = false
      })
    },
    loadRole() {
      this.roleLoading = true
      $http.post('/role/query', this.queryParams).then(response => {
        this.roleList = response.data.rows
        this.total = response.data.total
        this.roleLoading = false
      })
    },
    reloadRole() {
      this.queryParams.page = 1
      this.loadRole()
    },
    handleClickRow(data) {
      this.roleId = data.id
      this.menuLoading = true
      $http.get('/role/getRights?roleId=' + this.roleId).then(response => {
        this.$refs.tree.setCheckedKeys(response.data)
        this.menuLoading = false
      })
    },
    resetTempRole() {
      clearObjValue(this.roleTemp)
      this.roleTemp = {
        id: undefined
      }
    },
    addRole() {
      this.resetTempRole()
      this.roleDialogTitle = '增加角色'
      this.roleDialogVisible = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    updateRole(row) {
      this.resetTempRole()
      this.roleTemp = Object.assign({}, row) // copy obj
      this.roleDialogTitle = '修改角色'
      this.roleDialogVisible = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    saveRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          $http.post('/role/save', this.roleTemp).then(data => {
            this.$message({
              message: '保存角色成功！',
              type: 'success'
            })
            this.roleDialogVisible = false
            this.loadRole()
          })
        } else {
          return false
        }
      })
    },
    deleteRole(id, tag) {
      $http.post('/role/delete', { id, tag }).then(data => {
        this.$message({
          message: (tag === 1 ? '禁用' : '启用') + '角色成功！',
          type: 'success'
        })
        this.roleDialogVisible = false
        this.loadRole()
      })
    },
    saveRights() {
      const keys = this.$refs.tree.getCheckedKeys()
      $http.post('/role/saveRights', { roleId: this.roleId, menus: JSON.stringify(keys) }).then(data => {
        this.$message({
          message: '权限保存成功！',
          type: 'success'
        })
      })
    }
  }
}
</script>
