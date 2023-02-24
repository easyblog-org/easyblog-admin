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
              :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱号" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入邮箱号"/>
      </el-form-item>
      <el-form-item label="账户密码">
        <el-input
            v-model="ruleForm.password"
            placeholder='请输入账户密码,如果不输入默认 admin123456'
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
import {ElMessageBox, ElMessage, FormInstance, FormRules} from 'element-plus'
import {onMounted, reactive, ref} from 'vue'
import {accountClient, roleClient, userClient} from "@/api";
import {validatorMethod, verifyEmail} from "@/utils/validate";

let roleList = ref([])
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const title = ref('新增用户')

const rules = reactive<FormRules>({
  nick_name: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
  ],
  roles: [{required: true, message: '请选择角色', trigger: 'change'}],
  email: [
    {required: true, validator: validatorMethod(verifyEmail, '请输入正确的邮箱'), trigger: 'blur'}
  ],
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
 * 更新用户和账户信息
 */
const updateUserInfo = () => {
  userClient.update(ruleForm.code, {
    username: ruleForm.nick_name,
    roles: ruleForm.roles,
    email: ruleForm.email,
    password: ruleForm.password,
    active: ruleForm.status ? 1 : 0,
  }).then((resp) => {
    // 更新Account
    if ((ruleForm.email !== undefined && ruleForm.email != null) ||
        ruleForm.password !== undefined && ruleForm.password != null) {
      accountClient.updateByIdentityType(resp.data, 1, ruleForm.email, ruleForm.password).then(() => {
        ElMessage({
          message: '更新成功',
          type: 'success',
        })
      })
    }
  }).catch(() => {
    ElMessage({
      message: '更新失败',
      type: 'error',
    })
  })
}

/**
 * 创建User和账户
 */
const createUserAndAccount = () => {
  userClient.create({
    nick_name: ruleForm.nick_name,
    roles: ruleForm.roles,
    active: ruleForm.status ? 1 : 0,
  }).then((resp) => {
    console.log(ruleForm)
    accountClient.create({
      user_id: resp.id,
      identity_type: 1,   //email 类型
      identifier: ruleForm.email,
      credential: ruleForm.password != null ? ruleForm.password : 'admin123456'
    }).then(() => {
      ElMessage({
        message: '创建成功',
        type: 'success',
      })
    })
  }).catch(() => {
    ElMessage({
      message: '创建失败',
      type: 'error',
    })
  })
}

/**
 * 处理提交事件
 * @param done
 */
const handleSubmit = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (isEdit.value) {
        //编辑用户信息
        updateUserInfo()
      } else {
        //创建新用户
        console.log("Create User.......")
        createUserAndAccount()
      }
      dialogVisible.value = false
    }
  })
}

/**
 * 加载列表数据
 */
const loadRoleList = () => {
  roleClient.listAll(null).then((resp) => {
    const list = resp
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
