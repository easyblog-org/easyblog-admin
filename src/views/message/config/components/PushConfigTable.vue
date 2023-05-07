<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item class="search-bar">
          <el-input v-model="formInline.query_value" placeholder="请输入" class="input-with-select"
                    @keydown.enter="onSearch">
            <template #prepend>
              <el-select v-model="formInline.query_key" placeholder="用户名" style="width: 120px"
                         @change="handleQueryKeyChange">
                <el-option label="模板编号" value="template_code"/>
                <el-option label="模块名" value="business_modules"/>
                <el-option label="事件名" value="business_events"/>
                <el-option label="推送渠道" value="channel"/>
                <el-option label="优先级" value="priority"/>
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
          新增消息规则
        </el-button>
      </div>
      <div class="table-inner">
        <el-table v-loading="loading" :data="pushConfigList" style="width: 100%; height: 100%" border>
          <el-table-column prop="business_module" label="所属模块" align="center" width="100"/>
          <el-table-column prop="business_event" label="消息/事件" align="center" width="120"/>
          <el-table-column prop="template_code" label="模板编号" align="center" width="120"/>
          <el-table-column prop="group" label="分组" align="center" width="120"/>
          <el-table-column prop="priority" label="优先级" align="center" width="120"/>
          <el-table-column prop="deleted" label="删除状态" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.deleted===true" class="mx-1" size="default" type="danger">已删除</el-tag>
              <el-tag v-else class="mx-1" size="default" type="success">未删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center" width="180"/>
          <el-table-column prop="update_time" label="更新时间" align="center" width="180"/>
          <el-table-column prop="operator" label="操作" width="260px" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="showConfigDetails(scope.row)">
                详情
              </el-button>
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
            :currentPage="currentPage"
            :page-size="pushConfigListRequestParam.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>


  <PushConfigDetailDialog ref="pushConfigDetailDialog"/>
  <PushConfigModifyDrawer @refresh="loadMessagePushConfigList" ref="pushConfigDrawer"></PushConfigModifyDrawer>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import {messagePushRuleClient, userClient} from '@/api'
import PushConfigDetailDialog from "@/views/message/config/components/PushConfigDetailDialog.vue";
import PushConfigModifyDrawer from "@/views/message/config/components/PushConfigModifyDrawer.vue";

const dialogVisible = ref(false)
const pushConfigDrawer = ref()
const pushConfigDetailDialog = ref()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({
  query_key: 'template_code',
  query_value: null
})
const loading = ref(true)
const pushConfigList = ref([])
const currentPage = ref(1)
const total = ref(0)
const pushConfigListRequestParam = {
  template_code: null,
  business_events: null,
  business_modules: null,
  channel: null,
  limit: 10,
  offset: 0,
}

const onSearch = () => {
  if (formInline.query_key === 'business_modules') {
    pushConfigListRequestParam.business_modules = formInline.query_value
  } else if (formInline.query_key === 'business_events') {
    pushConfigListRequestParam.business_events = formInline.query_value
  } else if (formInline.query_key === 'template_code') {
    pushConfigListRequestParam.template_code = formInline.query_value
  } else if (formInline.query_key === 'channel') {
    pushConfigListRequestParam.channel = formInline.query_value
  }
  loading.value = true
  loadMessagePushConfigList()
}

/**
 * 处理查询主键变更事件
 */
const handleQueryKeyChange = (val: string) => {
  if (formInline.query_key === 'business_modules') {
    pushConfigListRequestParam.business_events = null
    pushConfigListRequestParam.template_code = null
    pushConfigListRequestParam.business_events = null
  } else if (formInline.query_key === 'business_events') {
    pushConfigListRequestParam.business_modules = null
    pushConfigListRequestParam.template_code = null
    pushConfigListRequestParam.business_events = null
  } else if (formInline.query_key === 'template_code') {
    pushConfigListRequestParam.business_events = null
    pushConfigListRequestParam.business_modules = null
    pushConfigListRequestParam.business_events = null
  } else if (formInline.query_key === 'channel') {
    pushConfigListRequestParam.business_events = null
    pushConfigListRequestParam.business_modules = null
    pushConfigListRequestParam.template_code = null
  }

}

const reset = (formEl: FormInstance | undefined) => {
  pushConfigListRequestParam.business_events = null
  pushConfigListRequestParam.business_modules = null
  pushConfigListRequestParam.template_code = null
  pushConfigListRequestParam.channel = null
  formInline.query_value = null
  loadMessagePushConfigList()
}

const addHandler = () => {
  pushConfigDrawer.value.show()
}
const editHandler = (row) => {
  pushConfigDrawer.value.show(row)
}

/**
 * 展示消息规则配置详情对话框
 * @param row
 */
const showConfigDetails = (row: {}) => {
  pushConfigDetailDialog.value.show(row)
}

/**
 * 更新消息规则配置状态
 */
const switchMessageConfigStatus = (key: string, enabled: number) => {
  //编辑用户信息
  messagePushRuleClient.update(key, {
    active: enabled,
  }).then(() => {
    ElMessage({
      message: '更新成功',
      type: 'success',
    })
  }).catch(() => {
    ElMessage({
      message: '更新失败',
      type: 'error',
    })
  })
}

/**
 * 删除用户
 * @param row
 */
const del = (row) => {
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }).then(() => {
    switchMessageConfigStatus(row['code'], 0)
  })
}

/**
 * 更新用户激活状态
 * @param row
 */
const changeStatus = (row) => {
  ElMessageBox.confirm(
      `确定要${!row.status ? '禁用' : '启用'}用户${row.nick_name}的账户吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
  ).then(async () => {
    switchMessageConfigStatus(row['code'], row.status ? 1 : 0)
  }).catch(() => {
    row.status = !row.status
  })
}

/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  pushConfigListRequestParam.limit = pageSize;
  pushConfigListRequestParam.offset = 0
  currentPage.value = 1
  loadMessagePushConfigList()
}

/**
 * 翻页
 * @param pageNo
 */
const handleCurrentChange = (pageNo: number) => {
  pushConfigListRequestParam.offset = (pageNo - 1) * pushConfigListRequestParam.limit
  loadMessagePushConfigList()
  currentPage.value = pageNo
}

/**
 * 加载列表数据
 */
const loadMessagePushConfigList = () => {
  loading.value = true
  return messagePushRuleClient.list(pushConfigListRequestParam).then((resp) => {
    const list = resp.data
    total.value = resp.total
    pushConfigList.value = list
    console.log(list)
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  loadMessagePushConfigList()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
