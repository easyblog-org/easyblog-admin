<template>
  <div class="m-user-table">
    <div class="header">
      <el-form :inline="true">
        <el-form-item class="tree-search-bar">
          <el-input v-model="filterTreeText" placeholder="查询节点"/>
        </el-form-item>
      </el-form>
    </div>

    <el-card>
      <div class="custom-tree-container">
        <el-tree
            :data="treeData"
            node-key="id"
            default-expand-all
            highlight-current
            :expand-on-click-node="true"
            ref="treeRef"
            icon="Folder"
            :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span class="custom-tree-operator">
            <a @click="edit(node,data)" class="custom-tree-node-append"><el-icon><Edit/></el-icon></a>
            <el-popover placement="right" :width="80">
              <div style="text-align: center; margin: 0">
                <el-button size="small" text @click="appendChildNode(data)">添加子节点</el-button>
                <el-button size="small" text @click="appendSiblingNode(data)">添加兄弟节点</el-button>
              </div>
              <template #reference>
                <a style="margin-left: 10px" class="custom-tree-node-append"><el-icon><FolderAdd/></el-icon></a>
              </template>
            </el-popover>
            <a style="margin-left: 10px" @click="remove( data)" class="custom-tree-node-delete"> <el-icon><FolderDelete/></el-icon> </a>
          </span>
        </span>
          </template>
        </el-tree>
      </div>
    </el-card>
  </div>

  <ArticleCategoryEditDialog ref="categoryEditDialogRef" @refresh="loadAllArticleCategories"/>
</template>
<script lang="ts" setup>
import {ElMessage, ElMessageBox, ElTree, FormInstance} from 'element-plus'
import {onMounted, ref, watch, markRaw} from 'vue'
import {articleClient} from '@/api'
import {useRouter} from "vue-router";
import {Delete} from '@element-plus/icons-vue'
import ArticleCategoryEditDialog from "@/views/article/category/components/ArticleCategoryEditDialog.vue";
import {Tree} from "@/views/article/category/Tree";
import {BATCH_DELETE_PASSWORD} from "@/config";

const router = useRouter()
const categoryEditDialogRef = ref()
const treeRef = ref<InstanceType<typeof ElTree>>()
const loading = ref(true)
const articleCategoryList = ref([])
const filterTreeText = ref('')
const treeData = ref<Tree[]>()

const edit = (node, data) => {
  categoryEditDialogRef.value.show(data, true)
}

const append = (data: Tree, addChildNode) => {
  categoryEditDialogRef.value.show(data, false, addChildNode)
}

//Add sibling node
const appendSiblingNode = (data: Tree) => {
  append(data, false)
}

//Add children node
const appendChildNode = (data: Tree) => {
  append(data, true)
}


const remove = (data: Tree) => {
  ElMessageBox.confirm('你确定要删除当前分类节点吗，删除后其子节点也会被删除?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
    icon: markRaw(Delete),
  }).then(() => {

    console.log("data==>" + data.id)
    articleClient.deleteCategory(data.id, BATCH_DELETE_PASSWORD).then((resp) => {
      ElMessage.success('删除成功');
    }).catch((err) => {
      ElMessage.error('删除失败');
    })
  }).finally(() => {
    loading.value = true
    loadAllArticleCategories();
  })
}


const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

const convertToTree = (list, rootParentId = -1, parentPath = '') => {
  const tree = [];
  for (const item of list) {
    if (item.pid === rootParentId) {
      const nodePath = parentPath ? `${parentPath}/${item.name}` : `/${item.name}`;
      const children = convertToTree(list, item.id, nodePath);
      const treeNode: Tree = {
        id: item.id,
        label: item.name,
        pid: item.pid,
        parentPath: parentPath,
        path: nodePath // 设置 path 为当前节点的完整路径
      };

      if (children.length > 0) {
        treeNode.children = children;
      }
      tree.push(treeNode);
    }
  }

  return tree;
}

watch(filterTreeText, (val) => {
  treeRef.value!.filter(val)
})

watch(articleCategoryList, (val) => {
  treeData.value = convertToTree(val, -1)
})


/**
 * 加载列表数据
 */
const loadAllArticleCategories = () => {
  let offset = 0
  let pages = 0
  const limit = 100
  articleCategoryList.value = []
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
        articleCategoryList.value = [...articleCategoryList.value, ...resp.data]
      }).catch((err) => {
        ElMessage.error('加载分类列表失败');
      })
    }
  }).catch((err) => {
    ElMessage.error('加载分类列表失败');
  })
}

onMounted(() => {
  loadAllArticleCategories()
})
</script>
<style lang="scss" scoped>
@import '../index';
</style>
