<template>
  <div class="relative w-full h-full overflow-hidden">
    <div id="container" class="w-full h-full"></div>
    <div id="mask"></div>
    <Card1 id="text1" />
    <Card2 id="text2" />
    <Card3 id="text3" />
    <WelcomeSvg id="svg" />
    <ScrollDown />
    <BeiAn />
  </div>
</template>
<script setup lang="ts">
  import Card1 from './components/card1.vue'
  import Card2 from './components/card2.vue'
  import Card3 from './components/card3.vue'
  import BeiAn from '@/components/bei-an.vue'
  import ScrollDown from '@/components/scroll-down.vue'
  import WelcomeSvg from '@/components/welcome-svg.vue'
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
		initParticles,
		initLight,
		watchTouchToScroll,
		watchMouseMove,
		watchMouseWheel,
		updateCameraByScroll
  } = useThreeJs()

  onMounted(() => {
    initCanvas('container')
    initDracoLoader()
		initLight()
		initCamera()
		initParticles()
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
  background: radial-gradient(circle at center, transparent 40%, black 100%);
  pointer-events: none;
}
#svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 1;
  transition: opacity 1s;
}
</style>
