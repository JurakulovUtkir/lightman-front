export const ACCESS_TOKEN = 'access_token'
export const USER_DATA = 'user_data'

export const UZ_PHONE_REGEX = /^\+998\d{9}$/

export interface ApiResponse<T> {
  message: string
  statusCode: number
  data: T
  error: string | null
}
