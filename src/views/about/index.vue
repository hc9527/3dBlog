<template>
  <div class="h-100vh w-full flex justify-center items-center">
    <div class="text-center">
      <div>
        <router-link class="text-blue-600" to="home">返回Home</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'About',
	isRouter: true,
})
</script>
