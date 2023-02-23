<template>
  <el-drawer v-model="dialogVisible" :title="title" size="50%" @close="close">
    <el-table v-loading="loading" :data="accountList" stripe style="width: 100%">
      <el-table-column prop="identity_type" label="账号类型" width="180">
        <template #default="scope">
          <el-tag v-if="scope.row.identity_type===1" class="mx-1" size="default" >Email</el-tag>
          <el-tag v-if="scope.row.identity_type===2" class="mx-1" size="default" >Phone</el-tag>
          <el-tag v-if="scope.row.identity_type===3" class="mx-1" size="default" >QQ</el-tag>
          <el-tag v-if="scope.row.identity_type===4" class="mx-1" size="default" >微信</el-tag>
          <el-tag v-if="scope.row.identity_type===5" class="mx-1" size="default" >微博</el-tag>
          <el-tag v-if="scope.row.identity_type===6" class="mx-1" size="default" >GitHub</el-tag>
          <el-tag v-if="scope.row.identity_type===7" class="mx-1" size="default" >Gitee</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="identifier" label="账号" width="180"/>
      <el-table-column prop="credential" label="密码"/>
      <el-table-column prop="verified" label="账号已验证">
        <template #default="scope">
          <el-tag v-if="scope.row.verified===1" class="mx-1" size="default" type="success" >true</el-tag>
          <el-tag v-if="scope.row.verified===0" class="mx-1" size="default" type="danger" >false</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="账号状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status===1" class="mx-1" size="default" type="success" >true</el-tag>
          <el-tag v-if="scope.row.status===0" class="mx-1" size="default" type="danger" >false</el-tag>
        </template>
      </el-table-column>
    </el-table>
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
import {FormInstance} from "element-plus";

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const title = ref('账户详情')
const accountList = ref();
const loading = ref(true)

function close() {
  dialogVisible.value = false
}

const show = (accounts = []) => {
  title.value = '账户详情'
  console.log(accounts)
  accountList.value = accounts
  dialogVisible.value = true
}

defineExpose({
  show,
})


onMounted(() => {
  loading.value=false
})

</script>
