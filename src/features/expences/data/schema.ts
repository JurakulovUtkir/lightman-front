import { z } from 'zod'
import {
  CorporateExpenceType,
  ExpenceType,
  PaymentType,
} from '@/constants/enums'
import { companySchema } from '@/features/companies/data/schema'
import { depositSchema } from '@/features/deposits/data/schema'
import { projectSchema } from '@/features/projects/data/schema'
import { distributionSchema } from '@/features/stakeholder/distributions/data/schema'
import { userSchema } from '@/features/users/data/schema'

export const expenceSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  expence_type: z.enum([
    ExpenceType.CHANNEL_POST,
    ExpenceType.CHANNEL_DEPOSIT_TOPUP,
    ExpenceType.CHANNEL_POST_FROM_DEPOSIT,
    ExpenceType.SALARY,
    ExpenceType.SALARY_ADVANCE,
    ExpenceType.BONUS,
    ExpenceType.LOAN_GIVEN,
    ExpenceType.LOAN_TAKEN,
    ExpenceType.LOAN_REPAYMENT,
    ExpenceType.COMPANY_TRANSFER,
    ExpenceType.CARD_WITHDRAW,
    ExpenceType.CASH_WITHDRAW,
    ExpenceType.SERVICE_EXPENCE,
    ExpenceType.CLIENT_PAYMENT,
    ExpenceType.FOUNDER_INPUT,
    ExpenceType.OTHER,
  ]),
  type: z.enum([
    CorporateExpenceType.EXPENCE,
    CorporateExpenceType.INCOME,
    CorporateExpenceType.TRANSFER,
  ]),
  distribution_id: z.string(),
  company_id: z.string(),
  user_id: z.string(),
  deposit_id: z.string(),
  payment_type: z.enum([
    PaymentType.CARD,
    PaymentType.CASH,
    PaymentType.BANK_TRANSFER,
    PaymentType.DEPOSIT,
  ]),
  amount: z.union([z.string(), z.number()]).optional(),
  description: z.string(),
  file_url: z.string(),
  created_at: z.date().optional(),
  deadline_at: z.date().optional(),
  updated_at: z.string(),
  company: companySchema,
  user: userSchema,
  project: projectSchema,
  distribution: distributionSchema,
  to_company_id: z.string().optional(),
  deposit: depositSchema,
  project_social_id: z.string().optional(),
  commission: z.number(),
})

export type ExpenceSchema = z.infer<typeof expenceSchema>
