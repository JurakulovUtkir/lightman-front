import { z } from 'zod'
import { networkSocialSchema } from '@/features/network/socials/data/schema'

export const projectSocialSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  social_id: z.string(),
  buy_price: z.number(),
  sell_price: z.number(),
  post_link: z.url().optional().nullable(),
  post_views: z.number().optional().nullable(),
  payment: z.string().optional().nullable(),
  post_screenshot: z.string().optional().nullable(),
  is_paid: z.boolean(),
  updated_at: z.string(),
  created_at: z.string(),
  social: networkSocialSchema,
})
export type ProjectSocialSchema = z.infer<typeof projectSocialSchema>
