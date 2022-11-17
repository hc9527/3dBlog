
declare const __APP_VERSION__: string
declare const defineOptions: typeof defineComponent

interface Window {
	removeLoading: () => void
	ipc: any
}

type LooseObject = {
	[key: string]: any
}