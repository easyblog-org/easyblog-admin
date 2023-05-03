<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%" draggable>
    <div v-html="highlightText(ruleForm.msg_content)"></div>
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
const title = ref('模板预览')

const ruleForm = reactive({
  template_code: null,
})

function close() {
  ruleForm.template_code = null
  dialogVisible.value = false
}

const show = (item = {}) => {
  title.value = '模板预览'
  Object.keys(item).forEach((key) => {
    ruleForm[key] = item[key]
  })

  dialogVisible.value = true
}

function highlightText(text: string): string {
  const regex = /\${([^}]*)}/g;
  return text.replace(regex, '<span style="background-color: yellow; border:solid 1px yellow">$&</span>');
}


defineExpose({
  show,
})
</script>
<style lang="scss" scoped></style>
