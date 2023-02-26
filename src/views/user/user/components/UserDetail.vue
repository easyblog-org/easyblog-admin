<template>
  <el-drawer class="user-detail-drawer" v-model="dialogVisible" size="35%">
    <template #header="{ titleId }">
      <span :id="titleId" class="header">用户详情</span>
    </template>
    <el-row class="user-detail-body">
      <el-row>
        <el-col :span="4">
          <div class="title">Code</div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-html="userDetail.code"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">昵 称</div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-html="userDetail.nick_name"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">角 色</div>
        </el-col>
        <el-col :span="20">
          <div class="content">
            <el-tag v-for="(value,index) in userDetail.roles" :key="value.id" class="mx-1"
                    :class="index!==userDetail.roles-1?'m-tag-gap':''" size="default">
              {{ value.name }}
            </el-tag>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">积 分</div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-html="userDetail.integration"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">等 级</div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-html="userDetail.level"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">访 问 量</div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-html="userDetail.visit"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">状 态</div>
        </el-col>
        <el-col :span="20">
          <div class="content">
            <el-tag v-if="userDetail.active===0" class="mx-1" size="default" type="danger">注销</el-tag>
            <el-tag v-if="userDetail.active===1" class="mx-1" size="default" type="success">正常</el-tag>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">创建时间</div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-html="userDetail.create_time"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">
            更新时间
          </div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-html="userDetail.update_time">
          </div>
        </el-col>
      </el-row>
    </el-row>
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
import {ElMessage, FormInstance} from "element-plus";
import {userClient} from "@/api";

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const title = ref('用户详情')
const userDetail = ref({});
const loading = ref(true)


const show = (user_id: number) => {
  title.value = '用户详情'
  loading.value = true
  loadUserDetail(user_id)
  dialogVisible.value = true
}

const loadUserDetail = (user_id: number) => {
  userClient.details({
    id: user_id,
    sections:'roles'
  }).then((resp) => {
    userDetail.value = resp
    console.log(resp)
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  show,
})


onMounted(() => {
  loading.value = false
})

</script>
<style lang="scss">
@import "../index";
</style>
