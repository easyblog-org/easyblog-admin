<template>
  <el-dialog @close="close" v-model="dialogVisible" width="50%" draggable>
    <el-descriptions :title="title">
      <el-descriptions-item label="所属模块">{{ ruleForm.business_module }}</el-descriptions-item>
      <el-descriptions-item label="事件/消息">{{ ruleForm.business_event }}</el-descriptions-item>
      <el-descriptions-item label="模板编号">{{ ruleForm.template_code }}</el-descriptions-item>
      <el-descriptions-item label="分组">{{ ruleForm.msg_group }}</el-descriptions-item>
      <el-descriptions-item label="优先级">{{ ruleForm.priority }}</el-descriptions-item>
      <el-descriptions-item label="推送渠道">
        <el-tag size="large" v-if="ruleForm.channel===10">普通邮件</el-tag>
        <el-tag size="large" v-if="ruleForm.channel===11">HTML邮件</el-tag>
        <el-tag size="large" v-if="ruleForm.channel===20">短信</el-tag>
        <el-tag size="large" v-if="ruleForm.channel===30">微信通知</el-tag>
        <el-tag size="large" v-if="!ruleForm.channel">-</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="删除状态">
        <el-tag size="large" v-if="ruleForm.deleted===true">已删除</el-tag>
        <el-tag size="large" v-else>未删除</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="消息参数配置">
        <el-tag style="margin-right: 8px;cursor: pointer" size="large" v-if="ruleForm.config_ids!==undefined && ruleForm.config_ids!==null"
                v-for="(config) in ruleForm.config_ids.split(',')" :key="config"
                @click="showConfigParamsDetails(config)"
                >
          {{ config }}
        </el-tag>
        <el-tag size="large" v-if="!ruleForm.channel">-</el-tag>
      </el-descriptions-item>
    </el-descriptions>
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

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('消息规则详情')

const ruleForm = reactive({
  template_code: null,
  business_modules: null,
  business_events: null,
  msg_group: null,
  priority: null,
  channel: null,
  config_ids: null,
  deleted: null
})

function close() {
  dialogVisible.value = false
}

const show = (item = {}) => {
  title.value = '消息规则详情'
  Object.keys(item).forEach((key) => {
    ruleForm[key] = item[key]
  })

  dialogVisible.value = true
}


const showConfigParamsDetails = (code:string) => {

}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
