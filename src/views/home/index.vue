<template>
  <div class="bg-black h-100vh w-full flex justify-center items-center">
    <div class="text-center text-white">
      <img class="h-300px mb-40px mx-auto" src="@/assets/logo.svg" alt="">
      <div class="mt-20px">
        <router-link to="about" class="text-blue-600">打开About</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'Home',
	isRouter: true,
})
</script>
