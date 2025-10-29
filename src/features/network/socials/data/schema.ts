import { z } from 'zod'

export const networkSocialSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.url(),
  social_network_type_id: z.string(),
  category_id: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),

  buy_price: z.union([z.string(), z.number()]).optional(),
  standard_sell_price: z.union([z.string(), z.number()]).optional(),
  vip_sell_price: z.union([z.string(), z.number()]).optional(),
  no_watermark_sell_price: z.union([z.string(), z.number()]).optional(),
  balance: z.union([z.string(), z.number()]).optional(),
  subscriber_count: z.number().optional(),
  average_view_count: z.number().optional(),
  contact_info: z.string().optional().nullable(),
})
export type NetworkSocialSchema = z.infer<typeof networkSocialSchema>
