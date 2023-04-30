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
                <el-option label="用户名" value="nickname"/>
                <el-option label="用户code" value="code"/>
                <el-option label="用户状态" value="status"/>
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
          新增用户
        </el-button>
      </div>
      <div class="table-inner">
        <el-table v-loading="loading" :data="userList" style="width: 100%; height: 100%" border>
          <el-table-column prop="code" label="用户Code" align="center" width="100"/>
          <el-table-column prop="nick_name" label="昵称" align="center" width="120"/>
          <el-table-column prop="role.name" label="角色" align="center" width="120">
            <template #default="scope">
              <el-tag v-for="(value,index) in scope.row.roles" :key="value.id" class="mx-1"
                      :class="index!==scope.row.roles.length-1?'m-tag-gap':''" size="default">
                {{ value.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="accounts" label="账号" align="center" width="120">
            <template #default="scope">
              <el-button type="primary" text @click="showAccount(scope.row.accounts)">
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="integration" label="积分" align="center"/>
          <el-table-column prop="level" label="等级" align="center" width="120"/>
          <el-table-column prop="visit" label="文章访问量" align="center" width="120"/>
          <el-table-column prop="active" label="用户状态" align="center" width="120">
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
          <el-table-column prop="user_current_images" label="用户头像" align="center" width="120">
            <template #default="scope">
              <el-button type="primary" text @click="showUserHeadImage(scope.row.code)">
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center" width="180"/>
          <el-table-column prop="update_time" label="更新时间" align="center" width="180"/>
          <el-table-column prop="operator" label="操作" width="200px" align="center" fixed="right">
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

  <UserDialog @refresh="loadUserList" ref="userDialog"/>
  <AccountDetailsDrawer ref="accountDialog"/>
  <UserHeaderDrawer ref="userHeadImageDrawer"/>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import UserDialog from './UserDialog.vue'
import {userClient} from '@/api'
import AccountDetailsDrawer from "@/views/user/account/components/AccountDetail.vue";
import UserHeaderDrawer from "@/views/user/user/components/UserHeaderDrawer.vue";

const dialogVisible = ref(false)
const userDialog = ref()
const accountDialog = ref()
const userHeadImageDrawer = ref()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({
  query_key: 'nickname',
  query_value: null
})
const loading = ref(true)
const userList = ref([])
const currentPage = ref(1)
const total = ref(0)
const userListRequestParam = {
  ids: null,
  codes: null,
  status: null,
  level: null,
  nickname: null,
  sections: null,
  limit: 10,
  offset: 0,
}

const onSearch = () => {
  if (formInline.query_key === 'status') {
    userListRequestParam.status = formInline.query_value ? 1 : 0
  } else if (formInline.query_key === 'nickname') {
    userListRequestParam.nickname = formInline.query_value
  } else if (formInline.query_key === 'code') {
    userListRequestParam.codes = formInline.query_value
  }
  loading.value = true
  loadUserList()
}

/**
 * 处理查询主键变更事件
 */
const handleQueryKeyChange = (val: string) => {
  if (formInline.query_key === 'status') {
    userListRequestParam.nickname = null
    userListRequestParam.codes = null
  } else if (formInline.query_key === 'nickname') {
    userListRequestParam.status = null
    userListRequestParam.codes = null
  } else if (formInline.query_key === 'code') {
    userListRequestParam.nickname = null
    userListRequestParam.status = null
  }
}

const reset = (formEl: FormInstance | undefined) => {
  userListRequestParam.nickname = null
  userListRequestParam.status = null
  userListRequestParam.codes = null
  loadUserList()
}

const addHandler = () => {
  userDialog.value.show()
}
const editHandler = (row) => {
  userDialog.value.show(row)
}

/**
 * 展示账户详情页
 */
const showAccount = (accounts: any[]) => {
  accountDialog.value.show(accounts)
}

/**
 * 展示用户头像
 * @param user_code
 */
const showUserHeadImage = (user_code: any) => {
   userHeadImageDrawer.value.show(user_code)
}

/**
 * 更新用户状态
 */
const switchUserStatus = (key: string, enabled: number) => {
  //编辑用户信息
  userClient.update(key, {
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
    switchUserStatus(row['code'], 0)
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
    switchUserStatus(row['code'], row.status ? 1 : 0)
  }).catch(() => {
    row.status = !row.status
  })
}

/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  userListRequestParam.limit = pageSize;
  userListRequestParam.offset = 0
  currentPage.value = 1
  loadUserList()
}

/**
 * 翻页
 * @param pageNo
 */
const handleCurrentChange = (pageNo: number) => {
  userListRequestParam.offset = (pageNo - 1) * userListRequestParam.limit
  loadUserList()
  currentPage.value = pageNo
}

/**
 * 加载列表数据
 */
const loadUserList = () => {
  loading.value = true
  userListRequestParam.sections = 'accounts,roles'
  return userClient.list(userListRequestParam).then((resp) => {
    const list = resp.data
    total.value = resp.total
    for (let i = 0; i < list.length; i++) {
      list[i].status = list[i].active === 1
    }
    userList.value = list
    console.log(list)
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  loadUserList()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
