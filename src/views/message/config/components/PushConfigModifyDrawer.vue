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
        <el-input v-model="ruleForm.group" placeholder="请输入分组名称" :disabled="isEdit"/>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input v-model="ruleForm.priority" placeholder="请输入优先级" :disabled="isEdit"/>
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
      <el-form-item label="参数配置" prop="configs">
        <el-tag
            v-for="tag in ruleConfigDynamicTags"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleRuleConfigClose(tag)"
            v-if="isEdit"
        >
          {{ tag }}
        </el-tag>
        <el-form
            ref="configsFormRef"
            :model="dynamicConfigsForm"
            v-if="!isEdit"
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
import {messageTemplateClient, staticClient} from "@/api";


const emits = defineEmits<{
  (event: 'refresh'): void
}>();
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const title = ref('添加消息规则')
const isEdit = ref<boolean>(false)
const loading = ref(true)
const messageTemplateList = ref([])
const messageConfigList = ref([])
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
  business_module: null,
  business_event: null,
  group: null,
  priority: null,
  template_code: null,
  configs: null
})

const rules = reactive({
  business_module: [
    {required: true, message: '请输入所属模块名称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
  ],
  business_event: [
    {required: true, message: '请输入事件/消息名称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur'}
  ],
  template_code: [
    {required: true, message: '请选择消息模板类型', trigger: 'change'}]
})

const show = (item = {}) => {
  title.value = '添加消息规则'
  loading.value = true
  isEdit.value = false
  if (item['template_code']) {
    title.value = '编辑消息规则'
    isEdit.value = true
    Object.keys(item).forEach((key) => {
      ruleForm[key] = item[key]
    })
  }

  loadAllMessageTemplateList()
  loadAllMsgConfigType()
  dialogVisible.value = true
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
    }
  })
}

/**
 * 更新模板
 */
const updateMessageRuleConfig = () => {
 /* messageTemplateClient.update(ruleForm.template_code, {}).then(() => {
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
  })*/
}


/**
 * 创建模板
 */
const createMessageRuleConfig = () => {
  /*messageTemplateClient.create({}).then(() => {
    ElMessage({
      message: '添加成功',
      type: 'success',
    })

    dialogVisible.value = false
    //刷新父页面数据
    emits('refresh')
  }).catch(() => {
    ElMessage({
      message: '添加失败',
      type: 'error',
    })
  })*/
}

const loadAllMessageTemplateList = () => {
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
