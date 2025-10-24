// /src/features/auth/sign-in/data/types.ts
import { z } from 'zod'

export const signInSchema = z.object({
  phone_number: z.string(),
  password: z.string().min(6),
  is_application: z.boolean().optional(),
})
export type SignInPayload = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  full_name: z.string(),
  phone_number: z.string(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  role: z.string().optional(),
})
export type SignUpPayload = z.infer<typeof signUpSchema>

export type UserType = {
  id: string
  full_name: string
  chat_id: number | null
  phone_number: string
  status: 'web-user'
  password?: string
  role: 'user'
  created_at: string
  is_verified: boolean
  avatar?: string
}

export interface SignInResponse {
  message: string
  statusCode: number
  data: {
    user: UserType
    token: string
  }
  error: null
}
export interface SignUpResponse {
  message: string
  statusCode: number
  data: {
    user: Partial<UserType>
    token: string
  }
  error: null
}

export interface GetMeResponse {
  message: string
  statusCode: number
  data: UserType
  error: null
}
