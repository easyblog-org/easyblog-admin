<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model="ruleForm.role_name" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="角色标识" prop="role_code">
        <el-input v-model="ruleForm.role_code" placeholder="请输入角色标识"/>
      </el-form-item>
      <el-form-item label="角色描述" prop="role_desc">
        <el-input v-model="ruleForm.role_desc" placeholder="请输入角色描述"/>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-switch
            v-model="ruleForm.role_enabled"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {reactive, ref} from 'vue'
import {roleClient} from '@/api'

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增角色')
const emit = defineEmits(["loadRoleList"])

const rules = reactive({
  role_name: [
    {required: true, message: '请输入角色名称', trigger: 'blur'},
    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
  ],
  role_code: [{required: true, message: '请输入角色表示', trigger: 'blur'}],
  role_enabled: [{required: true, message: '请选择角色是否启用', trigger: 'change'}]
})

const ruleForm = reactive({
  role_name: null,
  role_code: null,
  role_enabled: true,
  role_desc: null
})

function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach((key) => {
    if (key === 'role_enabled') ruleForm[key] = true
    else ruleForm[key] = null
  })
}

const show = (item = {}) => {
  title.value = '新增角色'
  if (item.role_code) {
    title.value = '编辑角色'
    Object.keys(item).forEach((key) => {
      ruleForm[key] = item[key]
    })
  }
  dialogVisible.value = true
}

const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      roleClient.create({
        name: ruleForm.role_name,
        code: ruleForm.role_code,
        enabled: ruleForm.role_enabled,
        description: ruleForm.role_desc
      })

      //刷新父页面数据
      emit("loadRoleList")
      window.opener.location.reload();
      dialogVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
