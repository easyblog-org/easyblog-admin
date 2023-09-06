<template>
  <el-config-provider :size="globalComSize" :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {useSettingStore} from "@/store/modules/setting"
// 配置element中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {mxnzpClient, openApiClient} from "@/api";
import {encrypt} from "@/utils/crypto";

const SettingStore = useSettingStore()
// 配置全局组件大小
const globalComSize = computed((): string => SettingStore.themeConfig.globalComSize)


const queryClientIpAddr = () => {
  if (sessionStorage.getItem(encrypt('ip')) !== undefined && sessionStorage.getItem(encrypt('ip')) !== null) {
    return
  }
  mxnzpClient.getIpInfo().then((resp) => {
    if (undefined === resp || null === resp) {
      return
    }
    /**
     * 数据结构：{"code":1,"msg":"数据返回成功！","data":{"ip":"39.144.38.212","province":"","provinceId":999999,"city":"","cityId":0,"isp":"中国移动","desc":" 中国移动"}}
     *
     */
    const clientIp = resp.data.data.ip || "127.0.0.1"
    openApiClient.getIpLocation(clientIp).then((resp) => {
      if (undefined === resp || null === resp) {
        sessionStorage.setItem("location", '未知')
        sessionStorage.setItem('ip', clientIp)
        return
      }
      /**
       * 数据结构：
       * {
       * 	"resultcode":"200",
       * 	"reason":"查询成功",
       * 	"result":{
       * 		"Country":"中国",
       * 		"Province":"安徽",
       * 		"City":"合肥",
       * 		"District":"",
       * 		"Isp":"移动"
       * 	},
       * 	"error_code":0
       * }
       */
      const location = resp.data.result.Country +' '+ resp.data.result.Province +' '+ resp.data.result.City
      sessionStorage.setItem(encrypt("location"), encrypt(location))
      sessionStorage.setItem(encrypt("ip"), encrypt(clientIp))
    })
  })
}

onMounted(() => {
  queryClientIpAddr()
})
</script>

<style lang="scss">
#app {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: Avenir, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-pager li:focus {
  border: none;
}

.el-dropdown:focus {
  border: none;
}

.svg-icon:focus {
  border: none;
}
</style>
