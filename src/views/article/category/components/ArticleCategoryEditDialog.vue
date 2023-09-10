<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item v-if="isEdit" label="分类ID" prop="id">
        <el-input v-model="ruleForm.id" disabled placeholder="分类ID"/>
      </el-form-item>
      <el-form-item label="分类名称" prop="label">
        <el-input v-model="ruleForm.label" placeholder="请输入分类名称">
          <template v-if="ruleForm.parentPath" #prepend>{{ ruleForm.parentPath }}</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit(ruleFormRef)">提交</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup>
import {ElMessage, FormInstance} from 'element-plus'
import {reactive, ref} from 'vue'
import {articleClient} from '@/api'
import {ErrorCodeType} from "@/api/ErrorCodeType";
import {Tree} from "@/views/article/category/Tree";

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增分类')
const isEdit = ref(false)
const emits = defineEmits<{
  (event: 'refresh'): void
}>();

const rules = reactive({
  label: [
    {required: true, message: '请输入分类名称', trigger: 'change'}
  ],
})

const ruleForm = reactive({
  id: null,
  label: null,
  pid: null,
  path: null,
  parentPath: null
})

function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach((key) => {
    ruleForm[key] = null
  })
}

const show = (data: Tree, edit, addChildNode = false) => {
  isEdit.value = edit
  if (edit) {
    title.value = '编辑分类'
    Object.keys(data).forEach((key) => {
      ruleForm[key] = data[key]
    })
  } else {
    title.value = '新增分类'
    ruleForm['parentPath'] = addChildNode ? data['path'] : data['parentPath']
    ruleForm['pid'] = addChildNode ? data['id'] : data['pid']
  }
  dialogVisible.value = true
}

const submit = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (isEdit.value) {
        updateArticleCategory()
      } else {
        createArticleCategory()
      }
    } else {
      ElMessage({
        message: '校验未通过',
        type: 'error',
      })
    }
  })
}

const updateArticleCategory = () => {
  if (!ruleForm.id) {
    console.log("Illegal state: category id is null")
    return
  }
  articleClient.updateCategory(ruleForm.id, {
    "name": ruleForm.label
  }).then((resp) => {
    ElMessage({
      message: '更新成功',
      type: 'success',
    })
  }).catch((resp) => {
    let msg = ErrorCodeType(resp.code)
    ElMessage({
      message: msg,
      type: 'error',
    })
  }).finally(() => {
    dialogVisible.value = false
    emits('refresh')
  })
}

const createArticleCategory = () => {
  articleClient.createCategory({
    "pid": ruleForm.pid,
    "name": ruleForm.label
  }).then((resp) => {
    ElMessage({
      message: '创建成功',
      type: 'success',
    })
  }).catch((resp) => {
    let msg = ErrorCodeType(resp.code)
    ElMessage({
      message: msg,
      type: 'error',
    })
  }).finally(() => {
    dialogVisible.value = false
    emits('refresh')
  })
}


defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
