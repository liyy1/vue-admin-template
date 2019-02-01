<template>
  <el-container>
    <el-aside>
      <el-card>
        <div slot="header">
          <span><svg-icon icon-class="menu"/>&nbsp;菜单</span>
          <el-button-group style="float: right;">
            <el-tooltip effect="dark" content="添加" placement="bottom">
              <i class="el-icon-plus" style="color: #85ce61" @click="addMenu()"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="bottom">
              <i class="el-icon-delete" style="color:#f56c6c;" @click="deleteMenu()"/>
            </el-tooltip>
          </el-button-group>
        </div>
        <div>
          <el-tree
            v-loading="menuLoading"
            ref="tree"
            :data="menuList"
            :expand-on-click-node="false"
            :default-expanded-keys="expandedKeys"
            node-key="id"
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
        <div slot="header">
          <span><svg-icon icon-class="menu"/>&nbsp;{{ formTitle }}</span>
        </div>
        <div>
          <el-form ref="menuForm" :rules="menuRules" :model="menuTemp" :disabled="formDisabled" label-position="left" label-width="100px" style="margin:0px 60px;width:560px;">
            <el-form-item label="type" prop="type">
              <el-radio-group :disabled="typeDisabled" v-model="menuTemp.type" size="small">
                <el-tooltip content="一级路由为根路由，默认为Layout组件，必须包含二级路由" placement="top">
                  <el-radio :label="typeMap[0]" border>一级路由</el-radio>
                </el-tooltip>
                <el-tooltip content="二级路由会作为菜单显示，如果只有一个二级路由，SideBar不会显示父级菜单" placement="top">
                  <el-radio :label="typeMap[1]" border>二级路由</el-radio>
                </el-tooltip>
                <el-tooltip content="三级路由不作为菜单显示" placement="top">
                  <el-radio :label="typeMap[2]" border>三级路由</el-radio>
                </el-tooltip>
                <el-tooltip content="权限按钮，不允许重复" placement="top">
                  <el-radio :label="typeMap[3]" border>按钮</el-radio>
                </el-tooltip>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="menuPidVisible" label="parent" prop="parentId">
              <treeselect
                :disabled="formDisabled"
                v-model="menuTemp.parentId"
                :disable-branch-nodes="true"
                :options="selectMenuList"
                :default-expand-level="2"
                :clearable="false"
                :max-height="200"
                placeholder="请选择"
                @select="onSelectMenu"/>
            </el-form-item>
            <el-form-item label="name" prop="name">
              <el-input v-model="menuTemp.name" placeholder="路由名称和面包屑标题"/>
            </el-form-item>
            <el-form-item label="path" prop="path">
              <el-input v-model="menuTemp.path" placeholder="路由地址,根路由需要加前缀'/'"/>
            </el-form-item>
            <el-form-item v-if="menuUrlVisible" label="component" prop="url">
              <el-input v-model="menuTemp.url" placeholder="对应组件的地址">
                <template slot="prepend">src/views/</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="menuRedirectVisible" label="redirect" prop="redirect">
              <el-input v-model="menuTemp.redirect" placeholder="重定向地址，如果存在下级路由必须填写,需要加前缀'/'"/>
            </el-form-item>
            <el-form-item v-if="menuIconVisible" label="Icon" prop="icon">
              <el-input v-model="menuTemp.icon" placeholder="请输入图标名称">
                <template v-if="menuTemp.icon" slot="append"><svg-icon :icon-class="menuTemp.icon"/></template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="menuOrderVisible" label="order">
              <el-input-number v-model="menuTemp.order" :min="1" :max="20"/>
            </el-form-item>
          </el-form>
          <el-form label-position="left" label-width="100px" style="margin:0px 60px;width:500px;">
            <el-form-item>
              <el-button type="primary" @click="handleBtnClick()">{{ btnText }}</el-button>
              <el-button @click="handleCancel()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import $http from '@/utils/request'
import Treeselect from '@riophae/vue-treeselect'
export default {
  name: 'Menu',
  components: { Treeselect },
  data() {
    return {
      type: 'add', // detail add update
      typeMap: [1, 2, 3, 4],
      menuList: null,
      menuLoading: false,
      selectMenuList1: null,
      selectMenuList2: null,
      menuTemp: { type: 1, order: 1 },
      menuPidVisible: false,
      menuUrlVisible: false,
      menuRedirectVisible: true,
      menuIconVisible: true,
      menuOrderVisible: true,
      menuFormTitle: '',
      menuRules: {
        type: [{ required: true, message: '此项内容不能为空！', trigger: 'change' }],
        parentId: [{ required: true, message: '此项内容不能为空！', trigger: 'change' }],
        name: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        path: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        url: [{ required: true, message: '此项内容不能为空！', trigger: 'blur' }],
        component: [{ required: true, message: '此项内容不能为空！', trigger: 'change' }]
      }
    }
  },
  computed: {
    expandedKeys: function() {
      if (this.menuList) {
        return this.menuList.map(function(item, index, input) {
          return item.id
        })
      }
    },
    formDisabled: function() {
      return this.type === 'detail'
    },
    typeDisabled: function() {
      return this.type !== 'add'
    },
    btnText: function() {
      return this.type === 'detail' ? '修改' : '保存'
    },
    formTitle: function() {
      if (this.type === 'detail') return '菜单详情'
      if (this.type === 'add') return '增加菜单'
      if (this.type === 'update') return '修改菜单'
    },
    menuType: function() {
      return this.menuTemp.type
    },
    selectMenuList: function() {
      if (this.menuType === 2) {
        return this.selectMenuList1
      } else {
        return this.selectMenuList2
      }
    }
  },
  watch: {
    menuType(val) {
      if (this.type === 'add') {
        delete this.menuTemp.parentId
      }
      this.resetFormValidate()
      if (val === 1) {
        this.menuPidVisible = false
        this.menuUrlVisible = false
        this.menuIconVisible = true
        this.menuOrderVisible = true
        this.menuRedirectVisible = true
      } else if (val === 2) {
        this.menuPidVisible = true
        this.menuUrlVisible = true
        this.menuIconVisible = true
        this.menuOrderVisible = true
        this.menuRedirectVisible = true
      } else if (val === 3) {
        this.menuPidVisible = true
        this.menuUrlVisible = true
        this.menuIconVisible = false
        this.menuOrderVisible = false
        this.menuRedirectVisible = false
      } else if (val === 4) {
        this.menuPidVisible = true
        this.menuUrlVisible = false
        this.menuIconVisible = false
        this.menuOrderVisible = false
        this.menuRedirectVisible = false
      }
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    getMenus() {
      this.menuLoading = true
      $http.get('/menu/query?type=1').then(response => {
        this.selectMenuList1 = response.data
      })
      $http.get('/menu/query?type=2').then(response => {
        this.selectMenuList2 = response.data
      })
      $http.get('/menu/query?type=4').then(response => {
        this.menuList = response.data
        this.menuLoading = false
      })
    },
    resetFormValidate() {
      this.$nextTick(() => {
        this.$refs['menuForm'].clearValidate()
      })
    },
    resetTempMenu() {
      this.menuTemp = {
        id: undefined,
        type: 1,
        order: 1
      }
      this.resetFormValidate()
    },
    handleClickNode(data) {
      this.type = 'detail'
      this.resetTempMenu()
      this.menuTemp = JSON.parse(JSON.stringify(data))
    },
    onSelectMenu(node, instanceId) {
      if ((this.menuType === 3 || this.menuType === 3) && node.type === 1) {
        this.menuTemp.parentId = null
      }
    },
    addMenu() {
      this.type = 'add'
      this.resetTempMenu()
    },
    handleBtnClick() {
      if (this.type === 'detail') {
        this.type = 'update'
      } else {
        this.saveMenu()
      }
    },
    handleCancel() {
      if (this.type === 'add') {
        this.resetFormValidate()
        const mtype = this.menuTemp.type
        this.menuTemp = {
          id: undefined,
          type: mtype,
          order: 1
        }
      } else if (this.type === 'update') {
        this.resetTempMenu()
        const node = this.$refs.tree.getCurrentNode()
        this.menuTemp = JSON.parse(JSON.stringify(node))
      }
    },
    saveMenu() {
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          $http.post('/menu/save', this.menuTemp).then(data => {
            this.$message({
              message: '保存菜单成功！',
              type: 'success'
            })
            this.getMenus()
            this.type = 'detail'
          })
        }
      })
    },
    deleteMenu() {
      const node = this.$refs.tree.getCurrentNode()
      if (node) {
        this.$confirm('菜单删除后不可恢复, 确认删除"' + node.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $http.post('/menu/delete', node.id).then(data => {
            this.$message({
              message: '删除菜单成功！',
              type: 'success'
            })
            this.getMenus()
          })
        })
      } else {
        this.$message('请选择一个菜单！')
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container{
    padding: 15px;
    height: 100%;
    .el-aside{
      width: 300px;
    }
  }
</style>
