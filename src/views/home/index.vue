<template>
  <div class="relative w-full h-full overflow-hidden bg-[#060e1b]">
    <Bg class="absolute top-0 left-0 z-0 w-full h-full" />
    <div id="container" class="w-full h-full relative z-1"></div>
    <div class="absolute top-0 left-0 z-1 w-full h-full">
      <div id="mask"></div>
      <Card1 id="text1" />
      <Card2 id="text2" />
      <Card3 id="text3" />
      <ScrollDown />
      <ScrollLine v-if="!loading" :progress="scrollProgress" />
      <Transition name="fade">
        <div v-show="loading">
          <WelcomeSvg />
          <FakeLoading :loading="loading" />
        </div>
      </Transition>
      <Transition name="fade-up">
        <BeiAn v-if="isBottom" />
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
  import Card1 from './components/card1.vue'
  import Card2 from './components/card2.vue'
  import Card3 from './components/card3.vue'
  import BeiAn from '@/components/bei-an.vue'
  import ScrollDown from '@/components/scroll-down.vue'
  import WelcomeSvg from '@/components/welcome-svg.vue'
  import FakeLoading from '@/components/fake-loading.vue'
  import ScrollLine from '@/components/scroll-line.vue'
  import Bg from '@/components/bg.vue'
  // @ts-ignore
  import gaodaGlb from '@/assets/models/gaoda.glb'
  import useThreeJs from '@/hooks/useThreeJs'

  defineOptions({
    name: 'Home',
    isRouter: true,
  })

  const {
    render,
		loadModel,
		initCanvas,
		initDracoLoader,
		initCamera,
		initLight,
		watchTouchToScroll,
		watchMouseMove,
		watchMouseWheel,
		updateCameraByScroll,
    isBottom,
    loading,
    scrollProgress
  } = useThreeJs()

  onMounted(() => {
    initCanvas('container')
    initDracoLoader()
		initLight()
		initCamera()
    loadModel({
      path: gaodaGlb,
      scale: 4,
      translateY: -7.6,
      callback: updateCameraByScroll
    })
		watchTouchToScroll()
		watchMouseMove()
		watchMouseWheel()
    render()
  })
</script>
<style>
#mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 40%, #000 100%);
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
