<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="角色描述" prop="desc">
        <el-input v-model="ruleForm.description" placeholder="请输入角色描述"/>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-switch
            v-model="ruleForm.enabled"
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
import {ElMessage, FormInstance} from 'element-plus'
import {reactive, ref} from 'vue'
import {roleClient} from '@/api'

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const title = ref('新增角色')
const emits = defineEmits<{
  (event: 'refresh'): void
}>();

const rules = reactive({
  name: [
    {required: true, message: '请输入角色名称', trigger: 'blur'},
    {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'},
  ]
})

const ruleForm = reactive({
  name: null,
  code: null,
  enabled: true,
  description: null
})

function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach((key) => {
    if (key === 'enabled') ruleForm[key] = true
    else ruleForm[key] = null
  })
}

const show = (item = {}) => {
  title.value = '新增角色'
  isEdit.value = false
  if (item['code'] !== undefined && item['code'] !== null) {
    title.value = '编辑角色'
    isEdit.value = true
    Object.keys(item).forEach((key) => {
      ruleForm[key] = item[key]
    })
  }
  dialogVisible.value = true
}

const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (isEdit.value) {
        roleClient.update(ruleForm.code, {
          name: ruleForm.name,
          enabled: ruleForm.enabled,
          description: ruleForm.description
        })
        ElMessage({
          message: '更新成功',
          type: 'success',
        })

        dialogVisible.value = false
        //刷新父页面数据
        emits('refresh')
      } else {
        roleClient.create({
          name: ruleForm.name,
          code: ruleForm.code,
          enabled: ruleForm.enabled,
          description: ruleForm.description
        })
        ElMessage({
          message: '创建成功',
          type: 'success',
        })

        dialogVisible.value = false
        //刷新父页面数据
        emits('refresh')
      }
    } else {
      ElMessage({
        message: '校验未通过',
        type: 'error',
      })
    }
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
