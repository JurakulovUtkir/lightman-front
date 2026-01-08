import { useQuery } from '@tanstack/react-query'
import {
  CorporateExpenceType,
  ExpenceType,
  PaymentType,
} from '@/constants/enums'
import { getExpenceDetails } from './api'

export const useExpenceDetails = ({
  id,
  limit,
  offset,
  search,
  type,
  expence_type,
  payment_type,
  distribution_id,
  company_id,
  project_id,
  user_id,
  date_from,
  date_to,
  max_amount,
  min_amount,
}: {
  id: string
  limit?: number
  offset?: number
  search?: string
  type?: CorporateExpenceType
  expence_type?: ExpenceType
  payment_type?: PaymentType
  distribution_id?: string
  company_id?: string
  project_id?: string
  user_id?: string
  date_from?: string
  date_to?: string
  max_amount?: number
  min_amount?: number
}) => {
  return useQuery({
    queryKey: [
      'expence-details',
      id,
      limit,
      offset,
      search,
      type,
      expence_type,
      payment_type,
      distribution_id,
      company_id,
      project_id,
      user_id,
      date_from,
      date_to,
      max_amount,
      min_amount,
    ],
    queryFn: () =>
      getExpenceDetails({
        id,
        limit,
        offset,
        search,
        type,
        expence_type,
        payment_type,
        distribution_id,
        company_id,
        project_id,
        user_id,
        date_from,
        date_to,
        max_amount,
        min_amount,
      }),
    enabled: !!id,
  })
}
