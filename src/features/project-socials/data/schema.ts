import { z } from 'zod'

export const projectSocialSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  social_id: z.string(),
  buy_price: z.number(),
  sell_price: z.number(),
  post_link: z.url(),
  post_views: z.number(),
  payment: z.string(),
  post_screenshot: z.string(),
  is_paid: z.boolean(),
  updated_at: z.string(),
  created_at: z.string(),
})
export type ProjectSocialSchema = z.infer<typeof projectSocialSchema>
