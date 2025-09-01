import axios, { AxiosError } from 'axios'
import { getApiBaseUrl } from '../config/env'

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Central error mapping – rethrow so callers can handle
    return Promise.reject(error)
  },
)
