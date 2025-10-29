import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'
import { routeTree } from './routeTree.gen'

// Shared error handler for both queries and mutations
const handleAxiosError = (error: AxiosError, isQuery = false) => {
  const status = error.response?.status
  const message =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    error.response?.data?.detail ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    error.response?.data?.message ||
    error.message

  switch (status) {
    case 400:
      toast.error(
        message || 'Bad request. Please check your input and try again.'
      )
      break

    case 401:
      toast.error('Session expired! Please sign in again.')
      useAuthStore.getState().auth.reset()
      router.navigate({ to: '/sign-in' })
      break

    case 403:
      toast.error(message || "You don't have permission to perform this action")
      break

    case 404:
      toast.error(message || 'The requested resource was not found')
      break

    case 405:
      toast.error(message || 'This action is not allowed')
      break

    case 409:
      toast.error(message || 'A conflict occurred')
      break

    case 422:
      toast.error(message || 'Validation error occurred')
      break

    case 500:
      toast.error('Internal server error. Please try again later.')
      if (isQuery) {
        router.navigate({ to: '/500' })
      }
      break

    case 503:
      toast.error('Service temporarily unavailable. Please try again later.')
      break

    default:
      // Network errors or other unknown errors
      if (!error.response) {
        toast.error(
          'Unable to reach the server. Please check your connection and try again.',
          {
            duration: 5000,
            closeButton: true,
          }
        )
      } else {
        toast.error(
          message || 'An unexpected error occurred. Please try again.',
          {
            closeButton: true,
          }
        )
      }
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry in development after first failure for faster debugging
        if (import.meta.env.DEV && failureCount >= 1) return false

        // Don't retry more than 3 times in production
        if (import.meta.env.PROD && failureCount > 3) return false

        // Don't retry on authentication/authorization errors
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if ([400, 401, 403, 409, 422].includes(status ?? 0)) return false
        }

        return true
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        if (error instanceof AxiosError) {
          handleAxiosError(error, false)
        } else {
          toast.error('Something went wrong. Please try again.', {
            closeButton: true,
          })
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      // Handle Zod validation errors
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'ZodError'
      ) {
        toast.error(
          'Data validation error. Please refresh the page and try again.'
        )
        return
      }

      if (error instanceof AxiosError) {
        handleAxiosError(error, true)
      } else if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Number((error as any).status) === 204
      ) {
        toast.error('Content not found.', { closeButton: true })
      } else {
        toast.error(
          'Something went wrong. Please refresh the page and try again.',
          {
            closeButton: true,
          }
        )
      }
    },
  }),
})

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <FontProvider>
            <RouterProvider router={router} />
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
