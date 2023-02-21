<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formInline.username" placeholder="请输入用户名"/>
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
                      :class="index!==scope.row.roles.length-1?'m-tag-gap':''" size="default" round>
                {{ value.name }}
              </el-tag>
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
            v-model:currentPage="currentPage"
            :page-size="userListRequestParam.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="userList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <UserDialog ref="userDialog"/>
  </div>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import UserDialog from './UserDialog.vue'
import {userClient} from '@/api'

const dialogVisible = ref(false)
const userDialog = ref()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({})
const loading = ref(true)
let userList = ref([])
let currentPage = ref(1)
let userListRequestParam = {
  ids: null,
  status: null,
  level: null,
  nick_name: null,
  sections: null,
  limit: 10,
  offset: currentPage.value - 1,
}

const onSubmit = () => {
  console.log('submit!', formInline)
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const reset = (formEl: FormInstance | undefined) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const addHandler = () => {
  userDialog.value.show()
}
const editHandler = (row) => {
  userDialog.value.show(row)
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
      `确定要${!row.status ? '禁用' : '启用'}用户${row.nick_name}的账户吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
  ).then(async () => {

  }).catch(() => {
    row.status = !row.status
  })
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val - 1
  loadUserList()
}

/**
 * 加载列表数据
 */
const loadUserList = () => {
  loading.value = true
  userListRequestParam.sections = 'accounts,role'
  userClient.list(userListRequestParam).then((resp) => {
    const list = resp.list
    for (let i = 0; i < list.length; i++) {
      list[i].status = list[i].active === 1
    }
    userList.value = list
    console.log(userList.value)
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
