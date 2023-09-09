<template>
  <PageWrapLayout class="mark-down">
    <el-row>
      <el-col :span="18">
        <el-input
            v-model="text"
            maxlength="10"
            placeholder="Please input"
            show-word-limit
            type="text"
        />
      </el-col>
      <el-col>
        <el-button type="primary" @click="submit">保存草稿</el-button>
        <el-button type="primary" @click="submit">发布文章</el-button>
      </el-col>
    </el-row>
    <div class="" style="flex: 1">
      <md-editor v-model="text" />
    </div>
    <div style="margin-top: 20px; flex-shrink: 0">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </PageWrapLayout>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const text = ref( '## 你好呀,欢迎！' )

const submit = ()=> {
  console.log('this.text', text.value)
  ElMessage.success(`提交数据:${text.value}`)
}
</script>

<style lang="scss">
.mark-down {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .md {
    height:100%;
  }
}
</style>
