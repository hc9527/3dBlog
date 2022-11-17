import request from './index'

export function login(params: ILoginParams) {
	return request<ILoginResp>({
		method: "post",
		url: "/cgtw/login",
		params,
	})
}
