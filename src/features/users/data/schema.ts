import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('web-user'),
  z.literal('active'),
  z.literal('inactive'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('user'),
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('manager'),
])

const userSchema = z.object({
  chat_id: z.any().optional().nullable(),
  created_at: z.string(),
  full_name: z.string(),
  id: z.string(),
  is_verified: z.boolean(),
  password: z.string(),
  phone_number: z.string(),
  role: userRoleSchema,
  status: userStatusSchema,
})

export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
