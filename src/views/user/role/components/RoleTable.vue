<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item>
          <el-input v-model="formInline.query_value" placeholder="Please input" class="input-with-select">
            <template #prepend>
              <el-select v-model="formInline.query_key" placeholder="角色名称" style="width: 120px">
                <el-option label="角色名称" value="name"/>
                <el-option label="角色标识" value="code"/>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :icon="Search">查询</el-button>
          <el-button @click="reset(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="util">
        <el-button type="primary" @click="addHandler">
          <el-icon>
            <Plus/>
          </el-icon>
          新增角色
        </el-button>
      </div>
      <div class="table-inner">
        <el-table v-loading="loading" :data="roleList" style="width: 100%; height: 100%" border>
          <el-table-column prop="name" label="角色名称" align="center" width="100"/>
          <el-table-column prop="code" label="角色标识" align="center" width="120"/>
          <el-table-column prop="enabled" label="角色状态" align="center" width="120">
            <template #default="scope">
              <el-switch
                  inline-prompt
                  on-value="true"
                  off-value="false"
                  active-text="启用"
                  inactive-text="禁用"
                  v-model="scope.row.status"
                  @change="changeStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="description" label="角色描述" align="center" width="200" show-overflow-tooltip="true"/>
          <el-table-column prop="create_time" :formatter="formatDate" label="创建时间" align="center" width="180"/>
          <el-table-column prop="update_time" :formatter="formatDate" label="更新时间" align="center" width="180"/>
          <el-table-column prop="operator" label="操作" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)">
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
            :page-size="roleListRequestParam.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="roleList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <RoleDialog ref="roleDialog"/>
  </div>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import {roleClient} from '@/api'
import RoleDialog from "@/views/user/role/components/RoleDialog.vue";
import {formatDateTime} from "@/utils/date";


const dialogVisible = ref(false)
const roleDialog = ref()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({
  query_key: 'name',
  query_value: null
})
const loading = ref(true)
let roleList = ref([])
let currentPage = ref(1)
let roleListRequestParam = {
  id: null,
  codes: null,
  name: null,
  enabled: null,
  limit: 10,
  offset: currentPage.value - 1,
}


/**
 * 格式化日期
 * @param row
 * @param column
 * @param cellValue
 * @param index
 */
const formatDate = (row, column, cellValue, index) => {
  return formatDateTime(cellValue);
}

/**
 * 提交查询
 */
const onSubmit = () => {
  console.log('submit!', formInline)
  loading.value = true
  let query: string = formInline.query_key;
  roleListRequestParam.enabled = true;
  if (query === 'name') {
    roleListRequestParam.name = formInline.query_value;
  } else if (query === 'code') {
    roleListRequestParam.codes = formInline.query_value;
  }
  loadRoleList()
  loading.value = false
  roleListRequestParam.name = null;
  roleListRequestParam.codes = null;
}

const reset = (formEl: FormInstance | undefined) => {
  loading.value = true
  roleListRequestParam.enabled = null;
  roleListRequestParam.name = null;
  roleListRequestParam.codes = null;
  formInline.query_value = null
  formInline.query_key = 'name'
  loadRoleList()
  loading.value = false
}

const addHandler = () => {
  roleDialog.value.show()
}
const editHandler = (row) => {
  roleDialog.value.show(row)
}

const del = (row) => {
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
      .then(() => {
      })
      .catch(() => {
      })
}
const changeStatus = (row) => {
  console.log(row)
  ElMessageBox.confirm(
      `确定要${!row.status ? '禁用' : '启用'}当前角色吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
  ).then(async () => {

  })
      .catch(() => {
        row.status = !row.status
      })
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val - 1
  loadRoleList()
}

/**
 * 加载列表数据
 */
const loadRoleList = () => {
  loading.value = true
  roleClient.list(roleListRequestParam).then((resp) => {
    const list = resp.list
    for (let i = 0; i < list.length; i++) {
      list[i].status = list[i].enabled
    }
    roleList.value = list
    console.log(roleList.value)
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  loadRoleList()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
