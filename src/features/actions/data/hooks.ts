import { useQuery } from '@tanstack/react-query'
import { getActions } from './api'

export const useActions = ({
  tag,
  success,
  user_id,
  from,
  to,
}: {
  tag?: number
  success?: boolean
  user_id?: string
  from?: string
  to?: string
}) => {
  return useQuery({
    queryKey: ['actions', tag, success, user_id, from, to],
    queryFn: () =>
      getActions({
        tag,
        success,
        user_id,
        from,
        to,
      }),
  })
}
