<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>
<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue"

const route = useRoute()
const layoutMap: { [key: string]: any } = {
	MainLayout,
}
const currentLayout = computed(() => {
	return layoutMap[route.meta.layout as string]
})
</script>
