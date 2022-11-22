<template>
  <div class="relative h-100vh w-full flex justify-center items-center bg-black">
    <div class="text-center text-white">
      <img class="h-300px mb-40px mx-auto" src="@/assets/logo.svg" alt="">
    </div>
    <div class="absolute bottom-0 left-0 w-full pb-16px text-center text-blue-500">
      <a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备19012553号-1</a>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'Home',
	isRouter: true,
})
</script>
