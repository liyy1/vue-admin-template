<template>
  <div style="display: flex; justify-content:center;padding: 15px">
    <div style="width: 1000px;background-color: #fff">
      <div class="header">
        项目基本信息
      </div>
      <div style="padding: 40px 50px 20px 50px">
        <el-form label-position="right" label-width="80px">
          <el-row :gutter="60">
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="60">
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="60">
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="60">
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="60">
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="header">
        项目需求信息
      </div>
      <div style="padding: 40px 50px 20px 50px">
        <el-form label-position="right" label-width="80px">
          <el-row :gutter="60">
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-input v-model="queryParams.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="60">
            <el-col :span="24">
              <el-form-item label="项目名称">
                <el-input :rows="3" v-model="queryParams.name" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="padding-bottom: 40px;text-align: center">
        <el-button type="primary" style="width: 300px">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryParams: {
        name: '',
        type: 1
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../../styles/variables.scss';
  .header{
    height: 45px;
    line-height: 45px;
    padding-left: 30px;
    background-color: #fafafa;
    border-left: 4px solid $themeColor;
    font-size: 16px;
    font-weight: bolder;
  }
</style>
