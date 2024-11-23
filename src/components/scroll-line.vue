<template>
  <div class="scroll-line absolute right-10px top-45/100 transform -translate-y-1/2 w-1px h-200px bg-[rgba(255,255,255,0.3)] box-border">
    <div class="absolute w-5px h-50px -left-2px bg-[#aaa] z-9" :style="{ top: progress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress: number
}

defineProps<Props>()

</script>

<style>
.scroll-line::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: 0;
  width: 1px;
  height: 50px;
  background: rgba(255,255,255,0.3);
}
</style>