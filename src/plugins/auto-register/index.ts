import { upperFirst } from "lodash"
import { RouteRecordRaw } from "vue-router"

function getModules() {
	const components = import.meta.glob("@/views/**/*.vue")
	return components
}
const getComponents = () => {
	const components = import.meta.glob("@/views/**/*.vue", { eager: true })
	return components
}

// 自动注册路由
export const vueRouters = function (): Array<RouteRecordRaw> {
	let routerList: Array<RouteRecordRaw> = []
	const modules = getModules()
	const components = getComponents()
	Object.keys(modules).forEach((key) => {
		const viewSrc = components[key] as any
		const file = viewSrc.default
		if (!file.isRouter) return
		routerList.push({
			path: key.replace("/src/views", "").replace("/index.vue", "").replace(".vue", ""),
			name: `${upperFirst(file.name)}`,
			component: modules[key],
			meta: {
				layout: file.layout || "MainLayout",
			},
		})
	})
	return routerList
}
