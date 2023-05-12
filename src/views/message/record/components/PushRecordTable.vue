<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item class="search-bar">
          <el-input v-model="formInline.query_value" placeholder="请输入" class="input-with-select"
                    @keydown.enter="onSearch">
            <template #prepend>
              <el-select v-model="formInline.query_key" placeholder="推送渠道" style="width: 120px"
                         @change="handleQueryKeyChange">
                <el-option label="推送状态" value="status"/>
                <el-option label="推送渠道" value="channel"/>
                <el-option label="业务系统" value="buziness_module"/>
                <el-option label="业务事件" value="buziness_event"/>
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
      <div class="table-inner">
        <el-table v-loading="loading" :data="userList" style="width: 100%; height: 100%" border>
          <el-table-column prop="business_id" label="业务ID" align="center" width="100"/>
          <el-table-column prop="buziness_module" label="业务模块" align="center" width="120"/>
          <el-table-column prop="buziness_event" label="业务事件" align="center" width="140"/>
           <el-table-column prop="channel" label="推送渠道" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.channel===10" class="mx-1" size="default" type="success">普通邮件</el-tag>
              <el-tag v-if="scope.row.channel===11" class="mx-1" size="default" type="success">普通邮件</el-tag>
              <el-tag v-if="scope.row.channel===20" class="mx-1" size="default" type="success">短信</el-tag>
              <el-tag v-if="scope.row.channel===30" class="mx-1" size="default" type="success">微信通知</el-tag>
            </template>
           </el-table-column>
            <el-table-column prop="status" label="推送状态" align="center" width="120"/>
            <el-table-column prop="retry_times" label="重试次数" align="center" width="120"/>
            <el-table-column prop="fail_reason" label="失败原因" align="center" width="256"/>
          <el-table-column prop="create_time" label="创建时间" align="center" width="180"/>
          <el-table-column prop="update_time" label="更新时间" align="center" width="180"/>
          <el-table-column prop="operator" label="操作" width="280px" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="DataLine" @click="showDetils(scope.row)">
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
            :page-size="userListRequestParam.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

  <PushRecordDrawer @refresh="loadPushRecordList" ref="pushRecordDrawer"/>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import {messagePushRecordClient} from '@/api'

const drawerVisible = ref(false)
const pushRecordDrawer  = ref()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({
  query_key: 'channel',
  query_value: null
})
const loading = ref(true)
const pushRecordList = ref([])
const currentPage = ref(1)
const total = ref(0)
const pushRecordListRequestParam = {
  business_moudle: null,
  business_event: null,
  status: null,
  channel: null,
  limit: 10,
  offset: 0,
}

const onSearch = () => {
  if (formInline.query_key === 'status') {
    pushRecordListRequestParam.status = formInline.query_value ? 1 : 0
  } else if (formInline.query_key === 'business_moudle') {
    pushRecordListRequestParam.business_moudle = formInline.query_value
  } else if (formInline.query_key === 'business_event') {
    pushRecordListRequestParam.business_event = formInline.query_value
  }else if (formInline.query_key === 'channel') {
    pushRecordListRequestParam.channel = formInline.query_value
  }
  loading.value = true
  loadPushRecordList()
}

/**
 * 处理查询主键变更事件
 */
const handleQueryKeyChange = (val: string) => {
  if (formInline.query_key === 'status') {
    pushRecordListRequestParam.business_moudle = null
    pushRecordListRequestParam.business_event = null
    pushRecordListRequestParam.channel = null
  } else if (formInline.query_key === 'business_moudle') {
    pushRecordListRequestParam.status = null
    pushRecordListRequestParam.business_event = null
    pushRecordListRequestParam.channel = null
  } else if (formInline.query_key === 'business_event') {
    pushRecordListRequestParam.business_moudle = null
    pushRecordListRequestParam.status = null
     pushRecordListRequestParam.channel = null
  } else if (formInline.query_key === 'channel') {
      pushRecordListRequestParam.business_moudle = null
    pushRecordListRequestParam.business_event = null
    pushRecordListRequestParam.status = null
  }
}

const reset = (formEl: FormInstance | undefined) => {
  pushRecordListRequestParam.business_moudle = null
  pushRecordListRequestParam.status = null
  pushRecordListRequestParam.business_event = null
  pushRecordListRequestParam.channel = null
  loadPushRecordList()
}

const showDetils = (row) => {
  pushRecordDrawer.value.show(row)
}


const editHandler = (row) => {
  pushRecordDrawer.value.show(row)
}


/**
 * 删除推送记录
 * @param row
 */
const del = (row) => {
  loading.value=true
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }).then(() => {
    messagePushRecordClient.update(row['id'], {
    deleted: true,
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
  }).finally(()=>{
    loading.value=true
  })
}



/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  pushRecordListRequestParam.limit = pageSize;
  pushRecordListRequestParam.offset = 0
  currentPage.value = 1
  loadPushRecordList()
}

/**
 * 翻页
 * @param pageNo
 */
const handleCurrentChange = (pageNo: number) => {
  pushRecordListRequestParam.offset = (pageNo - 1) * pushRecordListRequestParam.limit
  loadPushRecordList()
  currentPage.value = pageNo
}

/**
 * 加载列表数据
 */
const loadPushRecordList = () => {
  loading.value = true
  return messagePushRecordClient.list(pushRecordListRequestParam).then((resp) => {
    const list = resp.data
    total.value = resp.total
    pushRecordList.value = list
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  loadPushRecordList()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
