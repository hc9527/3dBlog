<template>
  <div class="absolute bottom-16px left-1/2 transform -translate-x-1/2 w-33vw h-4px rounded-4px overflow-hidden bg-white">
    <div class="progress" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  loading: boolean
}

const props = defineProps<Props>()

const progress = ref(0)
let timer: NodeJS.Timer | null = null

const startLoading = () => {
  timer = setInterval(() => {
    if (progress.value < 50) {
      progress.value += 10
    } else if (progress.value < 80) {
      progress.value += 3
    } else if (progress.value < 90) {
      progress.value += 2
    } else if (progress.value < 99) {
      progress.value += 1
    }
    // console.log(progress.value)
  }, 1000)
}

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
  }
}

watch(() => props.loading, (newValue) => {
  if (!newValue) {
    clearTimer()
    progress.value = 100
  }
})

onBeforeUnmount(() => {
  clearTimer()
})
onMounted(() => {
  startLoading()
})
</script>

<style>
.progress {
  height: 100%;
  transition: width .3s;
  background: linear-gradient(90deg, red 0%, yellow 15%, lime 30%, cyan 50%, blue 65%, magenta 80%, red 100%);
  background-size: 200%;
  animation: moveGradient 2s linear infinite;
}

@keyframes moveGradient {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: -200% 0%;
  }
}
</style>