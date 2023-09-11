<template>
  <PageWrapLayout class="m-container-layout mark-down">
    <el-row style="margin-bottom: 20px">
      <el-col :span="17" style="margin-right: 10px">
        <el-input
            v-model="article.title"
            maxlength="100"
            placeholder="文章标题"
            show-word-limit
            type="text"
        />
      </el-col>
      <el-col :span="6">
        <el-button type="warning" @click="submitAsDraft">保存草稿</el-button>
        <el-button type="primary" @click="submitAsPublish">发布文章</el-button>
      </el-col>
    </el-row>
    <div class="" style="flex: 1">
      <MdEditor
          :showCodeRowNumber="editorConfig.showCodeRowNumber"
          v-model="article.text"
          :previewTheme="editorConfig.previewTheme"
          :codeTheme="editorConfig.codeTheme"
          @onUploadImg="onUploadImg"/>
    </div>

    <el-dialog v-model="dialogVisible" title="发布文章" width="50%">
      <el-form ref="ruleFormRef" :model="article" :rules="rules" label-width="100px">
        <el-form-item label="文章分类" prop="category">
          <el-row>
            <el-col :span="12">
              <el-cascader
                  style="width: 280px"
                  v-model="article.category"
                  :options="categories"
                  :props="cascaderProps"
                  :show-all-levels="false"
                  @change="handleCascaderChange"
              ></el-cascader>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-switch
              v-model="article.isTop"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
          ></el-switch>
        </el-form-item>
        <el-form-item label="文章首图" prop="featuredImage">
          <div class="content">
            <el-upload
                :before-upload="beforeUploadAction"
                action="javascript:void(0);"
                ref="imageUploadRef"
                :on-change="handleChange"
                :show-file-list="false"
                :auto-upload="false"
                list-type="picture-card"
            >
              <el-progress v-if="percentageVisible" type="circle" :percentage="uploadPercentage"/>
              <div v-if="!percentageVisible">
                <el-tooltip v-if="featuredImageUrl!=null" content="上传文章首图" placement="bottom">
                  <el-image :src="featuredImageUrl" class="avatar"
                            style="max-height: 148px" fit="cover"/>
                </el-tooltip>
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus/>
                </el-icon>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doSubmit">提交</el-button>
      </span>
      </template>
    </el-dialog>
  </PageWrapLayout>
</template>
<script lang="ts" setup>
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {ElMessage, FormInstance} from 'element-plus'
import {onMounted, reactive, ref, watch} from 'vue'
import {articleClient} from "@/api";
import {uploadFile} from "@/utils/qiniuUpload";
import {QINIU_CLOUD_CONFIG} from "@/config";
import {useUserStore} from "@/store/modules/user";
import {useRouter} from "vue-router";

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const userStore = useUserStore()
const title = ref('文章详情')
const loading = ref(true)
const dialogVisible = ref(false)
const articleCategories = ref([])
const categories = ref([]);
const featuredImageUrl = ref()
const percentageVisible = ref(false)
const uploadPercentage = ref(0)
const editorConfig = reactive({
  showCodeRowNumber: true,
  previewTheme: 'vuepress',
  codeTheme: 'stackoverflow'
});
// 级联选择器的配置
const cascaderProps = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true
};


// 文章详情
const article = reactive({
  title: '',
  text: '',
  status: '',
  category: '',
  featuredImage: '',
  isTop: false
});

const rules = reactive({
  category: [
    {required: true, message: '请选择文章分类', trigger: 'change'}
  ],
  featuredImage: [
    {required: true, message: '请上传文章首图', trigger: 'change'}
  ]
})

const handleCascaderChange = (value) => {
  if (value && value.length > 0) {
    article.category = value[value.length - 1]
  }
};

const submitAsDraft = () => {
  submit('DRAFT')
}

const submitAsPublish = () => {
  submit('PUBLISHED')
}

const submit = (saveAction = 'PUBLISHED') => {
  if (!article.title) {
    ElMessage.warning('请填写文章标题!')
    return
  }
  if (!article.text) {
    ElMessage.warning('写点内容再保存吧!')
    return
  }
  dialogVisible.value = true
  article.status = saveAction
}

/**
 * 提交按钮
 * @param done
 */
const doSubmit = async (done: () => void) => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      postArticle()
    } else {
      console.log("校验失败")
    }
  })


}

/**
 * 发布文章
 */
const postArticle = () => {
  const userInfo = userStore.userInfo
  if (!userInfo) {
    ElMessage.warning('登录后再操作吧!')
    loading.value = false
    return;
  }

  // 提交数据
  articleClient.create({
    'author_id': userInfo.code,
    'title': article.title,
    'content': article.text,
    'is_top': article.isTop,
    'category': article.category,
    'status': article.status,
    'featured_image': featuredImageUrl.value
  }).then((resp) => {
    if (article.status === 'PUBLISHED') {
      ElMessage.success('发布成功!')
      router.replace({
        path: '/article/detail',
        query: {id: resp.data}
      })
    } else {
      ElMessage.success('保存成功!')
    }

    dialogVisible.value = false
  }).catch((err) => {
    ElMessage.error('保存失败');
  }).finally(() => {
    loading.value = false
  })
}

const beforeUploadAction = (file) => {
  // 体积检测
  const maxSize = 7; // 最大5M
  if (file.size / 1024 / 1024 > maxSize) {
    ElMessage.warning(`体积不能超过${maxSize}M`)
    return false;
  }
  // 类型检测
  const types = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
  if (!types.includes(file.raw.type)) {
    ElMessage.warning('文件类型仅支持jpg,png,gif,jpeg');
    return false;
  }

  return true;
}

const handleChange = (file, fileList) => {
  console.log(file)
  if (beforeUploadAction(file)) {
    featuredImageUrl.value = file.url
    if (file) {
      console.log("Upload img.....")
      uploadFeaturedImage(file.raw)
    }
  }
}

/**
 * 上传图片
 * @param files
 * @param callback
 */
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('file', file);

          // upload('/api/img/upload', form, {
          //       headers: {
          //         'Content-Type': 'multipart/form-data'
          //       }
          //     })
          //     .then((res) => rev(res))
          //     .catch((error) => rej(error));
        });
      })
  );

  callback(res.map((item) => item.data.url));
};


/**
 * 上传图片到七牛云
 * @param file 图片
 */
const uploadFeaturedImage = async (file: File) => {
  if (!file) {
    console.log("文件非法：" + file)
    return
  }
  percentageVisible.value = true
  console.log("开始上传图片...." + file)
  uploadFile(file).subscribe({
    next: result => {
      // 主要用来展示进度
      uploadPercentage.value = result.total.percent
    },
    error: errResult => {
      // 失败报错信息
      console.log("上传图片失败....")
      ElMessage.error(`上传七牛云失败: ${errResult.message}`);
    },
    complete: result => {
      // 接收成功后返回的信息
      featuredImageUrl.value = "https://" + QINIU_CLOUD_CONFIG.domain + `/${result.key}`
      article.featuredImage = featuredImageUrl.value
      percentageVisible.value = false
      ElMessage.success('上传成功');
      console.log(" article.featuredImage>>>" + article.featuredImage)
    }
  });
}

/**
 * 加载全部文章分类
 */
const loadAllArticleCategories = () => {
  let offset = 0
  let pages = 0
  const limit = 100
  articleClient.categoryList({
    'offset': offset,
    'limit': 0
  }).then((resp) => {
    if (resp) {
      pages = Math.ceil(resp.total / 100.0)
    }

    for (let pageNo = 0; pageNo < pages; pageNo++) {
      offset = limit * pageNo
      articleClient.categoryList({
        'offset': offset,
        'limit': limit
      }).then((resp) => {
        articleCategories.value = [...articleCategories.value, ...resp.data]
        if (pageNo === pages - 1) {
          // 数据加载完成之后渲染级联选择框
          buildArticleCategoriesOptionsCascader()
        }
      }).catch((err) => {
        ElMessage.error('加载分类列表失败');
      })
    }
  }).catch((err) => {
    ElMessage.error('加载分类列表失败');
  })
}


/**
 * 构建级联选择数组
 */
const buildArticleCategoriesOptionsCascader = () => {
  // 创建一个空对象，用于快速查找每个元素
  const idMap = {};
  // 创建一个空数组，用于存储最终的级联数组
  const result = [];

  // 将数组中的每个元素按照 id 存入 idMap
  articleCategories.value.forEach((item) => {
    idMap[item.id] = {...item, children: []};
  });

  // 遍历数组，将每个元素添加到对应父元素的 children 数组中
  articleCategories.value.forEach((item) => {
    if (item.pid === -1) {
      // 最顶级元素，直接添加到结果数组中
      result.push(idMap[item.id]);
    } else {
      // 子节点，添加到对应父节点的 children 数组中
      idMap[item.pid].children.push(idMap[item.id]);
    }
  });

  categories.value = result
}

onMounted(() => {
  loadAllArticleCategories()
})


</script>
<style lang="scss" scoped>
@import '../index';
</style>
