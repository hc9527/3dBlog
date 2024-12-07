import axios, { AxiosStatic } from 'axios'
import setConfig from '@/plugins/axios/axios.setConfig'
import handleResponse from "@/plugins/axios/axios.handleResponse"
import handleError from "@/plugins/axios/axios.handleError"
import qs from 'qs'
import { useAppStore } from "@/store/app"

const getAxiosConfigKey = (config: any): string => {
	return `${config?.url}_${config?.method}_${JSON.stringify(config?.data || config?.params)}`
}
const showTip = (tip: string) => {
	console.log(tip)
}
/**
 * intactRequest是只在axios基础上更改了请求配置。
 * 而request是基于axios创建的实例，实例只有常见的数据请求方法，没有axios.isCancel/ axios.CancelToken等方法，
 * 也就是没有**取消请求**和**批量请求**的方法。
 * 所以如果需要在实例中调用取消某个请求的方法（例如取消上传），请用intactRequest。
 */
const intactRequest = setConfig(axios) as AxiosStatic
const axiosInstance = setConfig(intactRequest.create({
	paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
}))

class Request {
	[key: string]: any;
	// 请求中的api
	private pendingPool = new Map()
	config: any
	cancelMap: LooseObject = {}

	requestInterceptorId = axiosInstance.interceptors.request.use(
		(config: any) => {
			// 对于异常的响应也需要在pendingPool中将其删除，但响应拦截器中的异常响应有些获取不到请求信息，这里将其保存在实例上
			this.config = Object.assign({}, config)
			const axiosConfigKey = getAxiosConfigKey(config)
			if (!config.global && this.pendingPool.has(axiosConfigKey)) {
				this.cancelMap[axiosConfigKey](`${config.url}请求重复`)
			}
			config.cancelToken = new axios.CancelToken((cancelFn) => {
				this.cancelMap[axiosConfigKey] = cancelFn
				this.pendingPool.set(axiosConfigKey, { cancelFn, global: config.global })
			})
			config.headers['Content-Type'] = 'application/json; charset=UTF-8'
			const appStore = useAppStore()
			const TOKEN = appStore.token

			TOKEN && (config.headers['token'] = TOKEN)
			return config
		},
		(err) => {
			// 对请求错误做些什么
			return Promise.reject(err)
		}
	)
	responseInterceptorId = axiosInstance.interceptors.response.use(
		(response) => {
			const { config } = response
			this.pendingPool.delete(getAxiosConfigKey(config))
			return Promise.resolve(handleResponse(response))
		},
		// 对异常响应处理
		(err) => {
			const { config } = err
			this.pendingPool.delete(getAxiosConfigKey(config))
			if (!err) return Promise.reject(err)
			if (err.response) {
				err = handleError(err)
			} else {
				// 没有response(没有状态码)的情况
				// eg: 超时；断网；请求重复被取消；主动取消请求；
				// 错误信息err传入isCancel方法，可以判断请求是否被取消
				// eslint-disable-next-line no-lonely-if
				if (axios.isCancel(err)) {
					throw new axios.Cancel(
						err.message || `请求'${this.config.url}'被取消`
					)
				} else if (err.stack && err.stack.includes("timeout")) {
					err.message = "请求超时!"
				} else {
					err.message = "连接服务器失败!"
				}
			}
			showTip(err.message)
			return Promise.reject(err)
		}
	)
	constructor() { }
	removeRequestInterceptor = () => {
		axiosInstance.interceptors.request.eject(this.requestInterceptorId)
	}
	removeResponseInterceptor = () => {
		axiosInstance.interceptors.response.eject(this.responseInterceptorId)
	}
	/**
	 * 清除所有pending状态的请求
	 * 返回值 被取消了的api请求
	 */
	clearPendingPool = () => {
		if (!this.pendingPool.size) return []

		const pendingUrlList = Array.from(this.pendingPool.keys())
		if (!pendingUrlList.length) return []

		pendingUrlList.forEach((pendingUrl) => {
			// 清除掉所有非全局的pending状态下的请求
			if (!this.pendingPool.get(pendingUrl).global) {
				this.pendingPool.get(pendingUrl).cancelFn()
				this.pendingPool.delete(pendingUrl)
			}
		})
		return pendingUrlList
	}

}

const request = Object.assign(axiosInstance, new Request())
export { intactRequest, request }
