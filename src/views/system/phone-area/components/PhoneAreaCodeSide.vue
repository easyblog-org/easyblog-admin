<template>
  <el-card class="m-dept-side">
    <div class="title">国际冠码与国码管理</div>

    <el-input v-model="filterText" placeholder="输入关键字进行过滤" class="filter-search"/>

    <div class="filter-tree">
      <el-scrollbar class="scrollbar">
        <el-tree
            ref="treeRef"
            :data="phoneAreaList"
            :props="defaultProps"
            default-expand-all
            :highlight-current="true"
            :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node" @click="selectAction(node, data)">
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, ref, watch} from 'vue'
import {ElMessage, ElMessageBox, ElTree} from "element-plus";
import {staticClient} from "@/api";

const emit = defineEmits(['change'])
const phoneAreaData = ref([])
const phoneAreaList = ref<Tree[]>()

class Continent {
  key: string;
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

interface Tree {
  id: string
  name: string
  createTime?: string
  remark?: string
  children?: Tree[]
}

const loadPhoneAreaCodeList = () => {
  staticClient.getAllContinent().then((resp: Continent[]) => {
    if (!resp) return
    for (let index in resp) {
      phoneAreaData.value.push({
        id: resp[index].key,
        name: resp[index].value
      })
    }
    phoneAreaList.value = [{"id": null, "name": "全部"}, ...phoneAreaData.value]
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  })
}

onBeforeMount(() => {
  loadPhoneAreaCodeList()
});

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id'
}

// 监听输入
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

// 搜索
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

/**
 * 切换PhoneAreaEntry
 * @param node
 * @param data
 */
const selectAction = (node, data) => {
  console.log('node===>', node)
  console.log('data===>', data)
  emit('change', data)
}

onMounted(() => {
  selectAction(null, {id: null, name: '全部'})
})
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>
