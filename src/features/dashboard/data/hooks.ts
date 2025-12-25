import { useQuery } from '@tanstack/react-query'
import { getBalance, getProjects } from './api'

export const useGetBalance = () => {
  return useQuery({
    queryKey: ['get-balance'],
    queryFn: () => getBalance(),
  })
}
export const useGetProjects = (status: string) => {
  return useQuery({
    queryKey: ['get-projects', status],
    queryFn: () => getProjects(status),
  })
}
