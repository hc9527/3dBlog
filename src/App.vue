<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue"
import usePixiDrawBg from "@/hooks/usePixiDrawBg"

usePixiDrawBg()
const route = useRoute()
const layoutMap: { [key: string]: any } = {
	MainLayout,
}
const currentLayout = computed(() => {
	return layoutMap[route.meta.layout as string]
})
</script>

<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
