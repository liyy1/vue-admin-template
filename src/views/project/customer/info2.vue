<template>
  <el-dialog :title="dialogTitle" :visible.sync="$store.state.customer.dialogVisible" width="900px" top="3vh" custom-class="center-dialog">
    <el-form ref="dataForm" :disabled="formDisabled" :model="data" label-position="top" style="">
      <el-row>
        <el-col :span="12">
          <el-form-item :rules="[rule_required1]" label="客户名称" prop="name">
            <el-input v-model="data.name" placeholder="客户名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :rules="[rule_required2]" label="客户等级" prop="grade">
            <el-rate v-model="data.grade"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :rules="[rule_required1]" label="地址" prop="addr">
            <el-input v-model="data.addr" placeholder="地址"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :rules="[rule_required1]" label="所属行业" prop="industry">
            <el-input v-model="data.industry" placeholder="所属行业"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :rules="[rule_required1,rule_phone]" label="联系电话" prop="tel">
            <el-input v-model="data.tel" placeholder="联系电话"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :rules="[rule_required1]" label="所属行业" prop="industry">
            <el-input v-model="data.industry" placeholder="所属行业"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :rules="[rule_required1,rule_phone]" label="联系电话" prop="tel">
            <el-input v-model="data.tel" placeholder="联系电话"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :rules="[rule_required1]" label="所属行业" prop="industry">
            <el-input v-model="data.industry" placeholder="所属行业"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :rules="[rule_required1,rule_phone]" label="联系电话" prop="tel">
            <el-input v-model="data.tel" placeholder="联系电话"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="detail">
            <el-input v-model="data.detail" type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="联系人">
            <el-card>
              <el-row v-for="(contact,index) in data.contacts" :key="contact.key">
                <el-col :span="5">
                  <!-- 动态项表单验证 'contacts.' + index + '.name' ==>> data.contacts[index].name -->
                  <el-form-item :rules="[rule_required1]" :prop="'contacts.' + index + '.name'">
                    <el-input v-model="contact.name" placeholder="姓名"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :rules="[ rule_required1,rule_phone ]" :prop="'contacts.' + index + '.tel'">
                    <el-input v-model="contact.tel" placeholder="电话"/>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item :rules="[ rule_required1 ]" :prop="'contacts.' + index + '.duty'">
                    <el-input v-model="contact.duty" placeholder="职务"/>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item :rules="[ rule_required2 ]" :prop="'contacts.' + index + '.type'">
                    <el-select v-model="contact.type" placeholder="类型">
                      <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-button type="danger" size="small" icon="el-icon-delete" @click.prevent="removeContact(contact)">删除</el-button>
                </el-col>
              </el-row>
              <el-row v-show="type !== 'detail'">
                <el-col :span="24">
                  <el-button style="width: 100%;" icon="el-icon-circle-plus" @click="addContact">点击增加新的联系人</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button v-show="type !== 'detail'" type="primary" @click="saveData">保存</el-button>
      <el-button @click="$store.state.customer.dialogVisible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import $http from '@/utils/request'
import { mapState } from 'vuex'
import { rule_required1, rule_required2, rule_phone } from '@/utils/validate'

export default {
  name: 'CustomerInfo2',
  props: {
    type: {
      type: String,
      default: 'add'
    },
    data: {
      type: Object,
      default: function() {
        return { contacts: [{ name: '' }] }
      }
    }
  },
  data() {
    return {
      types: [
        { id: 1, name: '决策者' },
        { id: 2, name: '影响者' },
        { id: 3, name: '使用者' }
      ],
      rule_required1: rule_required1,
      rule_required2: rule_required2,
      rule_phone: rule_phone
    }
  },
  computed: {
    dialogTitle() {
      if (this.type === 'add') return '增加客户信息'
      if (this.type === 'edit') return '修改客户信息'
      if (this.type === 'detail') return '客户信息详情'
    },
    formDisabled() {
      return this.type === 'detail'
    },
    ...mapState({
      show: state => state.customer.dialogVisible
    })
  },
  watch: {
    show: function(val, oldVal) {
      if (val && val !== oldVal) {
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  },
  methods: {
    addContact() {
      this.data.contacts.push({ name: '' })
    },
    removeContact(item) {
      if (this.data.contacts.length === 1) {
        this.$notify({
          title: '提示',
          message: '必须存在一个联系人',
          type: 'warning'
        })
      } else {
        const index = this.data.contacts.indexOf(item)
        if (index !== -1) {
          this.data.contacts.splice(index, 1)
        }
      }
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          $http.post('/customer/save', { customer: JSON.stringify(this.data) }).then(data => {
            this.$notify({
              title: '成功',
              message: '保存客户信息成功！',
              type: 'success'
            })
            this.$store.state.customer.dialogVisible = false
            this.$emit('reLoadList')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .center-dialog{
    /*border-radius: 4px;*/
    .el-dialog__header{
      /*border-radius: 4px 4px 0 0;*/
      /*border-bottom: 1px solid #eee;*/
      padding: 20px 20px 15px;
      background-color: #16c3b3;
      .el-dialog__title{
        color: #fff;
        text-space: 2px;
        font-size: 20px;
      }
    }
    .el-dialog__body{
      overflow-y: scroll;
      max-height: calc(94vh - 136px);
      padding: 40px 60px;
    }
    .el-dialog__footer{
      border-top: 1px solid #ddd;
    }
  }
  .el-rate{
    height: 36px;
    line-height: 2;
  }
</style>
