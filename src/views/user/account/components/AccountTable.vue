<template>
  <div class="app-container">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item class="search-bar">
          <el-input v-model="formInline.query_value" placeholder="请输入" class="input-with-select"
                    @keydown.enter="onSearch">
            <template #prepend>
              <el-select v-model="formInline.query_key" placeholder="账号类型" style="width: 128px"
                         @change="handleQueryKeyChange">
                <el-option label="账号类型" value="identity_type"/>
                <el-option label="账号" value="identifier"/>
                <el-option label="账号验证状态" value="verified"/>
                <el-option label="账号状态" value="status"/>
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
    <div class="account-table-body">
      <div class="table-inner">
        <el-table
            v-loading="loading"
            :data="accountList" style="width: 100%; height: 100%" border>
          <el-table-column prop="identity_type" label="账号类型" align="center" width="150">
            <template #default="scope">
              <el-tag v-if="scope.row.identity_type===0" class="mx-1" size="default" type="danger">Unknown</el-tag>
              <el-tag v-if="scope.row.identity_type===1" class="mx-1" size="default">Email</el-tag>
              <el-tag v-if="scope.row.identity_type===2" class="mx-1" size="default">Phone</el-tag>
              <el-tag v-if="scope.row.identity_type===3" class="mx-1" size="default">QQ</el-tag>
              <el-tag v-if="scope.row.identity_type===4" class="mx-1" size="default">微信</el-tag>
              <el-tag v-if="scope.row.identity_type===5" class="mx-1" size="default">微博</el-tag>
              <el-tag v-if="scope.row.identity_type===6" class="mx-1" size="default">GitHub</el-tag>
              <el-tag v-if="scope.row.identity_type===7" class="mx-1" size="default">Gitee</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="identifier" label="账号" align="center" width="180"/>
          <el-table-column prop="user_id" label="关联用户" align="center" width="180">
            <template #default="scope">
              <el-button type="primary" text @click="showUser(scope.row.user_id)">
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="verified" label="账号已验证" align="center" width="180">
            <template #default="scope">
              <el-tag v-if="scope.row.verified===1" class="mx-1" size="default" type="success">已验证</el-tag>
              <el-tag v-if="scope.row.verified===0" class="mx-1" size="default" type="danger">未验证</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账号状态" align="center" width="180">
            <template #default="scope">
              <el-tag v-if="scope.row.status===1" class="mx-1" size="default" type="success">激活</el-tag>
              <el-tag v-if="scope.row.status===0" class="mx-1" size="default" type="danger">未激活</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="login_log" label="登录日志" align="center" width="180">
            <template #default="scope">
              <el-button type="primary" text @click="showLogInLog(scope.row.user_id,scope.row.id)">
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center" width="200"/>
          <el-table-column prop="update_time" label="更新时间" align="center" width="200"/>
          <el-table-column prop="status" label="操作" align="center" width="180">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="edit(scope.row)">
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
            :page-size="accountsQueryParams.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <AccountDialog @refresh="loadAccountList" ref="accountDialog"/>
    <UserDetail ref="userDetailDrawer"></UserDetail>
    <AccountLoginLogDrawer ref="accountLoginLogDrawer"/>
  </div>
</template>

<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {onMounted, reactive, ref} from 'vue'
import {Search} from '@element-plus/icons-vue'
import {accountClient} from "@/api";
import UserDetail from "@/views/user/user/components/UserDetail.vue";
import AccountDialog from "@/views/user/account/components/AccountDialog.vue";
import AccountLoginLogDrawer from "@/views/user/account/components/AccountLoginLogDrawer.vue";

const accountList = ref([])
let currentPage = ref(1)
let total = ref(0)

const loading = ref(true)
const accountDialog = ref()
const userDetailDrawer = ref()
const accountLoginLogDrawer = ref()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({
  query_key: 'identifier',
  query_value: null
})
const accountsQueryParams = {
  ids: null,
  identifier: null,
  identity_type: null,
  verified: null,
  status: null,
  limit: 20,
  offset: 0
}

/**
 * Search
 */
const onSearch = () => {
  if (formInline.query_key === 'identity_type') {
    accountsQueryParams.identity_type = formInline.query_value
  } else if (formInline.query_key === 'identifier') {
    accountsQueryParams.identifier = formInline.query_value
  } else if (formInline.query_key === 'verified') {
    accountsQueryParams.verified = formInline.query_value ? 1 : 0
  } else if (formInline.query_key === 'status') {
    accountsQueryParams.status = formInline.query_value ? 1 : 0
  }
  loadAccountList()
}

/**
 * 重置搜索
 * @param formEl
 */
const reset = (formEl: FormInstance | undefined) => {
  accountsQueryParams.identity_type = null
  accountsQueryParams.identifier = null
  accountsQueryParams.verified = null
  accountsQueryParams.status = null
  loadAccountList()
}

/**
 * 处理查询主键变更事件
 */
const handleQueryKeyChange = (val: string) => {
  if (formInline.query_key === 'identity_type') {
    accountsQueryParams.identifier = null
    accountsQueryParams.verified = null
    accountsQueryParams.status = null
  } else if (formInline.query_key === 'identifier') {
    accountsQueryParams.identity_type = null
    accountsQueryParams.verified = null
    accountsQueryParams.status = null
  } else if (formInline.query_key === 'verified') {
    accountsQueryParams.identity_type = null
    accountsQueryParams.identifier = null
    accountsQueryParams.status = null
  } else if (formInline.query_key === 'status') {
    accountsQueryParams.identity_type = null
    accountsQueryParams.identifier = null
    accountsQueryParams.verified = null
  }
}

/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  accountsQueryParams.limit = pageSize;
  accountsQueryParams.offset = 0
  currentPage.value = 1
  loadAccountList()
}

/**
 * 翻页
 * @param val
 */
const handleCurrentChange = (pageNo: number) => {
  accountsQueryParams.offset = (pageNo - 1) * accountsQueryParams.limit
  loadAccountList()
  currentPage.value = pageNo
}

/**
 * 展示User详情
 * @param user_id
 */
const showUser = (user_id: number) => {
  userDetailDrawer.value.show(user_id)
}

/**
 * 展示登录日志
 * @param user_id
 * @param account_id
 */
const showLogInLog = (user_id: number, account_id: number) => {
  accountLoginLogDrawer.value.show(user_id, account_id)
}

/**
 * 编辑Account
 * @param row
 */
const edit = (row) => {
  accountDialog.value.show(row)
}

/**
 * 删除Account
 * @param row
 */
const del = (row) => {
  if (row.status === 0) {
    ElMessage({
      message: '账户' + row.identifier + '已经被删除！',
      type: 'warning',
    })
    return
  }
  ElMessageBox.confirm('你确定要删除账户' + row.identifier + '吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }).then(() => {
    accountClient.update(row.id, {
      status: 0,
    }).then(() => {
      ElMessage({
        message: '更新成功',
        type: 'success',
      })
      loadAccountList()
    })
  })
}


/**
 * 加载Account列表
 */
const loadAccountList = () => {
  loading.value = true;
  accountClient.list(accountsQueryParams).then((resp) => {
    if (undefined === resp || null === resp ||
        undefined === resp.data || null === resp.data) return
    const list = resp.data
    total.value = resp.total
    accountList.value = list
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  }).finally(() => {
    loading.value = false;
  })
}

onMounted(() => {
  loadAccountList();
})
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
