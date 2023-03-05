<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="40%">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize">
      <el-form-item label="账号">
        <el-input v-model="ruleForm.account" disabled></el-input>
      </el-form-item>
      <el-form-item label="旧的密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新的密码" prop="configPassword">
        <el-input v-model="ruleForm.configPassword" type="password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, defineExpose, reactive} from 'vue'
import type {ElForm} from 'element-plus'
import {useUserStore} from "@/store/modules/user"
import {decrypt, encrypt} from "@/utils/crypto";
import {loginClient} from "@/api";
import {ErrorCodeType} from "@/api/ErrorCodeType";
import {ElMessage} from "element-plus";
import router from "@/routers";

const dialogVisible = ref(false)
const UserStore = useUserStore()
type FormInstance = InstanceType<typeof ElForm>
const formSize = ref('')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  account: '',
  password: '',
  configPassword: '',
})

const rules = reactive({
  configPassword: [
    {
      required: true,
      message: '请输入新的密码',
      trigger: 'blur',
    },
  ],
})

/**
 * 展示密码修改框
 */
const show = () => {
  if (undefined === UserStore.userInfo || null === UserStore.userInfo) return
  const userAccount = UserStore.userInfo.curr_account
  if (undefined === userAccount || null === userAccount) {
    console.log("Account not found from UserStore.userInfo")
    return
  }
  ruleForm.account = userAccount.identifier
  ruleForm.password = decrypt(userAccount.credential)
  dialogVisible.value = true
}

/**
 * 提交修改
 * @param formEl
 */
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const oldPassword = encrypt(ruleForm.password);
      const newPassword = encrypt(ruleForm.configPassword)
      loginClient.modifyPassword({
        'identify': ruleForm.account,
        'password': oldPassword,
        'config_password': newPassword
      }).then((resp) => {
        // @ts-ignore
        if (resp.success) {
          UserStore.logout().then(() => {
            router.replace({
              path: '/login'
            })
          })
          dialogVisible.value = false
          ElMessage({
            message: '修改成功，请重新登录',
            type: 'success',
          })
        } else {
          // @ts-ignore
          const errorMsg = ErrorCodeType(resp.code);
          ElMessage({
            message: errorMsg,
            type: 'warning',
          })
        }
      })
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
}

defineExpose({
  show,
})
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
