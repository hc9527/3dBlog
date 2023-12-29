<template>
  <div class="relative w-100vw h-100vh">
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
  import * as THREE from 'three'
  import * as TWEEN from '@tweenjs/tween.js'
  import gsap from "gsap"
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
  import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
  // import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
  import Card1 from './components/card1.vue'
  import Card2 from './components/card2.vue'
  import Card3 from './components/card3.vue'
  import BeiAn from '@/components/bei-an.vue'
  import ScrollDown from '@/components/scroll-down.vue'
  import WelcomeSvg from '@/components/welcome-svg.vue'
  // @ts-ignore
  import gaodaGlb from '@/assets/models/gaoda2.glb'

  defineOptions({
    name: 'Home',
    isRouter: true,
  })

  onMounted(() => {
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor('#000')
    scene.background = new THREE.Color('#1b1e1e')
    document.getElementById('container')?.appendChild(renderer.domElement)

    // 创建解析器
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    // 创建镜头
    const width = window.innerWidth
    const height = window.innerHeight
    const scale = 500
    const camera = new THREE.OrthographicCamera(-width / scale, width / scale, height / scale, -height / scale, 1, 10)
    camera.position.set(0, 0, 5)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    const cameraPerspectiveHelper = new THREE.CameraHelper(camera)
    cameraPerspectiveHelper.visible = false
    scene.add(cameraPerspectiveHelper)
    const camera2 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100)
    camera2.position.z = 15
    // const controls = new OrbitControls(camera2, renderer.domElement)
    const text1 = document.getElementById("text1")
    const text2 = document.getElementById("text2")
    const text3 = document.getElementById("text3")


    let model: any, particles: any
    const timeline1 = 6
    const timeline2 = 3.5
    const originY = 7.6
    const originScale = 0.012
    let yValue = 0
    let rValue = 0
    let gsapDuration = 0.3
    let loading = true
    const originColorMap: LooseObject = {}
    const originColor: LooseObject[] = []
    const originLine: LooseObject[] = []
    loadModel(gaodaGlb)


    function loadModel(modelPath: string) {
      loader.load(modelPath, (gltf: any) => {
        model = gltf.scene
        model.scale.set(originScale, originScale, originScale)
        model.position.set(1, -originY, 0)
        // 设置模型的初始map透明度
        model.traverse((child: any) => {
            if (child.isMesh) {
              originColorMap[child.id] = child.material.color.getHex()
            }
        })
        model.traverse((child: any) => {
            if (child.isMesh) {
              originColor.push(child.id)
              child.material.color.set(0x888888)
            } else if (child.isLineSegments) {
              originLine.push(child.id)
              child.material.opacity = 0
              child.material.transparent = true
            }
        })
        // console.log(originColorMap)
        scene.add(model)
        loading = false
        updateCameraY(0, 0)
      })
    }

    // 创建灯光
    const ambientLight = new THREE.HemisphereLight("white", "darkslategrey", 0)
    scene.add(ambientLight)

    // 创建直射光源
    const directionalLight = new THREE.DirectionalLight(0xf7f7f7, 0.4)
    // 设置光源位置
    directionalLight.position.set(3, 3, 3)
    scene.add(directionalLight)
    const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
    lightHelper.visible = false
    scene.add(lightHelper)

    // 监听鼠标移动事件
    let mouseX = 0, mouseY = 0
    document.addEventListener('mousemove', function(event) {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = - (event.clientY / window.innerHeight) * 2 + 1
    })

    function createParticles() {
      // 创建粒子材质
      let particleMaterial = new THREE.PointsMaterial({
          color: 0xFFFFFF,
          size: 0.9, // 点的大小
          transparent: true,
          opacity: 1,
          depthTest: false
      })
      // 创建粒子几何体
      let particleGeometry = new THREE.BufferGeometry()
      let particleCount = 1000 // 粒子数量
      // 生成随机的粒子位置
      let positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < positions.length; i += 3) {
          let x = (Math.random() - 0.5) * 10
          let y = (Math.random() - 0.5) * 10
          let z = (Math.random() - 0.5) * 10 - 2
          positions[i] = x
          positions[i + 1] = y
          positions[i + 2] = z
      }
      // 将位置数据设置给几何体
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      // 创建粒子系统
      particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)
    }
    createParticles()


    function getOpacity(yValue: number, lowerRange: number, upperRange: number) {
      let opacity = 0
      if (yValue >= lowerRange && yValue <= upperRange) {
          // 在范围内时，根据 y 值计算 opacity
          opacity = Math.abs((yValue - lowerRange) / (upperRange - lowerRange))
      }
      return opacity
    }
    function getOpacity2(yValue: number, lowerRange: number, upperRange: number) {
      let opacity = 0
      if (yValue >= lowerRange && yValue <= upperRange) {
          // 在范围内时，根据 y 值计算 opacity
          opacity = 1 - Math.abs((yValue - lowerRange) / (upperRange - lowerRange))
      }
      return opacity
    }

    function scrollChange(deltaY: number) {
      if (loading) {
        return
      }
      yValue += deltaY * 0.003
      yValue = Math.min(timeline1 + timeline2, Math.max(0, yValue))
      if (yValue !== 0 && yValue !== (timeline1 + timeline2) && rValue <= 6.6) {
        rValue += deltaY * 0.002
      } else {
        rValue = yValue === 0 ? 0 : 6.6
      }
      // console.log(yValue, rValue)
      updateCameraY(yValue, rValue)
    }
    window.addEventListener('wheel', function(event) {
        // 根据滚轮事件更新 y 值
        scrollChange(event.deltaY)
    })
    // 定义变量来跟踪触摸开始时的坐标
    let startY: number

    // 添加触摸开始事件监听器
    window.addEventListener('touchstart', (event) => {
        // 获取触摸的第一个触点（通常是单指触摸）
        const touch = event.touches[0]
        // 记录触摸开始时的垂直坐标
        startY = touch.clientY
        gsapDuration = 0
    })

    // 添加触摸移动事件监听器
    window.addEventListener('touchmove', (event) => {
        // 获取触摸的第一个触点
        const touch = event.touches[0]
        // 计算垂直滑动距离
        const deltaY = touch.clientY - startY
        // 在控制台中打印滑动距离
        console.log(`垂直滑动距离: ${deltaY}px`)
        // 在这里您可以执行滑动相关的操作
        scrollChange(-deltaY / 10)
    })

    // 添加触摸结束事件监听器
    window.addEventListener('touchend', () => {
        // 清除起始坐标
        startY = 0
    })

    // 淡入模型
    function fadeInModel(yValue: number) {
      const progress = getOpacity(yValue, timeline1 + 1, timeline1 + timeline2)
      const colorLength = Math.ceil(progress * originColor.length)
      const lineLength = Math.ceil(progress * originLine.length)
      const newColorArr = colorLength === 0 ? [] : originColor.slice(-colorLength)
      const newLineArr = lineLength === 0 ? [] : originLine.slice(-lineLength)
      // console.log(newColorArr, newLineArr)
      model.traverse((child: any) => {
        if (child.isMesh) {
          if (newColorArr.includes(child.id)) {
            child.material.color.set(originColorMap[child.id])
          } else {
            child.material.color.set(0x888888)
          }
        } else if (child.isLineSegments) {
          if (newLineArr.includes(child.id)) {
            child.material.opacity = progress
            child.material.transparent = true
          } else {
            child.material.opacity = 0
            child.material.transparent = true
          }
        }
      })
    }

    // 使用GSAP创建动画
    function updateCameraY(yValue: number, rValue: number) {
      gsap.to(scene.rotation, { duration: gsapDuration, y: rValue, ease: "power1.inOut" })
      gsap.to(model.position, { duration: gsapDuration, y: Math.min(timeline1 - originY, yValue - originY), ease: "power1.inOut" })
      if (yValue >= timeline1) {
        fadeInModel(yValue)
        const realScale = originScale * (1 - ((yValue - timeline1) / (timeline2 * 1.5)))
        gsap.to(model.scale, { duration: gsapDuration, x: realScale, y: realScale, z: realScale, ease: "power1.inOut" })
      } else {
        gsap.to(model.scale, { duration: gsapDuration, x: originScale, y: originScale, z: originScale, ease: "power1.inOut" })
      }
      // 根据 y 值展示不同的文本
      if (yValue === 0) {
        gsap.to('#svg', { duration: 0.3, opacity: 0 })
      }
      gsap.to('.container2', { duration: gsapDuration, opacity: getOpacity2(yValue, 0, 0.3) })
      gsap.to(text1, { duration: gsapDuration, opacity: getOpacity2(yValue, 0, 3) })
      gsap.to(text2, { duration: gsapDuration, opacity: getOpacity(yValue, 4, 6) })
      gsap.to(text3, { duration: gsapDuration, opacity: getOpacity(yValue, timeline1 + timeline2 - 1.5, timeline1 + timeline2) })
    }
    // 创建流星数组
    let meteors: LooseObject[] = []

    // 创建流星的函数
    function createMeteor() {
        // 创建流星的材质
        let meteorMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 2, // 流星的大小
            transparent: true,
            opacity: 1
        })
        // 创建流星的几何体
        let meteorGeometry = new THREE.BufferGeometry()
        // 随机生成流星的位置
        let x = Math.random() * 20 - 10
        let y = Math.random() * 20 - 10
        let z = Math.random() * 10 - 5

        // 流星的轨迹，通常是一条直线
        let positions = new Float32Array([x, y, z, x - 1, y - 1, z - 1])

        meteorGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        // 创建流星对象
        let meteor = new THREE.Points(meteorGeometry, meteorMaterial)

        // 将流星对象添加到场景中
        scene.add(meteor)

        // 将流星对象添加到数组中
        meteors.push(meteor)
    }

    // 创建多个流星
    let meteorCount = 10
    for (let i = 0; i < meteorCount; i++) {
        createMeteor()
    }

    // 播放动画
    function animate() {
      requestAnimationFrame(animate)

      // 将相机的位置与鼠标位置关联
      camera.position.x += (mouseX - camera.position.x) * 0.05
      camera.position.y += (-mouseY - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      // 在这里更新光源的方向
      const lightDirection = new THREE.Vector3(3, 3, 3) // 光源初始方向
      lightDirection.applyEuler(scene.rotation) // 将光源方向应用于场景的旋转
      directionalLight.position.copy(lightDirection) // 设置光源的位置

      // 更新流星的位置
      for (let i = 0; i < meteors.length; i++) {
          let meteor = meteors[i]
          if (meteor.position.x < -10) {
              // 如果流星移出视野，将其移除并重新生成
              meteor.geometry.attributes.position.array = []
              createMeteor()
              scene.remove(meteor) // 从场景中移除旧的流星
              meteors.splice(i, 1) // 从数组中移除旧的流星
          } else {
              // 向左移动流星
              meteor.position.x -= 0.02
          }
      }

      // 使粒子闪烁
      particles.rotation.x += 0.001
      particles.rotation.y += 0.001
      renderer.render(scene, camera)
      TWEEN.update()
      // controls.update();
      // renderer.render( scene, camera2 );
    }
    animate()
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
