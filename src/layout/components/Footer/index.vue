<template>
	<div class="footer-layout">
		<span href="/" target="_blank"> ©2019-{{ getCurrentFullYear }}  EasyBlog 版权所有.</span>
	</div>
</template>

<script lang="ts" setup>
import {computed} from "vue";

const getCurrentFullYear = computed(()=>{
  return new Date().getFullYear()
})

</script>
<style scoped lang="scss">
.footer-layout{
  height: 40px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.45);
}
</style>
