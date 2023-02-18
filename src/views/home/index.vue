<template>
  <div class="home-container">
    <el-row class="row-bg" :gutter="10">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-row class="custom" :gutter="10">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left"
                ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div
                      class="h2"
                      style="color: #2d8cf0"
                  ><count-to
                      :start-val="0"
                      :end-val="5268"
                      :duration="2000"
                      :autoplay="true"
                  ></count-to
                  ></div>
                  <div>用户访问量 </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left" style="background: #64d572"
                ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div
                      class="h2"
                      style="color: #64d572"
                  ><count-to
                      :start-val="0"
                      :end-val="9599"
                      :duration="2000"
                      :autoplay="true"
                  ></count-to
                  ></div>
                  <div>系统消息 </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card style="margin-bottom: 10px">
              <div class="grid-content">
                <div class="left" style="background: #f25e43"
                ><el-icon style="font-size: 24px; color: white"><user /></el-icon
                ></div>
                <div class="right">
                  <div
                      class="h2"
                      style="color: #f25e43"
                  ><count-to
                      :start-val="0"
                      :end-val="595453"
                      :duration="2000"
                      :autoplay="true"
                  ></count-to
                  ></div>
                  <div>数量 </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>系列开源产品</span>
            </div>
          </template>
          <div style="display: flex">
            <el-card
                style="flex: 1; margin-right: 20px; cursor: pointer"
                class="card-item"
                @click="goTo('https://ext.dcloud.net.cn/plugin?id=7511')"
            >
              <div style="color: white; margin-bottom: 10px"><h3>zb-table</h3></div>
              <div style="font-size: 12px; color: white"
              >uniapp 表格组件
                支持固定表头和首列、上拉加载更多、及固定多列，表格自适应内容，排序，多选checkbox、可点击删除，编辑、合计功能，兼容多端</div
              >
            </el-card>
            <el-card
                style="flex: 1; cursor: pointer"
                class="card-item"
                @click="goTo('https://github.com/zouzhibin/vue-admin-perfect')"
            >
              <div style="color: white; margin-bottom: 10px"><h3>vue-admin-perfect</h3></div>
              <div style="font-size: 12px; color: white"
              >系统基于vue3+vuex+ element-plus+ts后台管理系统</div
              >
            </el-card>
          </div>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>每周用户活跃量</span>
            </div>
          </template>
          <div>
            <bar-charts height="300px" width="100%" id="bar1"></bar-charts>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
  import { User } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import AvatarLogo from '@/assets/image/avatar.png'
  import weLogo from '@/assets/image/we.png'
  import CountTo from '@/components/CountTo/index.vue'
  import BarCharts from '@/views/echarts/simple/components/bar.vue'

  const goTo = (url) => {
    window.open(url, '_blank')
  }
</script>

<style scoped lang="scss">
@import "./index";
</style>
