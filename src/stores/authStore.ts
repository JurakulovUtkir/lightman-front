// /src/stores/authStore.ts
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { create } from 'zustand'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_DATA = 'user_data'

interface AuthUser {
  id: string
  full_name: string
  chat_id: number | null
  phone_number: string
  status: 'web-user'
  role: 'user'
  created_at: string
  is_verified: boolean
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

const safeParseCookie = <T>(
  cookieValue: string | undefined,
  defaultValue: T
): T => {
  if (!cookieValue || cookieValue === 'undefined' || cookieValue === 'null') {
    return defaultValue
  }

  try {
    return JSON.parse(cookieValue)
  } catch (_error) {
    toast.error('Error parsing cookie!')
    return defaultValue
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const userDataState = Cookies.get(USER_DATA)

  const initToken = safeParseCookie(cookieState, '')
  const initUser = safeParseCookie<AuthUser | null>(userDataState, null)

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            Cookies.set(USER_DATA, JSON.stringify(user))
          } else {
            Cookies.remove(USER_DATA)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          if (accessToken) {
            Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          } else {
            Cookies.remove(ACCESS_TOKEN)
          }
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          Cookies.remove(USER_DATA)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

export const useAuth = () => useAuthStore((state) => state.auth)
