<template>
  <el-drawer class="user-detail-drawer" v-model="dialogVisible" @close="handleClose" size="50%">
    <template #header="{ titleId }">
      <span :id="titleId" class="header">{{ title }}</span>
    </template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
      <el-form-item label="业务ID" prop="business_id">
        <el-input v-model="ruleForm.business_id" disabled/>
      </el-form-item>
      <el-form-item label="业务模块" prop="business_module">
        <el-input v-model="ruleForm.business_module" disabled/>
      </el-form-item>
      <el-form-item label="业务事件" prop="business_event">
        <el-input v-model="ruleForm.business_event" disabled/>
      </el-form-item>
      <el-form-item label="推送渠道" prop="channel">
        <el-input v-model="ruleForm.channel" disabled/>
      </el-form-item>
      <el-form-item label="重试次数" prop="retry_times">
        <el-input v-model="ruleForm.retry_times" disabled/>
      </el-form-item>
      <el-form-item label="推送状态" prop="status">
        <el-select
            v-model="ruleForm.status"
            placeholder="请选择"
            style="width: 100%"
        >
          <el-option
              v-for="item in messagePushStatusList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="失败原因" prop="fail_reason">
        <el-input v-model="ruleForm.fail_reason" placeholer="请输入推送原因"/>
      </el-form-item>
      <el-form-item label="业务消息" prop="business_message">
        <el-input v-model="ruleForm.business_message"
                  :rows="8"
                  :autosize="{ minRows: 8, maxRows: 30 }"
                  type="textarea"
                  placeholer="请输入业务消息"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {ElMessage, FormInstance} from "element-plus";
import {messageTemplateClient, staticClient} from "@/api";
import formatJson from "@/utils/codeFormatter";

const emits = defineEmits<{
  (event: 'refresh'): void
}>();
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const title = ref('编辑推送记录')
const loading = ref(true)
const messagePushStatusList = ref([])


const ruleForm = reactive({
  id: null,
  business_id: null,
  business_module: null,
  business_event: null,
  channel: null,
  retry_times: null,
  status: null,
  fail_reason: null,
  business_message: null
})

const rules = reactive({
  status: [
    {required: true, message: '请选择消息发送状态', trigger: 'change'}
  ],
  fail_reason: [
    {required: true, message: '请输入失败原因', trigger: 'blur'},
    {min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur'}
  ],
  business_message: [
    {required: true, message: '请输入模板内容', trigger: 'blur'},
    {min: 1, max: 20000, message: '长度在 1 到 20000 个字符', trigger: 'blur'}
  ]
})

const show = (item = {}) => {
  loading.value = true
  title.value = '编辑推送记录'
  console.log(item)
  Object.keys(item).forEach((key) => {
    if (key === 'business_message') {
      ruleForm[key] = formatJson(item[key])
    } else {
      ruleForm[key] = item[key]
    }
  })

  loadMessagePushStatusList()
  dialogVisible.value = true
}


const handleClose = () => {
  //关闭抽屉
  dialogVisible.value = false
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach((key) => {
    ruleForm[key] = null
  })
}


const handleSubmit = async (done: () => void) => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      //编辑推送记录
      updatePushRecord()
      loading.value = false
    }
  })
}

/**
 * 更新模板
 */
const updatePushRecord = () => {
  messageTemplateClient.update(ruleForm.id, {
    status: ruleForm.status,
    fail_reason: ruleForm.fail_reason,
    msg_content: ruleForm.msg_content
  }).then(() => {
    ElMessage({
      message: '更新成功',
      type: 'success',
    })

    dialogVisible.value = false
    //刷新父页面数据
    emits('refresh')
  }).catch(() => {
    ElMessage({
      message: '更新失败',
      type: 'error',
    })
  })
}

/**
 * 加载消息推送状态枚举
 */
const loadMessagePushStatusList = () => {
  staticClient.getAllMessagePushStatus().then((resp) => {
    messagePushStatusList.value = resp
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


onMounted(() => {
  loading.value = false
})

</script>
<style lang="scss">
@import "../index";
</style>
