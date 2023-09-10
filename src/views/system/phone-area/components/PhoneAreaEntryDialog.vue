<template>
  <el-dialog @close="close" v-model="dialogVisible" :title="title" width="50%" draggable>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
    >
      <el-form-item label="所属大洲" prop="continent_code" :label-width="120">
        <el-cascader
            v-model="ruleForm.continent_code"
            style="width: 100%"
            :options="phoneAreaData"
            :props="cascaderProps" clearable
            :disabled="isEdit"/>
      </el-form-item>
      <el-form-item label="国家/地区冠码" prop="crown_code" :label-width="120">
        <el-input v-model="ruleForm.crown_code" placeholder="请输入国家/地区冠码" :disabled="isEdit"/>
      </el-form-item>
      <el-form-item label="国家/地区码" prop="country_code" :label-width="120">
        <el-input v-model="ruleForm.country_code" placeholder="请输入国家/地区码" :disabled="isEdit"/>
      </el-form-item>
      <el-form-item label="国家/地区名" prop="area_name" :label-width="120">
        <el-input v-model="ruleForm.area_name" placeholder="请输入国家/地区名"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit(ruleFormRef)">确定</el-button>
        </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {ElMessage, FormInstance} from 'element-plus'
import {onBeforeMount, reactive, ref} from "vue";
import {phoneAreaClient, staticClient} from "@/api";
import {ErrorCodeType} from "@/api/ErrorCodeType";

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增国际冠码与国码')
const phoneAreaData = ref()
const isEdit = ref(false)
const emits = defineEmits<{
  (event: 'refresh'): void
}>();
const cascaderProps = {
  value: 'key',
  label: 'value',
  checkStrictly: true,
}

const rules = reactive({
  crown_code: [{required: true, message: '请输入国家/地区冠码', trigger: 'blur',},],
  continent_code: [{required: true, message: '请选择所属大洲', trigger: 'change',},],
  area_name: [{required: true, message: '国家/地区名', trigger: 'blur',},],
  country_code: [{required: true, message: '国家/地区码', trigger: 'blur',},],
})


const ruleForm = reactive({
  id: null,
  continent_code: null,
  crown_code: null,
  country_code: null,
  area_name: null,
})

function close() {
  ruleFormRef.value.resetFields()
  isEdit.value = false
  Object.keys(ruleForm).forEach(key => {
    ruleForm[key] = null
  })
}

const show = (item = {}) => {
  title.value = '新增国际冠码与国码'
  console.log(JSON.stringify(item))
  if (item['code']) {
    isEdit.value = true
    title.value = '编辑国际冠码与国码'
    Object.keys(item).forEach(key => {
      ruleForm[key] = item[key]
    })
  }
  dialogVisible.value = true
}

/**
 * 提交表单
 * @param done
 */
const handleSubmit = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (isEdit.value) {
        // 编辑
        updatePhoneAreaCode()
      } else {
        // 增加
        createPhoneAreaCode()
      }
    }
  })
}

const createPhoneAreaCode = () => {
  phoneAreaClient.create({
    continent_code: ruleForm.continent_code[0],
    crown_code: ruleForm.crown_code,
    country_code: ruleForm.country_code,
    area_name: ruleForm.area_name,
  }).then((resp) => {
    console.log(resp)
    if (!resp) return

    if (resp.success) {
      ElMessage({
        message: '创建成功',
        type: 'success',
      })

      dialogVisible.value = false
      //刷新父页面数据
      emits('refresh')
    } else {
      const errorMsg = ErrorCodeType(resp.code);
      ElMessage({
        message: errorMsg,
        type: 'warning',
      })
    }
  }).catch((err) => {
    ElMessage({
      message: '创建失败',
      type: 'error',
    })
  })
}

const updatePhoneAreaCode = () => {
  phoneAreaClient.update(ruleForm.id, {
    continent_code: ruleForm.continent_code,
    crown_code: ruleForm.crown_code,
    country_code: ruleForm.country_code,
    area_name: ruleForm.area_name,
  }).then((resp) => {
    console.log(resp)
    if (!resp) return

    if (resp.success) {
      ElMessage({
        message: '更新成功',
        type: 'success',
      })

      dialogVisible.value = false
      //刷新父页面数据
      emits('refresh')
    } else {
      const errorMsg = ErrorCodeType(resp.code);
      ElMessage({
        message: errorMsg,
        type: 'error',
      })
    }

  }).catch((err) => {
    ElMessage({
      message: '更新失败',
      type: 'error',
    })
  })
}

const loadPhoneAreaCodeList = () => {
  staticClient.getAllContinent().then((resp) => {
    if (!resp) return
    phoneAreaData.value = resp
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  })
}

onBeforeMount(() => {
  loadPhoneAreaCodeList()
})

defineExpose({
  show,
})

</script>
<style lang="scss" scoped>

</style>

