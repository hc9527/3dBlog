import { AxiosResponse } from 'axios'

// 处理响应错误码
export default (response: AxiosResponse) => {
	const status = response.status
	// 如果http响应状态码response.status正常，则直接返回数据
	if ((status >= 200 && status <= 300) || status === 304) {
		return response
	}
	// status不正常的话，根据与后端约定好的code，做出对应的提示与处理
	// 返回一个带有code和message属性的对象

		const code = parseInt(response.status && response.data && response.data.code)
		// msg为服务端返回的错误信息，字段名自定义，此处以msg为例
		let message = (response.data || {}).reason

		switch (code) {
			case 400:
				break
			case 401:
				message = message || '登录设备数量超出限制'
				// store.commit('savehttpResult', { res: response.data })
				break
			case 403:
				message = message || '未登录'
				break
			case 404:
				message = message || '请求地址错误'
				break
			case 412:
				message = message || '未找到有效session'
				break
			default:
				// message = message || err.response.data.msg
				break
		}
		return {
			code,
			message
		}

}
