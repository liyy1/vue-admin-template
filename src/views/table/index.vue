<template>
  <div class="app-container">
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
          {{ scope.$index }}
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
          <el-button v-if="scope.row.delete_flag==0" size="mini" type="danger" @click="delete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getList" />

    <el-dialog :rules="rules" :title="titleMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="margin:0px 60px;">
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
        <el-button type="primary" @click="dialogStatus==='add'?addData():updateData()">保存</el-button>
      </div>
    </el-dialog>
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
      dialogStatus: '',
      titleMap: {
        update: '修改用户',
        create: '添加用户'
      },
      roleMap: [{ key: '1', value: '管理员' }, { key: '2', value: '总经理' }, { key: '3', value: '副总' }],
      rules: {
        username: [{ required: true, message: '此项内容不能为空！', trigger: 'change' }],
        realname: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        role: [{ required: true, type: 'date', message: '此项内容不能为空！', trigger: 'change' }]
      }
    }
  },
  created() {
    this.query()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.queryParams).then(response => {
        this.list = response.data
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
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    update(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.temp.createTime = new Date(this.temp.createTime)
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    delete(id) {
    },
    addData() {
    },
    updateData() {
    }
  }
}
</script>
