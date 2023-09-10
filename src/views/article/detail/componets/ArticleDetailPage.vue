<template>
  <div class="app-container m-user">
    <el-row>
      <el-col :span="17" style="margin-right: 20px">
        <el-card shadow="never">
          <el-row>
            <h1>
              {{ article.title }}
            </h1>
          </el-row>
          <el-row>
            <MdPreview
                :showCodeRowNumber="true"
                :modelValue="text"
                previewTheme="vuepress"
                codeTheme="stackoverflow"/>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="never">
          <el-descriptions :title="title" :column="1">
            <el-descriptions-item label="文章CODE">{{ article.code }}</el-descriptions-item>
            <el-descriptions-item label="文章分类" :span="2">
              <el-tag v-for="item in article.categories" :key="item.id" style="margin-left: 5px" class="mx-1"
                      size="default">
                {{ item.name }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="文章状态">
              <el-tag v-if="article.status==='DRAFT'" class="mx-1" size="default">草稿</el-tag>
              <el-tag v-else-if="article.status==='PUBLISHED'" class="mx-1" size="default" type="success">已发布</el-tag>
              <el-tag v-else-if="article.status==='DELETED'" class="mx-1" size="default" type="danger">已删除</el-tag>
              <el-tag v-else class="mx-1" size="default" type="info">未知</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="是否置顶">
              <el-tag v-if="article.is_top===true" class="mx-1" size="default" type="success">置顶</el-tag>
              <el-tag v-if="article.is_top===false" class="mx-1" size="default">不置顶</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="访问数">
              <count-to
                  class="count-to"
                  :start-val="0"
                  :end-val="article.page_views"
                  :duration="1500"
                  :autoplay="true"
              >
              </count-to>
            </el-descriptions-item>
            <el-descriptions-item label="点赞数">
              <count-to
                  class="count-to"
                  :start-val="0"
                  :end-val="article.likes_num"
                  :duration="1500"
                  :autoplay="true"
              >
              </count-to>
            </el-descriptions-item>
            <el-descriptions-item label="收藏数">
              <count-to
                  class="count-to"
                  :start-val="0"
                  :end-val="article.favorites_num"
                  :duration="1500"
                  :autoplay="true"
              >
              </count-to>
            </el-descriptions-item>
            <el-descriptions-item label="转发数">
              <count-to
                  class="count-to"
                  :start-val="0"
                  :end-val="article.retweets_num"
                  :duration="1500"
                  :autoplay="true"
              >
              </count-to>
            </el-descriptions-item>
            <el-descriptions-item label="文章首图" v-if="article.featured_image">
              <el-image :src="article.featured_image" style="max-height: 148px" fit="cover"/>
            </el-descriptions-item>

            <el-descriptions-item label="创建时间">{{ article.create_time }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ article.update_time }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import CountTo from '@/components/CountTo/index.vue'
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import {ElMessage, FormInstance} from 'element-plus'
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
  featured_image: null,
  page_views: null,
  create_time: null,
  update_time: null
})


const show = () => {
  title.value = '文章详情'
  const code = router.currentRoute.value.query.id
  if (!code) {
    router.replace({
      path: '/404'
    })
    ElMessage.error('出错啦！');
    return;
  }
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


onMounted(() => {
  show()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
