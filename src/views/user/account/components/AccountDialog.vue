<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="账户类型" prop="identity_type">
        <el-select
            v-model="ruleForm.identity_type"
            placeholder="请选择"
            style="width: 100%"
        >
          <el-option
              v-for="item in identityTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账户号码" prop="identifier">
        <el-input v-model="ruleForm.identifier" placeholder="请输入账户号码"/>
      </el-form-item>
      <el-form-item label="账户已验证" prop="verified">
        <el-switch
            v-model="ruleForm.verified"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
        ></el-switch>
      </el-form-item>
      <el-form-item label="账户状态">
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
        <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {reactive, ref} from 'vue'
import {accountClient, roleClient, staticClient} from '@/api'

const identityTypeList = ref()
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增角色')
const emits = defineEmits<{
  (event: 'refresh'): void
}>();

const rules = reactive({
  identity_type: [
    {required: true, message: '请选择账户类型', trigger: 'blur'}
  ]
})

const ruleForm = reactive({
  code: null,
  identity_type: null,
  identifier: null,
  verified: null,
  status: null,
})

function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach((key) => {
    ruleForm[key] = null
  })
}

const show = (item = {}) => {
  title.value = '编辑账户'
  Object.keys(item).forEach((key) => {
    if (key === 'verified' || key === 'status') {
      ruleForm[key] = item[key] == 1
    } else {
      ruleForm[key] = item[key]
    }
  })

  loadAllIdentityType()
  dialogVisible.value = true
}

const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      accountClient.update(ruleForm.code, {
        identity_type: ruleForm.identity_type,
        identifier: ruleForm.identifier,
        verified: ruleForm.verified ? 1 : 0,
        status: ruleForm.status ? 1 : 0,
      }).then(() => {
        dialogVisible.value = false
        ElMessage({
          message: '更新成功',
          type: 'success',
        })
        //刷新父页面数据
        emits('refresh')
      })
    } else {
      ElMessage({
        message: '校验未通过',
        type: 'error',
      })
    }
  })
}

/**
 * 加载所有账户类型
 */
const loadAllIdentityType = () => {
  staticClient.getAllIdentityType().then((resp) => {
    identityTypeList.value = resp
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  })
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
