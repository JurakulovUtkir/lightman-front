import { ApiResponse } from '@/constants'
import { User } from './schema'

export type UsersResponse = ApiResponse<User[]>
