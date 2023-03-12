<template>
  <div class="app-container m-user">
    <PhoneAreaCodeSide @change="changeAction"/>
    <PhoneAreaCodeTable ref="table"/>
  </div>
</template>

<script lang="ts" setup>
  import PhoneAreaCodeTable from './components/PhoneAreaCodeTable.vue'
  import PhoneAreaCodeSide from './components/PhoneAreaCodeSide.vue'
  import { ref } from "vue";

  const table = ref()

  const changeAction = (data)=>{
    table.value.getList(data)
  }
</script>

<style scoped lang="scss">
@import "./index";
</style>
