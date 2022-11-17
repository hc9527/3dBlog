
import { request } from '@/plugins/axios/index'
import { AxiosRequestConfig } from 'axios'

export default <T = any>(config: AxiosRequestConfig, instanceConf = {}) => {
	let { method = '', url, params = '' } = config
	method = method.toUpperCase()
	const keyName = ['PUT', 'POST', 'PATCH'].includes(method) ? 'data' : 'params'
	config = {
		method,
		url,
		[keyName]: params
	}
	return request(Object.assign(config || {}, instanceConf)).then((res) => {
		return res.data as T
	})
}
