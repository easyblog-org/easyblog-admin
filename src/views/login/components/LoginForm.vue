<template>
  <div class="login-title">
    <img class="icon" src="@/assets/image/login/logo-color.png" alt="logo"/>
    <h2 class="title">EasyBlog Admin</h2>
  </div>
  <el-form
      ref="ruleFormRef"
      :model="loginForm"
      :rules="rules"
  >
    <el-form-item label="" prop="username">
      <el-input
          placeholder="请输入用户名"
          autoComplete="on"
          style="position: relative"
          v-model="loginForm.username"
          @keyup.enter.native="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <UserFilled/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="password">
      <el-input
          placeholder="请输入密码"
          autoComplete="on"
          @keyup.enter.native="submitForm(ruleFormRef)"
          v-model="loginForm.password"
          :type="passwordType"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <GoodsFilled/>
          </el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </div>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button
          :loading="loading"
          class="login-btn"
          type="primary"
          @click="submitForm(ruleFormRef)"
      >登录
      </el-button
      >
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import {ref, reactive} from 'vue'
import type {FormInstance} from 'element-plus'
import {ElNotification} from "element-plus";
import {useRouter} from 'vue-router'
import {useUserStore} from "@/store/modules/user"
import {getTimeStateStr} from '@/utils/index'

const router = useRouter()
const UserStore = useUserStore()
const ruleFormRef = ref<FormInstance>()
const passwordType = ref('password')
const loading = ref(false)

const rules = reactive({
  password: [{required: true, message: "请输入用户名", trigger: "blur"}],
  username: [{required: true, message: "请输入密码", trigger: "blur"}],
})

// 表单数据
const loginForm = reactive({
  username: null,
  password: null,
})

// 显示密码图标
const showPwd = () => {
  passwordType.value = passwordType.value === 'password' ? '' : 'password'
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (!valid) return
    loading.value = true
    UserStore.login(loginForm).then((resp) => {
      router.replace({
        path: '/',
      })
      ElNotification({
        title: getTimeStateStr(),
        message: "欢迎登录 EasyBlog Admin",
        type: "success",
        duration: 3000
      });
    }).finally(() => {
      loading.value = false
    })
  })
}
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>
