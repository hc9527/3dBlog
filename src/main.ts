import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import "@/styles/index.scss"
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
