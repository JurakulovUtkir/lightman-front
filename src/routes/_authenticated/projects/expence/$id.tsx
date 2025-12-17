import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  CorporateExpenceType,
  ExpenceType,
  PaymentType,
} from '@/constants/enums'
import ProjectExpence from '@/features/project-expence'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
  type: z
    .enum([
      CorporateExpenceType.EXPENCE,
      CorporateExpenceType.INCOME,
      CorporateExpenceType.TRANSFER,
    ])
    .optional()
    .catch(undefined),
  expence_type: z
    .enum([
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
    ])
    .optional()
    .catch(undefined),
  payment_type: z
    .enum([
      PaymentType.CARD,
      PaymentType.CASH,
      PaymentType.BANK_TRANSFER,
      PaymentType.DEPOSIT,
    ])
    .optional()
    .catch(undefined),
  distribution_id: z.string().optional().catch(''),
  company_id: z.string().optional().catch(''),
  project_id: z.string().optional().catch(''),
  user_id: z.string().optional().catch(''),
  loan_id: z.string().optional().catch(''),
  card_id: z.string().optional().catch(''),
  date_from: z.string().optional().catch(''),
  date_to: z.string().optional().catch(''),
  min_amount: z.number().optional().catch(undefined),
  max_amount: z.number().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/projects/expence/$id')({
  validateSearch: (search) => searchSchema.parse(search),

  component: ProjectExpence,
  loader: async ({ params }) => {
    return {
      id: params.id,
    }
  },
})
