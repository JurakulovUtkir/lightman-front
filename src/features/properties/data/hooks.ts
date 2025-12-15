import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from './api'
import { PropertySchema } from './schema'

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => getProperties(),
  })
}
export const useProperty = (id: string) => {
  return useQuery<PropertySchema>({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
  })
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property created successfully!')
    },
  })
}

export const useUpdateProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PropertySchema> }) =>
      updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property updated successfully!')
    },
  })
}

export const useDeleteProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property deleted successfully!')
    },
  })
}
