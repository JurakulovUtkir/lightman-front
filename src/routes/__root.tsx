import { useEffect } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { AllowedLangs } from '@/constants'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { setLang } from '@/context/lang'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'

function RootComponent() {
  useEffect(() => {
    const lang = JSON.parse(localStorage.getItem('lang') as string)
    if (lang && ['ru', 'en', 'uz'].includes(lang)) {
      setLang(lang)
    } else {
      setLang(AllowedLangs['EN'])
    }
  }, [])

  return (
    <>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={3000} position='top-right' />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
