<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item class="search-bar">
          <el-input v-model="formInline.query_value" placeholder="请输入" class="input-with-select"
                    @keydown.enter="onSearch">
            <template #prepend>
              <el-select v-model="formInline.query_key" placeholder="文章标题" style="width: 120px"
                         @change="handleQueryKeyChange">
                <el-option label="文章标题" value="title"/>
                <el-option label="文章ID" value="code"/>
                <el-option label="是否置顶" value="is_top"/>
                <el-option label="文章分类" value="category"/>
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
      <div class="table-inner">
        <el-table v-loading="loading" :data="articleList" style="width: 100%; height: 100%" border>
          <el-table-column prop="code" label="文章ID" align="center" width="180"/>
          <el-table-column prop="title" label="文章标题" align="center" width="200"/>
          <el-table-column prop="categories" label="文章分类" align="center" width="180">
            <template #default="scope">
              <el-tag v-for="item in scope.row.categories" :key="item.id" style="margin-top: 5px" class="mx-1"
                      size="default">
                {{ item.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="文章状态" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.status==='DRAFT'" class="mx-1" size="default">草稿</el-tag>
              <el-tag v-else-if="scope.row.status==='PUBLISHED'" class="mx-1" size="default" type="success">已发布</el-tag>
              <el-tag v-else-if="scope.row.status==='DELETED'" class="mx-1" size="default" type="danger">已删除</el-tag>
              <el-tag v-else class="mx-1" size="default" type="info">未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_top" label="是否置顶" align="center" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.is_top===true" class="mx-1" size="default" type="success">置顶</el-tag>
              <el-tag v-if="scope.row.is_top===false" class="mx-1" size="default">不置顶</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center" width="180"/>
          <el-table-column prop="update_time" label="更新时间" align="center" width="180"/>
          <el-table-column prop="operator" label="操作" width="280px" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="DataLine" @click="showDetails(scope.row)">
                详情
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
            :page-size="articleListRequestParam.limit"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import {articleClient} from '@/api'
import {useRouter} from "vue-router";

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const formInline = reactive({
  query_key: 'title',
  query_value: null
})
const loading = ref(true)
const articleList = ref([])
const currentPage = ref(1)
const total = ref(0)
const articleListRequestParam = {
  title: null,
  code: null,
  is_top: null,
  category: null,
  limit: 10,
  offset: 0,
}

const onSearch = () => {
  if (formInline.query_key === 'title') {
    articleListRequestParam.title = formInline.query_value
  } else if (formInline.query_key === 'code') {
    articleListRequestParam.code = formInline.query_value
  } else if (formInline.query_key === 'is_top') {
    articleListRequestParam.is_top = formInline.query_value
  } else if (formInline.query_key === 'category') {
    articleListRequestParam.category = formInline.query_value
  }
  loading.value = true
  loadArticleList()
}

/**
 * 处理查询主键变更事件
 */
const handleQueryKeyChange = (val: string) => {
  if (formInline.query_key === 'title') {
    articleListRequestParam.code = null
    articleListRequestParam.is_top = null
    articleListRequestParam.category = null
  } else if (formInline.query_key === 'code') {
    articleListRequestParam.title = null
    articleListRequestParam.is_top = null
    articleListRequestParam.category = null
  } else if (formInline.query_key === 'is_top') {
    articleListRequestParam.title = null
    articleListRequestParam.code = null
    articleListRequestParam.category = null
  } else if (formInline.query_key === 'category') {
    articleListRequestParam.title = null
    articleListRequestParam.code = null
    articleListRequestParam.is_top = null
  }
}

const reset = (formEl: FormInstance | undefined) => {
  articleListRequestParam.title = null
  articleListRequestParam.code = null
  articleListRequestParam.is_top = null
  articleListRequestParam.category = null
  loadArticleList()
}

const showDetails = (row) => {
  router.replace({
    path: '/article/detail',
    query: {id: row['code']}
  })
}


const editHandler = (row) => {
  //pushRecordDrawer.value.show(row)
}


/**
 * 删除文章
 * @param row
 */
const del = (row) => {
  loading.value = true
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  }).then(() => {
    articleClient.update(row['id'], {
      deleted: true,
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
    })
  }).finally(() => {
    loading.value = true
  })
}


/**
 * 分页大小变化
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  articleListRequestParam.limit = pageSize;
  articleListRequestParam.offset = 0
  currentPage.value = 1
  loadArticleList()
}

/**
 * 翻页
 * @param pageNo
 */
const handleCurrentChange = (pageNo: number) => {
  articleListRequestParam.offset = (pageNo - 1) * articleListRequestParam.limit
  loadArticleList()
  currentPage.value = pageNo
}

/**
 * 加载列表数据
 */
const loadArticleList = () => {
  loading.value = true
  return articleClient.list(articleListRequestParam).then((resp) => {
    const list = resp.data
    total.value = resp.total
    articleList.value = list
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  loadArticleList()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
