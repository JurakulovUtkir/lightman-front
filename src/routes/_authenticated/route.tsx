import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { getMe } from '@/features/auth/data/api'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context, location }) => {
    const accessToken = useAuthStore.getState().auth.accessToken

    if (!accessToken) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }

    const user = useAuthStore.getState().auth.user
    if (!user) {
      try {
        const response = await context.queryClient.fetchQuery({
          queryKey: ['auth', 'me'],
          queryFn: getMe,
          staleTime: Infinity,
        })

        const { password, ...userWithoutPassword } = response.data
        useAuthStore.getState().auth.setUser(userWithoutPassword)
      } catch (_error) {
        useAuthStore.getState().auth.reset()
        throw redirect({
          to: '/sign-in',
          search: {
            redirect: location.href,
          },
        })
      }
    }
  },
})
