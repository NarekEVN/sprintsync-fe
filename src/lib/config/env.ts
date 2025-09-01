export const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_URL as string | undefined
  return baseUrl ?? 'http://localhost:3000'
}
