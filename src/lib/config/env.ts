export const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_URL as string | undefined;
  const result = baseUrl ?? 'http://localhost:3000';
  console.log('API Base URL:', result);
  return result;
}