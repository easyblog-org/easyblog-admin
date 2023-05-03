<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item class="search-bar">
          <el-input v-model="formInline.query_value" placeholder="请输入" class="input-with-select"
                    @keydown.enter="onSearch">
            <template #prepend>
              <el-select v-model="formInline.query_key" placeholder="模板名" style="width: 120px"
                         @change="handleQueryKeyChange">
                <el-option label="模板名" value="name"/>
                <el-option label="模板Code" value="template_code"/>
                <el-option label="通知类型" value="msg_type"/>
                <el-option label="夜间屏蔽" value="shield_type"/>
                <el-option label="状态" value="status"/>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" :icon="Search">查询</el-button>
          <el-button @click="reset(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="util">
        <el-button type="primary" @click="addHandler">
          <el-icon>
            <Plus/>
          </el-icon>
          新增模板
        </el-button>
      </div>
      <div class="table-inner">
        <el-table v-loading="loading" :data="templateList" style="width: 100%; height: 100%" border>
          <el-table-column prop="template_code" label="模板编号" align="center" width="100"/>
          <el-table-column prop="name" label="标题" align="center" width="120"/>
          <el-table-column prop="expect_push_time" label="预期推送时间" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.expect_push_time===undefined || scope.row.expect_push_time===undefined "
                      class="mx-1" size="default">立即推送
              </el-tag>
              <el-tag v-else class="mx-1" size="default">{{ scope.row.expect_push_time }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="msg_type" label="通知消息类型" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.msg_type===1" class="mx-1" size="default">通知消息</el-tag>
              <el-tag v-else-if="scope.row.msg_type===2" class="mx-1" size="default">营销消息</el-tag>
              <el-tag v-else-if="scope.row.msg_type===3" class="mx-1" size="default">验证码消息</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="shield_type" label="夜间屏蔽类型" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.shield_type===1" class="mx-1" size="default" type="success">夜间不屏蔽</el-tag>
              <el-tag v-if="scope.row.shield_type===2" class="mx-1" size="default">夜间不屏蔽</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="发布状态" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.status===1" class="mx-1" size="default" type="danger">未发布</el-tag>
              <el-tag v-if="scope.row.status===2" class="mx-1" size="default">已发布</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center" width="180"/>
          <el-table-column prop="update_time" label="更新时间" align="center" width="180"/>
          <el-table-column prop="operator" label="操作" width="350px" align="center" fixed="right">
            <template #default="scope">
              <el-button type="success" size="small" icon="Open" @click="release(scope.row)"
                         :disabled="scope.row.status===2">
                发布模板
              </el-button>
              <el-button color="#626aef" size="small" icon="View" @click="showTemplateDetails(scope.row)">
                预览
              </el-button>
              <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)">
                编辑
              </el-button>
              <el-button @click="del(scope.row)" type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
            :currentPage="currentPage"
            :page-size="templateListRequestParam.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

  <TemplateModifyDrawer @refresh="loadTemplateList" ref="templateDrawer"/>
  <TemplateDetailDialog ref="templateDialog"/>
</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import {messageTemplateClient} from '@/api'
import TemplateModifyDrawer from "@/views/message/template/components/TemplateModifyDrawer.vue";
import TemplateDetailDialog from "@/views/message/template/components/TemplateDetailDialog.vue";

const templateDrawer = ref()
const templateDialog = ref()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({
  query_key: 'name',
  query_value: null
})
const loading = ref(true)
const templateList = ref([])
const currentPage = ref(1)
const total = ref(0)
const templateListRequestParam = {
  status: null,
  template_codes: null,
  name: null,
  msg_type: null,
  shield_type: null,
  limit: 10,
  offset: 0,
}

const onSearch = () => {
  if (formInline.query_key === 'status') {
    templateListRequestParam.status = formInline.query_value ? 1 : 0
  } else if (formInline.query_key === 'name') {
    templateListRequestParam.name = formInline.query_value
  } else if (formInline.query_key === 'template_code') {
    templateListRequestParam.template_codes = formInline.query_value
  } else if (formInline.query_key === 'msg_type') {
    templateListRequestParam.msg_type = formInline.query_value
  } else if (formInline.query_key === 'shield_type') {
    templateListRequestParam.shield_type = formInline.query_value
  }
  loadTemplateList()
}

/**
 * 处理查询主键变更事件
 */
const handleQueryKeyChange = (val: string) => {
  if (formInline.query_key === 'status') {
    templateListRequestParam.name = null
    templateListRequestParam.template_codes = null
    templateListRequestParam.msg_type = null
    templateListRequestParam.shield_type = null
  } else if (formInline.query_key === 'name') {
    templateListRequestParam.status = null
    templateListRequestParam.template_codes = null
    templateListRequestParam.msg_type = null
    templateListRequestParam.shield_type = null
  } else if (formInline.query_key === 'template_code') {
    templateListRequestParam.name = null
    templateListRequestParam.status = null
    templateListRequestParam.msg_type = null
    templateListRequestParam.shield_type = null
  } else if (formInline.query_key === 'msg_type') {
    templateListRequestParam.name = null
    templateListRequestParam.status = null
    templateListRequestParam.shield_type = null
    templateListRequestParam.template_codes = null
  } else if (formInline.query_key === 'shield_type') {
    templateListRequestParam.name = null
    templateListRequestParam.status = null
    templateListRequestParam.msg_type = null
    templateListRequestParam.template_codes = null
  }
}

const reset = (formEl: FormInstance | undefined) => {
  templateListRequestParam.name = null
  templateListRequestParam.status = null
  templateListRequestParam.template_codes = null
  templateListRequestParam.msg_type = null
  templateListRequestParam.shield_type = null
  loadTemplateList()
}

const addHandler = () => {
  templateDrawer.value.show()
}

const editHandler = (row) => {
  templateDrawer.value.show(row)
}

/**
 * 展示模板细节
 * @param row
 */
const showTemplateDetails = (row) => {
  templateDialog.value.show(row)
}

/**
 * 发布模板
 * @param row
 */
const release = (row) => {
  ElMessageBox.confirm('你确定要发布当前模板吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }).then(() => {
    switchTemplateStatus(row.template_code, 2)
  })
}


/**
 * 更新模板状态
 */
const switchTemplateStatus = (code: string, status: number, deleted?: boolean) => {
  //编辑用户信息
  messageTemplateClient.update(code, {
    status: status,
    deleted: deleted
  }).then(() => {
    ElMessage({
      message: '更新成功',
      type: 'success',
    })
  }).catch(() => {
    ElMessage({
      message: '更新失败',
      type: 'error',
    })
  }).finally(() => {
    loadTemplateList()
  })
}

/**
 * 删除用户
 * @param row
 */
const del = (row) => {
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }).then(() => {
    switchTemplateStatus(row.template_code, null, true)
  }).finally(() => {
    loadTemplateList()
  })
}


/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  templateListRequestParam.limit = pageSize;
  templateListRequestParam.offset = 0
  currentPage.value = 1
  loadTemplateList()
}

/**
 * 翻页
 * @param pageNo
 */
const handleCurrentChange = (pageNo: number) => {
  templateListRequestParam.offset = (pageNo - 1) * templateListRequestParam.limit
  loadTemplateList()
  currentPage.value = pageNo
}

/**
 * 加载列表数据
 */
const loadTemplateList = () => {
  loading.value = true
  return messageTemplateClient.list(templateListRequestParam).then((resp) => {
    const list = resp.data
    total.value = resp.total
    templateList.value = list
    console.log(list)
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  loadTemplateList()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
