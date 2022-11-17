import { AxiosError } from "axios"

export default (err: AxiosError) => {
	const { response } = err

	if (!response?.status) {
		err.code = ""
		err.message = "有response但没有response.status的情况"
	}
	if (response?.data) {
		err.code = response?.status + ''
		const data = response.data as { error: string }
		err.message = data.error
		return err
	}
	err.code = response?.status + ''
	switch (response?.status) {
		case 0:
			err.message = "服务连接失败，请检查"
			break
		case 200:
			err.message = "错误响应也会有状态码为200的情况"
			break
		case 400:
			err.message = "请求错误(400)"
			break
		case 401:
			err.message = "未授权，请重新登录(401)"
			break
		case 403:
			err.message = "拒绝访问(403)"
			break
		case 404:
			err.message = "请求出错(404)"
			break
		case 408:
			err.message = "请求超时(408)"
			break
		case 500:
			err.message = "服务器错误(500)"
			break
		case 501:
			err.message = "服务未实现(501)"
			break
		case 502:
			err.message = "网络错误(502)"
			break
		case 503:
			err.message = "服务不可用(503)"
			break
		case 504:
			err.message = "网络超时(504)"
			break
		case 505:
			err.message = "HTTP版本不受支持(505)"
			break
		default:
			err.message = `连接出错，状态码：(${err.response?.status})!`
	}
	return err
}
