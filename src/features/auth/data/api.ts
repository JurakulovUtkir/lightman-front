import api from '@/lib/axios'
import {
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
  GetMeResponse,
} from './types'

export const signIn = async (data: SignInPayload): Promise<SignInResponse> => {
  const res = await api.post('/auth/login', data)
  return res.data
}
export const signUp = async (data: SignUpPayload): Promise<SignUpResponse> => {
  const res = await api.post('/auth/register', data)
  return res.data
}

export const getMe = async (): Promise<GetMeResponse> => {
  const res = await api.get('/users/me') // adjust endpoint as needed
  return res.data
}
