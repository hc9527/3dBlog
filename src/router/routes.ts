import { RouteRecordRaw } from "vue-router"
import { vueRouters } from "@/plugins/auto-register"

// 路由规则，自动生成路由，但是默认路由‘/’需额外配置
const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: () => import("../views/home/index.vue"),
		meta: {
			layout: "MainLayout",
		},
	},
	...vueRouters(),
]
export default routes
