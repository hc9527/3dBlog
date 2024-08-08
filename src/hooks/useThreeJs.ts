import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import gsap from "gsap"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { getOpacity, getOpacityCenter, getOpacityReverse } from '@/utils/index'
import { useWindowListener } from './useWindowListener'

export default function useThreeJs() {
	const width = window.innerWidth
  const height = window.innerHeight
	const scene = new THREE.Scene()
	const renderer = new THREE.WebGLRenderer({
		antialias: true, // 抗锯齿
		alpha: true
	})
	const loader = new GLTFLoader()
	const clock = new THREE.Clock()
	const timeline1 = 6 // 时间线1
	const timeline2 = 3.5 // 时间线2
	const isBottom = ref(false)

	let model: any, camera: any, directionalLight: any
	let originY = 0 // 模型垂直方向初始偏移量
	let originScale = 0 // 模型初始缩放大小
	let yValue = 0 // 模型y轴偏移量
	let rValue = 0 // 模型转动偏移量
	let loading = true // 是否在加载模型
	let gsapDuration = 0.3 // gsap动画过渡时长
	let actions: any[] = [] // 所有的动画数组
	let gui: any = {} // 动画控制
	let mixer: any = null // AnimationMixer 对象
	let currentActionIndex = 0 // 当前动画下标
	let idleActionIndex = 0 // 当前动画下标
	let mouseX = 0, mouseY = 0 // 鼠标移动便宜

	const initCanvas = (id: string) => {
		renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.getElementById(id)?.appendChild(renderer.domElement)
	}

	// 创建解析器
	const initDracoLoader = () => {
		const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    loader.setDRACOLoader(dracoLoader)
	}

	// 创建相机
	const initCamera = () => {
		// 创建正交相机
		const scale = 500
    camera = new THREE.OrthographicCamera(-width / scale, width / scale, height / scale, -height / scale, 1, 10)
    camera.position.set(0, 0, 5)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    const cameraPerspectiveHelper = new THREE.CameraHelper(camera)
    cameraPerspectiveHelper.visible = false
    scene.add(cameraPerspectiveHelper)
		// 创建相机2
    // const camera2 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100)
    // camera2.position.z = 15
    // const controls = new OrbitControls(camera2, renderer.domElement)
	}

	// 加载glb模型
	const loadModel = (config: {
		path: string
		scale: number
		translateY: number
		callback?: any
	}) => {
		const { path, scale, translateY, callback } = config
		loader.load(path, (gltf: any) => {
			model = gltf.scene
			originScale = width < 768 ? scale * 0.83 : scale
			originY = width < 768 ? translateY * 0.94 : translateY
			model.scale.set(originScale, originScale, originScale)
			model.position.set(width < 768 ? 0.2 : 1, originY, 0)

			// 过滤模型的静态动画
			const animations = gltf.animations.filter((item: any) => !item.name.includes('Static'))
			// console.log(animations)
			mixer = new THREE.AnimationMixer(model.children[0])
			for (let i = 0; i < animations.length; i++) {
				actions[i] = mixer.clipAction(animations[i])
			}
			gui['action'] = function (s: number) {
				mixer.removeEventListener('loop', playNext)
				for (let j = 0; j < actions.length; j++) {
					if (j === s) {
						actions[j].play()
					} else {
						actions[j].stop()
					}
				}
			}
			const idleIndex = animations.findIndex((item: any) => item.name === 'Idle')
			if (idleIndex !== -1) {
				idleActionIndex = idleIndex
				currentActionIndex = idleIndex
				gui['action'](idleActionIndex)
			}
			scene.add(model)
			loading = false
			if (callback) {
				callback()
			}
		})
	}

	const playNext = () => {
		// console.log(currentActionIndex)
		currentActionIndex++
		currentActionIndex = currentActionIndex % actions.length
		playNextAnimation(currentActionIndex)
	}

	// 创建一个方法播放动画数组中的动画
	const playNextAnimation = (index: number) => {
		for (let j = 0; j < actions.length; j++) {
			actions[j].stop()
		}
		// 创建一个动画操作并播放
		const action = actions[index]
		action.loop = THREE.LoopRepeat
		action.clampWhenFinished = true
		mixer.removeEventListener('loop', playNext)
		mixer.addEventListener('loop', playNext)
		action.play() // 播放动画
	}

	// 创建星光粒子

	// 创建灯光
	const initLight = () => {
		// 创建球行光
    const ambientLight = new THREE.HemisphereLight("white", "darkslategrey", 0.6)
    scene.add(ambientLight)

    // 创建直射光源
    const directionalLight = new THREE.DirectionalLight(0xf7f7f7, 0.4)
    // 设置光源位置
    directionalLight.position.set(3, 3, 3)
    scene.add(directionalLight)
    const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
    lightHelper.visible = false
    scene.add(lightHelper)
	}

	// 鼠标滚动时更新模型
	const updateCameraByScroll = (yValue = 0, rValue = 0) => {
		gsap.to(scene.rotation, { duration: gsapDuration, y: rValue, ease: "power1.inOut" })
		gsap.to(model.position, { duration: gsapDuration, y: Math.min(timeline1 + originY, yValue + originY), ease: "power1.inOut" })
		if (yValue >= timeline1) {
			const realScale = originScale * (1 - ((yValue - timeline1) / (timeline2 * 1.5)))
			gsap.to(model.scale, { duration: gsapDuration, x: realScale, y: realScale, z: realScale, ease: "power1.inOut" })
		} else {
			gsap.to(model.scale, { duration: gsapDuration, x: originScale, y: originScale, z: originScale, ease: "power1.inOut" })
		}
		if (rValue !== 6.6) {
			if (currentActionIndex !== idleActionIndex) {
				currentActionIndex = idleActionIndex
				gui['action'](currentActionIndex)
				isBottom.value = false
			}
		} else if (currentActionIndex === idleActionIndex) {
			currentActionIndex = idleActionIndex + 1
			playNextAnimation(currentActionIndex)
			isBottom.value = true
		}
		// 根据 y 值展示不同的文本
		if (yValue === 0) {
			gsap.to('#svg', { duration: 0.3, opacity: 0 })
		}
		gsap.to('.container2', { duration: gsapDuration, opacity: getOpacityReverse(yValue, 0, 0.3) })
		gsap.to('#text1', { duration: gsapDuration, opacity: getOpacityReverse(yValue, 0, 3) })
		gsap.to('#text2', { duration: gsapDuration, opacity: getOpacityCenter(yValue, 3.5, 7.5) })
		gsap.to('#text3', { duration: gsapDuration, opacity: getOpacity(yValue, timeline1 + timeline2 - 1.5, timeline1 + timeline2) })
	}
	const scrollChange = (deltaY: number) => {
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
		updateCameraByScroll(yValue, rValue)
	}

	// 兼容移动端滚动
	const watchTouchToScroll = () => {
		// 定义变量来跟踪触摸开始时的坐标
		let startY: number

		// 添加触摸开始事件监听器
		useWindowListener('touchstart', (event: any) => {
			// 这里会导致移动端click失效
			event.preventDefault()
			// 获取触摸的第一个触点（通常是单指触摸）
			const touch = event.touches[0]
			// 记录触摸开始时的垂直坐标
			startY = touch.clientY
			gsapDuration = 0
		}, { passive: false })

		// 添加触摸移动事件监听器
		useWindowListener('touchmove', (event) => {
			// 获取触摸的第一个触点
			const touch = event.touches[0]
			// 计算垂直滑动距离
			const deltaY = touch.clientY - startY
			// 在控制台中打印滑动距离
			// console.log(`垂直滑动距离: ${deltaY}px`)
			// 在这里您可以执行滑动相关的操作
			scrollChange(-deltaY / 10)
		})

		// 添加触摸结束事件监听器
		useWindowListener('touchend', () => {
			// 清除起始坐标
			startY = 0
		})
	}

	// 监听鼠标移动，镜头晃动
	const watchMouseMove = () => {
		useWindowListener('mousemove', function(event) {
			mouseX = (event.clientX / window.innerWidth) * 2 - 1
			mouseY = - (event.clientY / window.innerHeight) * 2 + 1
		})
	}


	// 监听鼠标滚轮事件更新
	const watchMouseWheel = () => {
		useWindowListener('wheel', function(event) {
			scrollChange(event.deltaY)
		})
	}

	useWindowListener('resize', () => {
		const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
	})

	// 渲染画布
	const render = () => {
		requestAnimationFrame(render)
		if (!camera) {
			return
		}

		// 将相机的位置与鼠标位置关联
		camera.position.x += (mouseX - camera.position.x) * 0.05
		camera.position.y += (-mouseY - camera.position.y) * 0.05
		camera.lookAt(scene.position)

		// 在这里更新光源的方向
		if (directionalLight) {
			const lightDirection = new THREE.Vector3(3, 3, 3) // 光源初始方向
			lightDirection.applyEuler(scene.rotation) // 将光源方向应用于场景的旋转
			directionalLight.position.copy(lightDirection) // 设置光源的位置
		}

		// 更新动画
		const time = clock.getDelta()
		if (mixer) {
			mixer.update(time)
		}

		renderer.render(scene, camera)
		TWEEN.update()
		// controls.update();
		// renderer.render( scene, camera2 );
	}

	return {
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
		isBottom
	}
}
