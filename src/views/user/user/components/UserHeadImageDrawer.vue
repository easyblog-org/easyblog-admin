<template>
  <el-drawer class="user-detail-drawer" v-model="dialogVisible" @close="handleClose" size="40%">
    <template #header="{ titleId }">
      <span :id="titleId" class="header">用户头像</span>
    </template>
    <el-row class="user-detail-body">
      <el-row>
        <el-col :span="4">
          <div class="title">头 像</div>
        </el-col>
        <el-col :span="20">
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
                <el-tooltip v-if="headImageUrl!=null" content="更换头像" placement="bottom">
                  <el-image :src="headImageUrl" class="avatar"
                            style="max-height: 148px" fit="cover"/>
                </el-tooltip>
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus/>
                </el-icon>
              </div>
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">创建时间</div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-if="headImage!==undefined && headImage!==null" v-html="headImage.create_time"></div>
          <div class="content" v-if="headImage===null || headImage===undefined">N/A</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="title">更新时间</div>
        </el-col>
        <el-col :span="20">
          <div class="content" v-if="headImage!==undefined && headImage!==null" v-html="headImage.update_time"></div>
          <div class="content" v-if="headImage===null || headImage===undefined">N/A</div>
        </el-col>
      </el-row>
      <!--      <el-row>
              <el-col :span="4">
                <div class="title">历史头像（最近10个）</div>
              </el-col>
              <el-col :span="20">
                <div class="content">
                  <el-tag v-for="(value,index) in headImage.roles" :key="value.id" class="mx-1"
                          :class="index!==headImage.roles-1?'m-tag-gap':''" size="default">
                    {{ value.name }}
                  </el-tag>
                </div>
              </el-col>
            </el-row>-->
    </el-row>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSure">确定</el-button>
        </span>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {ElMessage, FormInstance} from "element-plus";
import {Plus} from '@element-plus/icons-vue'
import {headerClient} from "@/api";
import {uploadFile} from "@/utils/qiniuUpload";
import {QINIU_CLOUD_CONFIG} from "@/config";
import {useUserStore} from "@/store/modules/user"

const UserStore = useUserStore()
const ruleFormRef = ref<FormInstance>()
const imageUploadRef = ref<FormInstance>()
const dialogVisible = ref(false)
const percentageVisible = ref(false)
const uploadPercentage = ref(0)
const title = ref('用户头像')
const headImage = ref();
const loading = ref(true)
const headImageUrl = ref()
const uploadFileList = ref([])
const userId = ref()

const show = (user_id: number) => {
  title.value = '用户头像'
  loading.value = true
  userId.value = user_id
  loadUserHeaderImage(user_id).then(() => {
    if (undefined !== headImage.value && null !== headImage.value) {
      headImageUrl.value = headImage.value.header_img_url
    }
    dialogVisible.value = true
  })
}

const handleChange = (file, fileList) => {
  console.log(file)
  headImageUrl.value = file.url
  uploadFileList.value[0] = file
  console.log(fileList)
}

const handleClose = () => {
  //关闭抽屉时初始化上传组件
  headImage.value = null
  headImageUrl.value = null
  uploadFileList.value = []
}

const beforeUploadAction = (file) => {
  return new Promise((resolve, reject) => {
    // 体积检测
    const maxSize = 7; // 最大5M
    if (file.size / 1024 / 1024 > maxSize) {
      ElMessage.warning(`体积不能超过${maxSize}M`)
      return false;
    }
    // 类型检测
    const types = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
    if (!types.includes(file.type)) {
      ElMessage.warning('文件类型仅支持jpg,png,gif,jpeg');
      return Promise.reject("类型错误");
    }
  })
}

/**
 * 上传图片到七牛云
 * @param file 图片
 */
const uploadImage = async (file: File) => {
  if (!file) return
  percentageVisible.value = true
  uploadFile(file).subscribe({
    next: result => {
      // 主要用来展示进度
      uploadPercentage.value = result.total.percent
    },
    error: errResult => {
      // 失败报错信息
      ElMessage.error(`上传七牛云失败: ${errResult.message}`);
    },
    complete: result => {
      // 接收成功后返回的信息
      headImageUrl.value = "https://" + QINIU_CLOUD_CONFIG.domain + `/${result.key}`
      saveHeaderImage(headImageUrl.value)
      changeCurrentLoginUserAvatar(headImageUrl.value)
      percentageVisible.value = false
      ElMessage.success('修改成功');
    }
  });
}

/**
 * 更换当前登录用户的头像
 * @param newHeaderUrl
 */
const changeCurrentLoginUserAvatar = (newHeaderUrl) => {
  if (!newHeaderUrl) return
  if (UserStore.userInfo == null || UserStore.userInfo.id !== userId.value) return;
  UserStore.refresh()
}

/**
 * 点击确认按钮
 */
const onSure = () => {
  if (undefined === uploadFileList.value[0] || null == uploadFileList.value[0]) {
    dialogVisible.value = false
  } else {
    uploadImage(uploadFileList.value[0].raw)
  }
}

/**
 * 保存头像
 * @param image_url
 */
const saveHeaderImage = (image_url: string) => {
  return headerClient.save({
    user_id: userId.value,
    header_img_url: image_url
  }).then(() => {
    dialogVisible.value = false
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  })
}

/**
 * 查询头像
 * @param user_id
 */
const loadUserHeaderImage = (user_id: number): Promise<any> => {
  return headerClient.details({
    'user_id': user_id,
    'status': 1
  }).then((resp) => {
    headImage.value = resp
  }).catch((err) => {
    ElMessage({
      message: err.message,
      type: 'error',
    })
  }).finally(() => {
    loading.value = false
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
