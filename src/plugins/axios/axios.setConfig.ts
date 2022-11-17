
import type { AxiosInstance, AxiosStatic, AxiosRequestConfig } from 'axios'
/**
 * @param {axios} axios实例
 * @param {config} 自定义配置对象，可覆盖掉默认的自定义配置
 */
const baseURL = process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:3344' : '/api'
export default (axios: AxiosStatic | AxiosInstance, config?: AxiosRequestConfig) => {

    const defaultConfig = {
        baseURL,
        timeout: 60000,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    }

    Object.assign(axios.defaults, defaultConfig, config)
    return axios
}
