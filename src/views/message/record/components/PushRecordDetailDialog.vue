<template>
  <el-dialog @close="close" v-model="dialogVisible" width="50%" draggable>
    <el-descriptions :title="title" :span="1">
      <el-descriptions-item label="业务ID">{{ ruleForm.business_id }}</el-descriptions-item>
      <el-descriptions-item label="业务模块">{{ ruleForm.business_module }}</el-descriptions-item>
      <el-descriptions-item label="业务事件">{{ ruleForm.business_event }}</el-descriptions-item>
      <el-descriptions-item label="推送渠道">
        <el-tag size="large" v-if="ruleForm.channel===10">普通邮件</el-tag>
        <el-tag size="large" v-if="ruleForm.channel===11">HTML邮件</el-tag>
        <el-tag size="large" v-if="ruleForm.channel===20">短信</el-tag>
        <el-tag size="large" v-if="ruleForm.channel===30">微信通知</el-tag>
        <el-tag size="large" v-if="!ruleForm.channel">-</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="重试次数">{{ ruleForm.retry_times }}</el-descriptions-item>
      <el-descriptions-item label="推送状态">
        <el-tag size="large" v-if="ruleForm.status===1">未发送</el-tag>
        <el-tag size="large" v-if="ruleForm.status===2">发送成功</el-tag>
        <el-tag size="large" v-if="ruleForm.status===3">发送失败</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="失败原因">
        <el-tooltip
            class="tooltip-item"
            effect="dark"
            :content="ruleForm.fail_reason"
            placement="top-start"
        >
          <span class="tooltip-item">{{ ruleForm.fail_reason }}</span>
        </el-tooltip>
      </el-descriptions-item>
    </el-descriptions>
    <div class="code-container">
      <el-row>
        <span class="el-descriptions__label">业务消息</span>
      </el-row>
      <el-scrollbar wrap-class="code-wrap" view-class="code-view">
        <pre class="language-javascript"><code>{{ ruleForm.business_message }}</code></pre>
      </el-scrollbar>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="close">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {FormInstance} from 'element-plus'
import {reactive, ref} from 'vue'
import formatJson from "@/utils/codeFormatter";


const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('消息推送详情')

const ruleForm = reactive({
  business_id: null,
  business_message: null,
  business_message_short: null,
  business_modules: null,
  business_events: null,
  channel: null,
  retry_times: null,
  status: null,
  fail_reason: null
})

function close() {
  dialogVisible.value = false
}

const show = (item = {}) => {
  title.value = '消息推送详情'
  Object.keys(item).forEach((key) => {
    if (key === 'business_message') {
      ruleForm[key] = formatJson(item[key])
    } else {
      ruleForm[key] = item[key]
    }
  })

  dialogVisible.value = true
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
