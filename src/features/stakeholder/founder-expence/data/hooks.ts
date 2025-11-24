import { useQuery } from '@tanstack/react-query'
import { getFounderExpence } from './api'

export const useFounderExpence = ({
  id,
  limit,
  offset,
  search,
}: {
  id: string
  limit?: number
  offset?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['founder-expence', id, limit, offset, search],
    queryFn: () =>
      getFounderExpence({
        id,
        limit,
        offset,
        search,
      }),
    enabled: !!id,
  })
}
