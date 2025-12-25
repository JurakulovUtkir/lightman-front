import api from '@/lib/axios'

export const getBalance = async () => {
  const response = await api.get(`/stats/balance`)
  return response.data
}
export const getProjects = async (status: string) => {
  const response = await api.get(`/stats/projects?status=${status}`)
  return response.data
}
