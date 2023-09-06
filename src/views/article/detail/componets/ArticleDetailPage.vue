<template>
  <div class="app-container m-user">
    <el-row>
      <el-col cols="3">

      </el-col>

      <el-col cols="9">
        <MdPreview
            :showCodeRowNumber="true"
            :modelValue="text"/>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import {FormInstance} from 'element-plus'
import {onMounted, reactive, ref} from 'vue'
import {articleClient} from "@/api";
import router from "@/routers";


const ruleFormRef = ref<FormInstance>()
const title = ref('文章详情')
const loading = ref(true)

// 文章详情
const text = ref('')
const article = ref({
  code: null,
  title: null,
  categories: null,
  author: null,
  status: null,
  is_top: null,
  likes_num: null,
  favorites_num: null,
  retweets_num: null,
  page_views: null,
  create_time: null,
  update_time: null
})



const show = () => {
  title.value = '文章详情'
  const code = router.currentRoute._rawValue.query.id
  console.log("Get route code:" + code)
  loadArticleDetail(code)
}

/**
 * 加载详情数据
 */
const loadArticleDetail = (code) => {
  loading.value = true
  return articleClient.details({
    "code": code
  }).then((resp) => {
    article.value = resp
    text.value = resp.content
  }).finally(() => {
    loading.value = false
  })
}

defineExpose({
  show,
})


onMounted(() => {
  show()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
