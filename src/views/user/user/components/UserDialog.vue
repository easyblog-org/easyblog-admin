<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="昵称" prop="nick_name">
        <el-input v-model="ruleForm.nick_name" placeholder="请输入昵称"/>
      </el-form-item>
      <el-form-item label="关联角色" prop="roles">
        <el-select
            v-model="ruleForm.roles"
            multiple
            placeholder="请选择"
            style="width: 100%"
        >
          <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱号" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入邮箱号"/>
      </el-form-item>
      <el-form-item label="账户密码">
        <el-input
            v-model="ruleForm.password"
            placeholder="请输入账户密码,如果不输入默认 admin123456"
            type="password"
            clearable
        />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-switch
            v-model="ruleForm.status"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {onMounted, reactive, ref} from 'vue'
import {roleClient, userClient} from "@/api";

let roleList = ref([])
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const title = ref('新增用户')

const rules = reactive({
  username: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
  ],
  roles: [{required: true, message: '请选择角色', trigger: 'change'}],
  email: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
})

const ruleForm = reactive({
  nick_name: null,
  code: null,
  roles: null,
  email: null,
  password: null,
  status: true,
})

function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach((key) => {
    if (key === 'active') ruleForm[key] = true
    else ruleForm[key] = null
  })
}

const show = (item = {}) => {
  title.value = '新增用户'
  isEdit.value = false
  if (item['code'] !== undefined && item['code'] !== null) {
    title.value = '编辑用户'
    isEdit.value = true
    Object.keys(item).forEach((key) => {
      ruleForm[key] = item[key]
    })
  }
  dialogVisible.value = true
}

/**
 * 处理提交事件
 * @param done
 */
const handleSubmit = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (isEdit) {
        //编辑用户信息
        userClient.update(ruleForm.code, {
          username: ruleForm.nick_name,
          roles: ruleForm.roles,
          email: ruleForm.email,
          password: ruleForm.password,
          active: ruleForm.status,
        })
        ElMessage({
          message: '更新成功',
          type: 'success',
        })
      } else {
        //创建新用户
        userClient.create({
          nickname: ruleForm.nick_name,
          roles: ruleForm.roles,
          email: ruleForm.email,
          password: ruleForm.password,
          active: ruleForm.status,
        })
        ElMessage({
          message: '编辑成功',
          type: 'success',
        })
      }
      dialogVisible.value = false
    } else {
      ElMessage({
        message: '校验未通过',
        type: 'error',
      })
    }
  })
}

/**
 * 加载列表数据
 */
const loadRoleList = () => {
  roleClient.list(null).then((resp) => {
    const list = resp.list
    for (let i = 0; i < list.length; i++) {
      list[i].status = list[i].enabled
    }
    roleList.value = list
  })
}

defineExpose({
  show,
})

onMounted(() => {
  loadRoleList()
})
</script>
<style lang="scss" scoped></style>
