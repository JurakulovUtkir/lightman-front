import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getCards, getCard, createCard, updateCard, deleteCard } from './api'
import { CardsSchema } from './schema'

export const useCards = ({
  limit,
  offset,
  search,
  company_id,
  card_type,
}: {
  limit?: number
  offset?: number
  search?: string
  company_id?: string
  card_type?: 'card' | 'cash'
}) => {
  return useQuery({
    queryKey: ['cards', limit, offset, search, company_id, card_type],
    queryFn: () =>
      getCards({
        limit,
        offset,
        search,
        company_id,
        card_type,
      }),
  })
}
export const useCard = (id: string) => {
  return useQuery<CardsSchema>({
    queryKey: ['card', id],
    queryFn: () => getCard(id),
  })
}

export const useCreateCard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
      toast.success('Card created successfully!')
    },
  })
}

export const useUpdateCard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CardsSchema> }) =>
      updateCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
      toast.success('Card updated successfully!')
    },
  })
}

export const useDeleteCard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
      toast.success('Card deleted successfully!')
    },
  })
}
