<template>
  <el-drawer class="user-detail-drawer" v-model="dialogVisible" @close="handleClose" size="50%">
    <template #header="{ titleId }">
      <span :id="titleId" class="header">{{ title }}</span>
    </template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入模板名称" :disabled="isEdit"/>
      </el-form-item>
      <el-form-item label="通知消息类型" prop="msg_type">
        <el-select
            v-model="ruleForm.msg_type"
            placeholder="请选择"
            style="width: 100%"
            :disabled="isEdit"
        >
          <el-option
              v-for="item in msgTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="夜间屏蔽类型" prop="shield_type">
        <el-select
            v-model="ruleForm.shield_type"
            placeholder="请选择"
            style="width: 100%"
            :disabled="isEdit"
        >
          <el-option
              v-for="item in shieldTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="期望推送时间" prop="expect_push_time">
        <el-date-picker
            v-model="ruleForm.expect_push_time"
            type="datetime"
            placeholder="请输入期望推送时间，默认立即推送"
            :shortcuts="dataQuickPicker"
            size="large"
            :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="模板内容" prop="msg_content">
        <el-input
            v-model="ruleForm.msg_content"
            :rows="8"
            :autosize="{ minRows: 8, maxRows: 30 }"
            type="textarea"
            placeholder="请输入模板内容, 参数使用 ${name} 占位 "
        />
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
import {messageTemplateClient} from "@/api";

const emits = defineEmits<{
  (event: 'refresh'): void
}>();
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const title = ref('添加模板')
const isEdit = ref<boolean>(false)
const loading = ref(true)
const msgTypeList = ref([
  {
    key: "1",
    value: "通知类型消息"
  },
  {
    key: "2",
    value: "营销类消息"
  },
  {
    key: "3",
    value: "验证码类消息"
  }
])

const shieldTypeList = ref([
  {
    key: "1",
    value: "夜间不屏蔽"
  },
  {
    key: "2",
    value: "夜间屏蔽"
  }
])


const ruleForm = reactive({
  name: null,
  template_code: null,
  status: null,
  deleted: null,
  msg_type: null,
  shield_type: null,
  expect_push_time: null,
  msg_content: null,
})

const rules = reactive({
  name: [
    {required: true, message: '请输入模板名称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
  ],
  msg_type: [
    {required: true, message: '请选择消息类型', trigger: 'change'},
  ],
  shield_type: [
    {required: true, message: '请选择夜间屏蔽类型', trigger: 'change'}],
  msg_content: [
    {required: true, message: '请输入模板内容', trigger: 'blur'},
    {min: 1, max: 5000, message: '长度在 1 到 20 个字符', trigger: 'blur'}
  ]
})

const show = (item = {}) => {
  title.value = '添加模板'
  loading.value = true
  isEdit.value = false
  if (item['code']) {
    title.value = '编辑模板'
    isEdit.value = true
  }
  dialogVisible.value = true
}

/**
 * 日期快速选择
 */
const dataQuickPicker = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]


const handleClose = () => {
  //关闭抽屉
  dialogVisible.value = false
  ruleFormRef.value.resetFields()

}


const handleSubmit = async (done: () => void) => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (isEdit.value) {
        //编辑模板
        updateTemplate()
      } else {
        //创建模板
        createTemplate()
      }
      dialogVisible.value = false
    }
  })
}

/**
 * 更新模板
 */
const updateTemplate = () => {
  messageTemplateClient.update(ruleForm.template_code, {
    status: ruleForm.status,
    deleted: ruleForm.deleted,
    msg_content: ruleForm.msg_content
  }).then(() => {
    ElMessage({
      message: '更新成功',
      type: 'success',
    })

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
 * 创建模板
 */
const createTemplate = () => {
  messageTemplateClient.create({
    name: ruleForm.name,
    expect_push_time: ruleForm.expect_push_time,
    msg_type: ruleForm.msg_type,
    shield_type: ruleForm.shield_type,
    msg_content: ruleForm.msg_content
  }).then(() => {
    ElMessage({
      message: '添加成功',
      type: 'success',
    })

    //刷新父页面数据
    emits('refresh')
  }).catch(() => {
    ElMessage({
      message: '添加失败',
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
