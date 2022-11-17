import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import "element-plus/dist/index.css"
import "@/styles/index.scss"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import api from "./api"
import "virtual:windi.css"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.config.globalProperties.$api = api
app.config.globalProperties.$pinia = pinia
app
	.use(router)
	.use(pinia)
	.mount("#app")

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}
