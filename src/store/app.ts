import { defineStore } from 'pinia'
interface IStore {
	token: string
}
export const useAppStore = defineStore('app', {
	state: () => {
		return {
			token: '',
		} as IStore
	},
	// 是否对state数据做持久化
	persist: false,
	actions: {
		setToken(token: string) {
			this.token = token
		},
	},
	getters: {}
})


