// /src/features/auth/sign-in/data/hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { getMe, signIn, signUp } from './api'
import { SignInPayload, SignUpPayload } from './types'

export const useSignIn = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setAccessToken, setUser } = useAuthStore((state) => state.auth)

  return useMutation({
    mutationFn: (data: SignInPayload) => signIn(data),
    onSuccess: (res) => {
      setAccessToken(res?.data?.token)

      const { password, ...userWithoutPassword } = res.data.user
      setUser(userWithoutPassword)

      queryClient.removeQueries({ queryKey: ['auth'] })

      navigate({ to: '/' })
    },
  })
}
export const useSignUp = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setAccessToken } = useAuthStore((state) => state.auth)

  return useMutation({
    mutationFn: (data: SignUpPayload) => signUp(data),
    onSuccess: (res) => {
      setAccessToken(res?.data?.token)

      queryClient.removeQueries({ queryKey: ['auth'] })

      navigate({ to: '/sign-in' })
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { reset } = useAuthStore((state) => state.auth)

  return useMutation({
    mutationFn: async () => {
      // If you have a backend logout endpoint, call it here
      // await api.post('/auth/logout')

      // For now, just simulate async operation
      return Promise.resolve()
    },
    onSuccess: () => {
      reset()

      queryClient.clear()

      toast.success('Logged out successfully')

      navigate({ to: '/sign-in' })
    },
    onError: (_error) => {
      toast.error('Failed to logout. Please try again.')
    },
  })
}

export const useGetMe = () => {
  const accessToken = useAuthStore((state) => state.auth.accessToken)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled: !!accessToken,
    staleTime: Infinity,
    retry: 1,
  })
}
