<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item class="search-bar">
          <el-input v-model="formInline.query_value" placeholder="请输入" class="input-with-select"
                    @keydown.enter="onSearch">
            <template #prepend>
              <el-select v-model="formInline.query_key" placeholder="国家/地区码" style="width: 140px"
                         @change="handleQueryKeyChange">
                <el-option label="国家/地区码" value="country_code"/>
                <el-option label="国家/地区名称" value="area_name"/>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" :icon="Search">查询</el-button>
          <el-button @click="reset(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="util">
        <el-button type="primary" @click="addPhoneArea">
          <el-icon>
            <Plus/>
          </el-icon>
          新增国际冠码与国码
        </el-button>
      </div>
      <div class="table-inner">
        <el-table
            v-loading="loading"
            :data="phoneAreaDetailListData" style="width: 100%;height: 100%" border>
          <el-table-column prop="crown_code" width="130" label="国家冠码" align="center"/>
          <el-table-column prop="country_code" width="130" label="国家/地区码" align="center"/>
          <el-table-column prop="area_name" width="180" label="国家/地区名" align="center"/>
          <el-table-column prop="create_time" label="创建时间" align="center" width="180"/>
          <el-table-column prop="update_time" label="更新时间" align="center" width="180"/>
          <el-table-column prop="operator" label="操作" width="200px" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="editPhoneArea(scope.row)">
                编辑
              </el-button>
              <el-button @click="del(scope.row)" type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
            v-model:currentPage="currentPage"
            :page-size="queryPhoneAreaRequest.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <PhoneAreaEntryDialog ref="phoneAreaEntryDialog"/>
  </div>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {reactive, ref} from 'vue'
import PhoneAreaEntryDialog from './PhoneAreaEntryDialog.vue'
import {phoneAreaClient} from "@/api";

const phoneAreaDetailListData = ref()
const dialogVisible = ref(false)
const phoneAreaEntryDialog = ref()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({
  query_key: 'country_code',
  query_value: null
})
const loading = ref(true)
const currentPage = ref(1)
const total = ref(0)
const queryPhoneAreaRequest = {
  continent_code: null,
  country_code: null,
  area_name: null,
  limit: 10,
  offset: 0
}

/***
 * 处理查询主键变更事件
 */
const handleQueryKeyChange = (val: string) => {
  if (formInline.query_key === 'country_code') {
    queryPhoneAreaRequest.area_name = null
  } else if (formInline.query_key === 'area_name') {
    queryPhoneAreaRequest.country_code = null
  }
}

const onSearch = () => {
  if (formInline.query_key === 'country_code') {
    queryPhoneAreaRequest.country_code = formInline.query_value
  } else if (formInline.query_key === 'area_name') {
    queryPhoneAreaRequest.area_name = formInline.query_value
  }
  loadPhoneAreaDetailListData()
}

const reset = (formEl: FormInstance | undefined) => {
  queryPhoneAreaRequest.country_code = null
  queryPhoneAreaRequest.area_name = null
  loadPhoneAreaDetailListData()
}

const getList = (data) => {
  if (!data.id) {
    queryPhoneAreaRequest.continent_code = null
    loadPhoneAreaDetailListData()
  } else {
    queryPhoneAreaRequest.continent_code = data.id
    loadPhoneAreaDetailListData()
  }
}


const addPhoneArea = () => {
  phoneAreaEntryDialog.value.show()
}
const editPhoneArea = (row) => {
  phoneAreaEntryDialog.value.show(row)
}

const del = (row) => {
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }).then(() => {
  }).catch(() => {
  })
}

/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  queryPhoneAreaRequest.limit = pageSize;
  queryPhoneAreaRequest.offset = 0
  currentPage.value = 1
  loadPhoneAreaDetailListData()
}

/**
 * 翻页
 * @param pageNo
 */
const handleCurrentChange = (pageNo: number) => {
  queryPhoneAreaRequest.offset = (pageNo - 1) * queryPhoneAreaRequest.limit
  loadPhoneAreaDetailListData()
  currentPage.value = pageNo
}

/**
 * 加载Phone Area列表数据
 */
const loadPhoneAreaDetailListData = () => {
  loading.value = true
  // 加载新数据之前需要先清空之前列表
  phoneAreaDetailListData.value = []
  phoneAreaClient.queryPhoneAreaCodeMap(queryPhoneAreaRequest).then((resp) => {
    if (!resp) return
    total.value = resp.total
    phoneAreaDetailListData.value = resp.children;
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  getList
})
</script>
<style lang="scss" scoped>
@import "../index";
</style>
