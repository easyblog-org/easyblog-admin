<template>
  <el-drawer v-model="dialogVisible" :title="title" size="50%" @close="close">
   <div v-if="total===0">
     <el-empty :image-size="200"/>
   </div >
    <div class="account-table-body" v-if="total!==0">
      <div class="table-inner">
        <el-table v-loading="loading" :data="loginLogList" stripe style="width: 100%">
          <el-table-column prop="location" label="登录地点" width="200"/>
          <el-table-column prop="ip_address" label="登录IP" width="200"/>
          <el-table-column prop="device" label="登录设备" width="200"/>
          <el-table-column prop="operation_system" label="操作系统" width="200"/>
          <el-table-column prop="status" label="登录状态">
            <template #default="scope">
              <el-tag v-if="scope.row.status===1" class="mx-1" size="default" type="success">ONLINE</el-tag>
              <el-tag v-if="scope.row.status===0" class="mx-1" size="default" type="danger">OFFLINE</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="登录时间" width="200"/>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination
            v-model:currentPage="currentPage"
            :page-size="queryLoginLogsParam.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </span>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {ElMessage, FormInstance} from "element-plus";
import {loginClient} from "@/api";

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const title = ref('登录日志')
const loginLogList = ref();
const loading = ref(true)
const currentPage = ref(1)
const total = ref(0)
const queryLoginLogsParam = {
  user_code: null,
  account_code: null,
  limit: 10,
  offset: 0
}

function close() {
  dialogVisible.value = false
}

const show = (user_code: string, account_code: string) => {
  title.value = '登录日志'
  console.log(user_code + "," + account_code)
  queryLoginLogsParam.user_code = user_code
  queryLoginLogsParam.account_code = account_code
  loadLoginLogs()
}

/**
 * 加载登录日志列表
 */
const loadLoginLogs = () => {
  loginClient.loginLogs(queryLoginLogsParam).then((resp) => {
    console.log(resp)
    if (undefined === resp || null === resp ||
        undefined === resp.data || null === resp.data) return
    loginLogList.value = resp.data
    total.value = resp.total
    dialogVisible.value = true
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  }).finally(() => {
    loading.value = false
  })
}


/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  queryLoginLogsParam.limit = pageSize;
  queryLoginLogsParam.offset = 0
  currentPage.value = 1
  loadLoginLogs()
}

/**
 * 翻页
 * @param val
 */
const handleCurrentChange = (pageNo: number) => {
  queryLoginLogsParam.offset = (pageNo - 1) * queryLoginLogsParam.limit
  loadLoginLogs()
  currentPage.value = pageNo
}

defineExpose({
  show,
})


onMounted(() => {
  loading.value = true
})

</script>
