export const ACCESS_TOKEN = 'access_token'
export const USER_DATA = 'user_data'

export const UZ_PHONE_REGEX = /^\+998\d{9}$/

export interface ApiResponse<T> {
  message: string
  statusCode: number
  data: T
  error: string | null
}

export const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'approved', label: 'Approved' },
  { value: 'requested', label: 'Requested' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
]
