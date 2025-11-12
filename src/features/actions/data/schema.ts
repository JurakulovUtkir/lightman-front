import { z } from 'zod'
import { userSchema } from '@/features/users/data/schema'

export const actionSchema = z.object({
  id: z.string(),
  tag: z.string(),
  method: z.enum(['GET', 'POST', 'PATCH', 'PUT', 'DELETE']),
  path: z.string(),
  status_code: z.number(),
  success: z.boolean(),
  user_id: z.string().nullable(),
  ip: z.string(),
  error_message: z.string().optional().nullable(),
  duration_ms: z.number(),
  user_agent: z.string(),
  created_at: z.string(),
  user: userSchema.nullable(),
})

export type ActionSchema = z.infer<typeof actionSchema>
