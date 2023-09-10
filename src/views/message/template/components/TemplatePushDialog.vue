<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="消息配置" prop="config_rule">
        <el-cascader :options="configRules" v-model="ruleForm.config_rule" clearable style="width: 100%;" :change="onChange" placeholder="请选择消息配置"/>
      </el-form-item>
      <el-form-item label="业务ID" prop="business_id">
        <el-input v-model="ruleForm.business_id" placeholder="请输入业务ID"/>
      </el-form-item>
      <el-form-item label="业务消息" prop="business_message">
        <el-input v-model="ruleForm.business_message" :rows="5" type="textarea" placeholer="请输入业务消息"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit(ruleFormRef)">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {CascaderValue, ElMessage, FormInstance} from 'element-plus'
import {reactive, ref} from 'vue'
import {messagePushRecordClient, messagePushRuleClient, staticClient} from '@/api'
import {ErrorCodeType} from "@/api/ErrorCodeType";

const configRules = ref([])
const messagePushChannelList = ref([])
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('测试消息')


const rules = reactive({
  business_message: [
    {required: true, message: '请输入业务消息', trigger: 'blur'}
  ],
  config_rule: [
    {required: true, message: '请选择消息配置', trigger: 'change'}
  ]
})

const ruleForm = reactive({
  config_rule: null,
  business_message: null,
  business_id: null,
})

function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach((key) => {
    ruleForm[key] = null
  })
}

const show = (item = {}) => {
  title.value = '测试消息'
  Object.keys(item).forEach((key) => {
    ruleForm[key] = item[key]
  })

  queryTemplateByCode(ruleForm.template_code)
  loadAllMsgPushChannel();
  dialogVisible.value = true
}

const submit = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      messagePushRecordClient.create({
        "business_module": ruleForm.business_module,
        "business_event": ruleForm.business_event,
        "template_code": ruleForm.template_code,
        "business_message": ruleForm.business_message,
        "business_id": ruleForm.business_id,
      }).then((resp) => {
        ElMessage({
          message: '更新成功',
          type: 'success',
        })
      }).catch((resp) => {
        let msg = ErrorCodeType(resp.code)
        ElMessage({
          message: msg,
          type: 'error',
        })
      }).finally(() => {
        dialogVisible.value = false
      })
    } else {
      ElMessage({
        message: '校验未通过',
        type: 'error',
      })
    }
  })
}


const queryTemplateByCode = (template_code: string) => {
  messagePushRuleClient.list({
    "template_code": template_code
  }).then((resp) => {
    if (!resp) return
    configRules.value = groupConfigs(resp.data)
    console.log(JSON.stringify(configRules.value))
  })
}


const groupConfigs = (arr: []) => {
  if (!arr) return
  return arr.reduce((acc, cur) => {
    const bizModuelGroup = acc.find((group) => group.value === cur.business_module);
    const channelOption = messagePushChannelList.value.filter(item => item.key === cur.channel)
    console.log(JSON.stringify(channelOption))
    if (bizModuelGroup) {
      const bizEventGroup = bizModuelGroup.children.find(
          (group) => group.value === cur.business_event
      );
      if (bizEventGroup) {
        bizEventGroup.children.push(cur);
      } else {
        bizModuelGroup.children.push({
          label: cur.business_event,
          value: cur.business_event,
          children: [{
            label: channelOption[0].value,
            value: channelOption[0].value
          }],
        });
      }
    } else {
      acc.push({
        label: cur.business_module.toString(),
        value: cur.business_module,
        children: [
          {
            label: cur.business_event,
            value: cur.business_event,
            children: [{
              label: channelOption[0].value,
              value: channelOption[0].value
            }],
          },
        ],
      });
    }
    return acc;
  }, []);
}

const loadAllMsgPushChannel = () => {
  staticClient.getAllMsgPushChannel().then((resp) => {
    messagePushChannelList.value = resp
    console.log(resp);
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  })
}

const onChange = (value: CascaderValue) => {
  console.log(JSON.stringify(value))
}

defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
