<template>
  <el-container>
    <el-aside>
      <el-card class="tree_dept">
        <div slot="header">
          <span><svg-icon icon-class="dept"/>&nbsp;部门</span>
          <el-button-group style="float: right;">
            <el-tooltip effect="dark" content="添加" placement="bottom">
              <i class="el-icon-plus" style="color: #85ce61" @click="addDept()"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改" placement="bottom">
              <i class="el-icon-edit" style="color:#409EFF;" @click="updateDept()"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="bottom">
              <i class="el-icon-delete" style="color:#f56c6c;" @click="deleteDept(data)"/>
            </el-tooltip>
          </el-button-group>
        </div>
        <div>
          <el-tree
            v-loading="deptLoading"
            ref="tree"
            :expand-on-click-node="false"
            :data="deptList"
            node-key="id"
            default-expand-all
            highlight-current
            style="font-size: 14px"
            @node-click="handleClickNode">
            <span slot-scope="{ node, data }" style="width: 100%">
              <svg-icon icon-class="project1"/>
              {{ node.label }}
            </span>
          </el-tree>
        </div>
      </el-card>
    </el-aside>
    <el-main style="padding: 0 0 0 15px">
      <el-card>
        <div>
          <el-form ref="form" :inline="true" :model="queryParams" class="filter-container" size="mini">
            <el-input v-model="queryParams.username" class="filter-item" clearable placeholder="用户名" style="width: 200px" @keyup.enter.native="reloadUser"/>
            <el-select v-model="queryParams.role" class="filter-item" placeholder="角色" clearable style="width: 150px">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reloadUser">查询</el-button>
            <el-button class="filter-item" type="success" icon="el-icon-edit" @click="addUser">新增</el-button>
          </el-form>

          <el-table
            v-loading="userLoading"
            :data="userList"
            min-height="600"
            element-loading-text="Loading"
            border
            highlight-current-row>
            <el-table-column align="center" label="ID" width="60">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="username" label="帐号" />
            <el-table-column prop="realname" label="姓名" />
            <el-table-column prop="deptName" label="部门" />
            <el-table-column prop="roleName" label="角色" />
            <el-table-column align="center" prop="createTime" label="创建时间" width="200">
              <template slot-scope="scope">
                <i class="el-icon-time"/>
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" width="150" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="updateUser(scope.row)">修改</el-button>
                <el-button v-if="scope.row.delete_flag==0" size="mini" type="danger" @click="deleteUser(scope.row.id,1)">禁用</el-button>
                <el-button v-if="scope.row.delete_flag==1" size="mini" type="success" @click="deleteUser(scope.row.id,0)">启用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="loadUser" />
        </div>
      </el-card>
    </el-main>
    <el-dialog :title="userDialogTitle" :visible.sync="userDialogVisible" width="800px">
      <el-form ref="userForm" :rules="userRules" :model="userTemp" label-position="left" label-width="100px" style="margin:0px 60px;width:500px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userTemp.username"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="userTemp.realname"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="userTemp.phone"/>
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <treeselect v-model="userTemp.dept" :options="deptList" :default-expand-level="2" placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userTemp.role">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userTemp.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门负责人" prop="isLeader">
          <el-radio-group v-model="userTemp.isLeader">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="deptDialogTitle" :visible.sync="deptDialogVisible" width="600px">
      <el-form ref="deptForm" :rules="deptRules" :model="deptTemp" label-position="left" label-width="100px" style="margin:0px 60px;width:400px;">
        <el-form-item label="上级部门">
          <treeselect v-model="deptTemp.parentId" :options="deptList" :default-expand-level="2" :clearable="false" placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="deptTemp.name"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deptDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDept">保存</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import Pagination from '@/components/Pagination'
import { queryUser, saveUser, deleteUser, queryDept, saveDept, deleteDept } from '@/api/system/user'
import { getRoles } from '@/api/system/rights'
import { parseTime, clearObjValue } from '@/utils/index'
import { scrollTo } from '@/utils/scrollTo'
import { validatePhone } from '@/utils/validate'

export default {
  components: { Treeselect, Pagination },
  data() {
    return {
      roleList: null,
      deptList: null,
      deptLoading: true,
      userList: null,
      total: 10,
      userLoading: true,
      queryParams: {
        page: 1,
        limit: 10,
        username: '',
        role: '',
        dept: ''
      },
      userTemp: {},
      userDialogVisible: false,
      userDialogTitle: '',
      userRules: {
        username: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        realname: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        phone: [
          { required: true, message: '此项内容不能为空！', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        dept: [{ required: true, message: '此项内容不能为空！', trigger: 'change' }],
        role: [{ required: true, message: '此项内容不能为空！', trigger: 'change' }]
      },
      deptTemp: {},
      deptDialogVisible: false,
      deptDialogTitle: '',
      deptRules: {
        name: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getDepts()
    this.getRoles()
    this.reloadUser()
  },
  methods: {
    getRoles() {
      getRoles().then(response => {
        this.roleList = response.data
      })
    },
    getDepts() {
      this.deptLoading = true
      queryDept().then(response => {
        this.deptList = response.data
        this.deptLoading = false
      })
    },
    handleClickNode(data) {
      this.queryParams.dept = data.id
      this.queryParams.page = 1
      this.loadUser()
      scrollTo(0, 800)
    },
    loadUser() {
      this.userLoading = true
      queryUser(this.queryParams).then(response => {
        this.userList = response.data.rows
        this.total = response.data.total
        this.userLoading = false
      })
    },
    reloadUser() {
      this.queryParams.page = 1
      this.queryParams.dept = 1
      this.loadUser()
      setTimeout(() => {
        this.$refs.tree.setCurrentKey(1)
      }, 500)
    },
    parseTime(data) {
      return parseTime(data)
    },
    resetTempUser() {
      clearObjValue(this.userTemp)
      this.userTemp = {
        id: undefined,
        sex: 1,
        isLeader: 0
      }
    },
    addUser() {
      this.resetTempUser()
      this.userDialogTitle = '增加用户'
      this.userDialogVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    updateUser(row) {
      this.resetTempUser()
      this.userTemp = Object.assign({}, row) // copy obj
      this.userDialogTitle = '修改用户'
      this.userDialogVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    saveUser() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          saveUser(this.userTemp).then(data => {
            this.$message({
              message: '保存用户成功！',
              type: 'success'
            })
            this.userDialogVisible = false
            this.loadUser()
          })
        } else {
          return false
        }
      })
    },
    deleteUser(id, tag) {
      deleteUser(id, tag).then(data => {
        this.$message({
          message: (tag === 1 ? '禁用' : '启用') + '用户成功！',
          type: 'success'
        })
        this.userDialogVisible = false
        this.loadUser()
      })
    },
    addDept() {
      this.deptTemp = {
        id: undefined,
        parentId: this.$refs.tree.getCurrentKey()
      }
      this.deptDialogTitle = '增加用户'
      this.deptDialogVisible = true
      this.$nextTick(() => {
        this.$refs['deptForm'].clearValidate()
      })
    },
    updateDept() {
      const node = this.$refs.tree.getCurrentNode()
      this.deptTemp = {
        id: node.id,
        name: node.name,
        parentId: node.parentId
      }
      this.deptDialogTitle = '增加用户'
      this.deptDialogVisible = true
      this.$nextTick(() => {
        this.$refs['deptForm'].clearValidate()
      })
    },
    saveDept() {
      this.$refs['deptForm'].validate((valid) => {
        if (valid) {
          if (this.deptTemp.parentId === this.deptTemp.id) {
            this.$message('上级部门不能是本部门！')
          } else {
            saveDept(this.deptTemp).then(data => {
              this.$message({
                message: '保存部门成功！',
                type: 'success'
              })
              this.deptDialogVisible = false
              this.getDepts()
            })
          }
        }
      })
    },
    deleteDept() {
      const node = this.$refs.tree.getCurrentNode()
      this.$confirm('部门删除后不可恢复, 确认删除"' + node.name + '"?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDept(node.id).then(data => {
          this.$message({
            message: '删除部门成功！',
            type: 'success'
          })
          this.getDepts()
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-container{
    height: 100%;
    .el-aside{
      width: 300px;
      .tree_dept{
        .el-card__body{
          max-height: calc(100vh - 170px);;
          overflow: auto;
        }
      }
    }
  }
</style>
