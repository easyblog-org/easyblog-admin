<template>
  <el-drawer class="user-detail-drawer" v-model="dialogVisible" @close="handleClose" size="60%">
    <template #header="{ titleId }">
      <span :id="titleId" class="header">{{ title }}</span>
    </template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
      <el-form-item label="所属模块" prop="business_module">
        <el-input v-model="ruleForm.business_module" placeholder="请输入模块名称" :disabled="isEdit"/>
      </el-form-item>
      <el-form-item label="事件/消息" prop="business_event">
        <el-input v-model="ruleForm.business_event" placeholder="请输入事件/消息名称" :disabled="isEdit"/>
      </el-form-item>
      <el-form-item label="分组" prop="group">
        <el-input v-model="ruleForm.group" placeholder="请输入分组名称"/>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input v-model="ruleForm.priority" placeholder="请输入优先级"/>
      </el-form-item>
      <el-form-item label="发送渠道" prop="channel">
        <el-select
            v-model="ruleForm.channel"
            placeholder="请选择"
            style="width: 100%"
        >
          <el-option
              v-for="item in messagePushChannelList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模版" prop="template_code">
        <el-select
            v-model="ruleForm.template_code"
            placeholder="请选择"
            style="width: 100%"
        >
          <el-option
              v-for="item in messageTemplateList"
              :key="item.template_code"
              :label="item.name"
              :value="item.template_code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数取值方式" prop="template_value_type">
        <el-select
            v-model="ruleForm.template_value_type"
            @change="changeTemplateValueUrlInputStatus"
            placeholder="请选择"
            style="width: 100%"
        >
          <el-option
              v-for="item in messageTemplateValueTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="showTemplateValueUrlInput" label="参数取值URL" prop="template_value_url">
        <el-input v-model="ruleForm.template_value_url" placeholder="请输入参数取值URL"/>
      </el-form-item>
      <el-form-item label="参数配置" prop="configs">
        <el-form
            ref="configsFormRef"
            :model="dynamicConfigsForm"
        >
          <el-row v-for="(domain, index) in dynamicConfigsForm.domains" :gutter="10" :key="domain.key"
                  style="margin-bottom: 15px">
            <el-col :span="7">
              <el-form-item
                  label="参数类型"
                  :prop="'domains.' + index + '.name'"
                  :rules="{
                    required: true,
                    message: 'domain can not be null',
                    trigger: 'blur',
              }"
              >
                <el-select
                    v-model="domain.type"
                    placeholder="请选择"
                    style="width: 100%"
                >
                  <el-option
                      v-for="item in messageConfigList"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                  :label="'参数' + (index+1)"
                  :prop="'domains.' + index + '.name'"
                  :rules="{
                    required: true,
                    message: 'config name can not be null',
                    trigger: 'blur',
              }"
              >
                <el-input v-model="domain.name" placeholder="email"/>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                  :label="'取值表达式' + (index+1)"
                  :prop="'domains.' + index + '.value'"
                  :rules="{
                    required: true,
                    message: 'config value can not be null',
                    trigger: 'blur',
              }"
              >
                <el-input v-model="domain.value" placeholder="$.email"/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button @click.prevent="addDomain()" v-if="index===0">
                <el-icon>
                  <Plus/>
                </el-icon>
              </el-button>
              <el-button @click.prevent="removeDomain(domain)" v-else>
                <el-icon>
                  <Minus/>
                </el-icon>
              </el-button>
            </el-col>
          </el-row>
        </el-form>
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
import {ElInput, ElMessage, FormInstance} from "element-plus";
import {messagePushRuleClient, messageTemplateClient, staticClient} from "@/api";
import {ErrorCodeType} from "@/api/ErrorCodeType";


const emits = defineEmits<{
  (event: 'refresh'): void
}>();
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const showTemplateValueUrlInput = ref(false)
const title = ref('添加消息规则')
const isEdit = ref<boolean>(false)
const loading = ref(true)
const messageTemplateList = ref([])
const messagePushChannelList = ref([])
const messageConfigList = ref([])
const messageTemplateValueTypeList = ref([])
const ruleConfigDynamicTags = ref([])
const configsFormRef = ref<FormInstance>()
const dynamicConfigsForm = reactive<{
  domains: ConfigDomainItem[]
}>({
  domains: [
    {
      type: 'receiver',
      key: 1,
      value: '',
      name: ''
    },
  ],
})

interface ConfigDomainItem {
  type: string,
  key: number
  value: string,
  name: string
}

const ruleForm = reactive({
  id:null,
  business_module: null,
  business_event: null,
  group: null,
  priority: null,
  template_code: null,
  channel: null,
  configs: null,
  template_value_type: null,
  template_value_url: null
})

const rules = reactive({
  business_module: [
    {required: true, message: '请输入所属模块名称', trigger: 'blur'},
    {min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur'}
  ],
  business_event: [
    {required: true, message: '请输入事件/消息名称', trigger: 'blur'},
    {min: 1, max: 36, message: '长度在 1 到 36 个字符', trigger: 'blur'}
  ],
  template_code: [
    {required: true, message: '请选择消息模板类型', trigger: 'change'}],
  channel: [
    {required: true, message: '请选择消息发送渠道', trigger: 'change'}],
  template_value_type: [
    {required: true, message: '请选择参数取值方式', trigger: 'change'}],
  // template_value_url: [
  //   {required: true, message: '请输入参数取值URL', trigger: 'blur', when: () => showTemplateValueUrlInput.value},
  //   {min: 1, max: 256, message: '长度在 1 到 20 个字符', trigger: 'blur'}]
})

const show = (item = {}) => {
  title.value = '添加消息规则'
  loading.value = true
  isEdit.value = false
  console.log(JSON.stringify(item))
  if (item['template_code']) {
    title.value = '编辑消息规则'
    isEdit.value = true
    Object.keys(item).forEach((key) => {
      ruleForm[key] = item[key]
    })

    let configs = ruleForm.configs;
    if (configs !== undefined && configs !== null) {
      let config = configs[0]
      if (config !== undefined && config !== null) {
        ruleForm.template_value_type = config.template_value_config.type
        ruleForm.template_value_url = config.template_value_config.url
      }

      dynamicConfigsForm.domains = configs.map(cfg => {
        return {
          "type": cfg.type,
          "name": cfg.name,
          "value": cfg.template_value_config.expression
        }
      });
    }
  }

  loadAllMessageTemplateList()
  loadAllMsgConfigType()
  loadAllMsgPushChannel()
  loadAllMsgTemplateValueType()
  dialogVisible.value = true
}

const changeTemplateValueUrlInputStatus = () => {
  if (!ruleForm.template_value_type) return
  showTemplateValueUrlInput.value = ruleForm.template_value_type === 3 || ruleForm.template_value_type === 4
}

const handleRuleConfigClose = (tag: string) => {
  ruleConfigDynamicTags.value.splice(ruleConfigDynamicTags.value.indexOf(tag), 1)
}

const removeDomain = (item: ConfigDomainItem) => {
  const index = dynamicConfigsForm.domains.indexOf(item)
  if (index !== -1) {
    dynamicConfigsForm.domains.splice(index, 1)
  }
}

const addDomain = () => {
  dynamicConfigsForm.domains.push({
    type: 'receiver',
    key: Date.now(),
    value: '',
    name: ''
  })
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
      //[{"type":"receiver","key":1,"value":"$.email","name":"email"}]
      console.log(JSON.stringify(dynamicConfigsForm.domains))
      if (isEdit.value) {
        //编辑消息规则
        updateMessageRuleConfig()
      } else {
        //创建消息规则
        createMessageRuleConfig()
      }
      loading.value = false
    }else{
      console.log("校验失败")
    }
  })
}

/**
 * 更新模板
 */
const updateMessageRuleConfig = () => {

  const messageParamConfigs = dynamicConfigsForm.domains.map(config => {
    return {
      "type": config.type,
      "name": config.name,
      "template_value_config": {
        "type": ruleForm.template_value_type,
        "expression": config.value,
        "url": ruleForm.template_value_url,
      }
    }
  });

  messagePushRuleClient.update(ruleForm.id, {
    "business_module": ruleForm.business_module,
    "business_event": ruleForm.business_event,
    "template_code": ruleForm.template_code,
    "priority": ruleForm.priority,
    "channel": ruleForm.channel,
    "msg_group": ruleForm.group,
    configs: messageParamConfigs
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
 * 创建模板
 */
const createMessageRuleConfig = () => {
  //dynamicConfigsForm.domains: [{"type":"receiver","key":1,"value":"$.email","name":"email"}]
  const messageParamConfigs = dynamicConfigsForm.domains.map(config => {
    return {
      "type": config.type,
      "name": config.name,
      "template_value_config": {
        "type": ruleForm.template_value_type,
        "expression": config.value,
        "url": ruleForm.template_value_url,
      }
    }
  });
  messagePushRuleClient.create({
    "message_rule_config": {
      "business_module": ruleForm.business_module,
      "business_event": ruleForm.business_event,
      "template_code": ruleForm.template_code,
      "priority": ruleForm.priority,
      "channel": ruleForm.channel,
      "msg_group": ruleForm.group,
    },
    "message_parameter_configs": messageParamConfigs
  }).then((resp) => {

    console.log("resp" + JSON.stringify(resp))

    ElMessage({
      message: '添加成功',
      type: 'success',
    })

    dialogVisible.value = false
    //刷新父页面数据
    emits('refresh')
  }).catch((err) => {
    ElMessage({
      message: ErrorCodeType(err.code),
      type: 'error',
    })
  })
}

const loadAllMessageTemplateList = () => {
  // 查询已发布 & 未删除 的模板
  messageTemplateClient.list({
    status: 2,
    deleted: false
  }).then((resp) => {
    messageTemplateList.value = resp.data
    console.log(resp.data);
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  })
}

const loadAllMsgConfigType = () => {
  staticClient.getAllMsgConfigType().then((resp) => {
    messageConfigList.value = resp
    console.log(resp);
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  })
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

const loadAllMsgTemplateValueType = () => {
  staticClient.getAllMsgTemplateConfigValueType().then((resp) => {
    messageTemplateValueTypeList.value = resp
    console.log(resp);
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
