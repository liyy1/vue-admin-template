<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" style="">
        <el-card class="box-card">
          <div slot="header">
            <span><svg-icon icon-class="dept"/>&nbsp;部门</span>
          </div>
          <div>
            <el-tree :expand-on-click-node="false" :data="data5" node-key="id" default-expand-all>
              <span slot-scope="{ node, data }" class="dept-tree-node">
                <span>
                  <svg-icon icon-class="dept"/>
                  {{ node.label }}
                </span>
                <span style="float: right">
                  <el-button-group>
                    <el-button size="mini" icon="el-icon-edit" @click="() => append(data)"/>
                    <el-button size="mini" icon="el-icon-delete" @click="() => remove(node, data)"/>
                  </el-button-group>
                </span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-form ref="form" :inline="true" :model="queryParams" class="filter-container" size="mini">
          <el-input v-model="queryParams.username" class="filter-item" placeholder="用户名" style="width: 200px" @keyup.enter.native="query"/>
          <el-select v-model="queryParams.role" class="filter-item" placeholder="角色" clearable style="width: 150px">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query">查询</el-button>
          <el-button class="filter-item" type="success" icon="el-icon-edit" @click="add">新增</el-button>
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
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="username" label="帐号" />
          <el-table-column prop="realname" label="姓名" />
          <el-table-column prop="roleName" label="角色" />
          <el-table-column align="center" prop="createTime" label="创建时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"/>
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="update(scope.row)">修改</el-button>
              <el-button v-if="scope.row.delete_flag==0" size="mini" type="danger" @click="delete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getList" />
      </el-col>
    </el-row>

    <el-dialog :rules="rules" :title="dialogTitle" :visible.sync="dialogVisible" width="700px">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="margin:0px 60px;width:500px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="temp.realname"/>
        </el-form-item>
        <el-form-item label="角色" prop="type">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleMap" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="createTime">
          <el-date-picker v-model="temp.createTime" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { query, saveUser, deleteUser } from '@/api/system/user'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      list: null,
      total: 10,
      listLoading: true,
      queryParams: {
        page: 1,
        limit: 20,
        username: '',
        role: ''
      },
      temp: {
        id: undefined,
        username: '',
        realname: '',
        role: '',
        createTime: new Date(),
        remark: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      roleMap: [{ key: '1', value: '管理员' }, { key: '2', value: '总经理' }, { key: '3', value: '副总' }],
      rules: {
        username: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        realname: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        role: [{ required: true, type: 'date', message: '此项内容不能为空！', trigger: 'change' }]
      },
      data5: JSON.parse(JSON.stringify(data))
    }
  },
  created() {
    this.query()
  },
  methods: {
    getList() {
      this.listLoading = true
      query(this.queryParams).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    query() {
      this.queryParams.page = 1
      this.getList()
    },
    parseTime(data) {
      return parseTime(data)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        realname: '',
        role: '',
        createTime: new Date(),
        remark: ''
      }
    },
    add() {
      this.resetTemp()
      this.dialogTitle = '增加用户'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    update(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.createTime = new Date(this.temp.createTime)
      this.dialogTitle = '修改用户'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      saveUser(this.temp).then(data => {
        this.$message({
          message: '保存用户成功！',
          type: 'success'
        })
        this.dialogVisible = false
        this.query
      })
    },
    delete(id) {
      deleteUser(id).then(data => {
        this.$message({
          message: '删除用户成功！',
          type: 'success'
        })
        this.dialogVisible = false
        this.query
      })
    },
    append(data) {
      const newChild = { id: 1, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, data) {
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
    height: 40px;
  }
  .dept-tree-node{
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
</style>
