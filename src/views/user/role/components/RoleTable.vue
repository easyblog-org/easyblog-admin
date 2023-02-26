<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item>
          <el-input v-model="formInline.query_value" placeholder="请输入" class="input-with-select"
                    @keydown.enter="onSearch" @change="handleQueryKeyChange">
            <template #prepend>
              <el-select v-model="formInline.query_key" placeholder="角色名称" style="width: 120px">
                <el-option label="角色名称" value="name"/>
                <el-option label="角色标识" value="code"/>
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
          <el-table-column prop="description" label="角色描述" align="center" width="200" :show-overflow-tooltip="true"/>
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
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <RoleDialog @refresh="loadRoleList" ref="roleDialog"/>
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
let total = ref(0)
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
const onSearch = () => {
  let query: string = formInline.query_key;
  roleListRequestParam.enabled = true;
  if (query === 'name') {
    roleListRequestParam.name = formInline.query_value;
  } else if (query === 'code') {
    roleListRequestParam.codes = formInline.query_value;
  }
  loadRoleList()
}

/**
 * 重置查询
 * @param formEl
 */
const reset = (formEl: FormInstance | undefined) => {
  roleListRequestParam.enabled = null;
  roleListRequestParam.name = null;
  roleListRequestParam.codes = null;
  formInline.query_value = null
  formInline.query_key = 'name'
  loadRoleList()
}

/**
 * 处理查询主键变更事件
 */
const handleQueryKeyChange = (val: string) => {
  if (formInline.query_key === 'name') {
    roleListRequestParam.codes = null;
  } else if (formInline.query_key === 'code') {
    roleListRequestParam.name = null;
  }
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
  }).then(() => {
    switchRoleStatus(row['code'], false)
  }).catch(() => {
    loading.value = false
  })
}

/**
 * 更新状态
 * @param row
 */
const changeStatus = (row) => {
  ElMessageBox.confirm(
      `确定要${!row.status ? '禁用' : '启用'}当前角色吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
  ).then(async () => {
    switchRoleStatus(row['code'], !row['enabled'])
  }).catch(() => {
    row.status = !row.status
    ElMessage({
      message: '更新失败',
      type: 'error',
    })
  })
}

/**
 * 切换角色状态
 * @param key
 * @param enabled
 */
const switchRoleStatus = (key: string, enabled: boolean) => {
  loading.value = true
  roleClient.update(key, {
    enabled: enabled
  })
  loading.value = false
  ElMessage({
    message: '更新成功',
    type: 'success',
  })
}

/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  roleListRequestParam.limit = pageSize;
  roleListRequestParam.offset = 0
  currentPage.value = 1
  loadRoleList()
}

/**
 * 翻页
 * @param val
 */
const handleCurrentChange = (pageNo: number) => {
  roleListRequestParam.offset = (pageNo - 1) * roleListRequestParam.limit
  loadRoleList()
  currentPage.value = pageNo
}

/**
 * 加载列表数据
 */
const loadRoleList = () => {
  loading.value = true
  roleClient.list(roleListRequestParam).then((resp) => {
    const list = resp.data
    total.value = resp.total
    for (let i = 0; i < list.length; i++) {
      list[i].status = list[i].enabled
    }
    roleList.value = list
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
