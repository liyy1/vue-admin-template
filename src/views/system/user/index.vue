<template>
  <div class="app-container">
    <el-container>
      <el-aside style="width: 300px">
        <el-card>
          <div slot="header">
            <span><svg-icon icon-class="dept"/>&nbsp;部门</span>
            <el-button-group style="float: right;">
              <el-tooltip effect="dark" content="添加" placement="bottom">
                <i class="el-icon-plus" style="color: #85ce61" @click="addDept(data)"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="修改" placement="bottom">
                <i class="el-icon-edit" style="color:#409EFF;" @click="updateDept(data)"/>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="bottom">
                <i class="el-icon-delete" style="color:#f56c6c;" @click="deleteDept(data)"/>
              </el-tooltip>
              <!--el-button size="mini" icon="el-icon-plus" @click="() => append(data)"/>
              <el-button size="mini" icon="el-icon-deleteUser" @click="() => remove(node, data)"/>-->
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
      <el-main style="padding: 0 0 0 20px">
        <el-form ref="form" :inline="true" :model="queryParams" class="filter-container" size="mini">
          <el-input v-model="queryParams.username" class="filter-item" clearable placeholder="用户名" style="width: 200px" @keyup.enter.native="reload"/>
          <el-select v-model="queryParams.role" class="filter-item" placeholder="角色" clearable style="width: 150px">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reload">查询</el-button>
          <el-button class="filter-item" type="success" icon="el-icon-edit" @click="addUser">新增</el-button>
        </el-form>

        <el-table
          v-loading="listLoading"
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

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getUsers" />
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
      <el-form ref="userForm" :rules="rules" :model="tempUser" label-position="left" label-width="100px" style="margin:0px 60px;width:500px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="tempUser.username"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="tempUser.realname"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="tempUser.phone"/>
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <treeselect v-model="tempUser.dept" :options="deptList" :default-expand-level="2" class="filter-item" placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="tempUser.role">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="tempUser.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门负责人" prop="isLeader">
          <el-radio-group v-model="tempUser.isLeader">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import Pagination from '@/components/Pagination'
import { queryUser, saveUser, deleteUser, queryDept } from '@/api/system/user'
import { queryRole } from '@/api/system/role'
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
      listLoading: true,
      queryParams: {
        page: 1,
        limit: 20,
        username: '',
        role: '',
        dept: ''
      },
      tempUser: {},
      tempDept: {},
      dialogVisible: false,
      dialogTitle: '',
      roleMap: [{ key: '1', value: '管理员' }, { key: '2', value: '总经理' }, { key: '3', value: '副总' }],
      rules: {
        username: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        realname: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        phone: [
          { required: true, message: '此项内容不能为空！', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        dept: [{ required: true, type: 'date', message: '此项内容不能为空！', trigger: 'change' }],
        role: [{ required: true, type: 'date', message: '此项内容不能为空！', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getDepts()
    this.getRoles()
    this.reload()
  },
  methods: {
    getRoles() {
      queryRole().then(response => {
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
      this.getUsers()
      scrollTo(0, 800)
    },
    getUsers() {
      this.listLoading = true
      queryUser(this.queryParams).then(response => {
        this.userList = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    reload() {
      this.queryParams.page = 1
      this.queryParams.dept = 1
      this.$nextTick(function() {
        this.$refs.tree.setCurrentKey(1)
      })
      this.getUsers()
    },
    parseTime(data) {
      return parseTime(data)
    },
    resetTempUser() {
      clearObjValue(this.tempUser)
      this.tempUser = {
        id: undefined,
        sex: 1,
        isLeader: 0
      }
    },
    addUser() {
      this.resetTempUser()
      this.dialogTitle = '增加用户'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    updateUser(row) {
      this.resetTempUser()
      this.tempUser = Object.assign({}, row) // copy obj
      this.dialogTitle = '修改用户'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    saveUser() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          saveUser(this.tempUser).then(data => {
            this.$message({
              message: '保存用户成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.queryUser()
          })
        } else {
          return false
        }
      })
    },
    deleteUser(id, tag) {
      deleteUser(id, tag).then(data => {
        this.$message({
          message: (tag === 1 ? '删除' : '启用') + '用户成功！',
          type: 'success'
        })
        this.dialogVisible = false
        this.reload()
      })
    },
    addDept(data) {
      const newChild = { id: 1, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    updateDept(data) {
      const newChild = { id: 1, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    deleteDept(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>
<style>
  .el-tree-node__content{
    height: 35px;
  }
</style>
