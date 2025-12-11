import { useNavigate } from '@tanstack/react-router'

/**
 * Custom hook for managing expense filter handlers
 * Provides reusable filter change functions that update URL search params
 */
export const useContractFilters = () => {
  const navigate = useNavigate()

  const handleOurCompanyFilterChange = (ourCompanyId: string | null) => {
    navigate({
      to: '/contracts',
      search: (prev) => ({
        ...prev,
        our_company_id: ourCompanyId || undefined,
        offset: 0,
      }),
    })
  }
  const handleCustomerCompanyFilterChange = (
    customerCompanyId: string | null
  ) => {
    navigate({
      to: '/contracts',
      search: (prev) => ({
        ...prev,
        customer_company_id: customerCompanyId || undefined,
        offset: 0,
      }),
    })
  }
  const handlePaymentStatusFilterChange = (paymentStatus: string | null) => {
    navigate({
      to: '/contracts',
      search: (prev) => ({
        ...prev,
        payment_status: paymentStatus as
          | 'PENDING'
          | 'PAID'
          | 'CANCELLED'
          | 'UNPAID'
          | undefined,
        offset: 0,
      }),
    })
  }
  const handlePaymentTypeFilterChange = (paymentType: string | null) => {
    navigate({
      to: '/contracts',
      search: (prev) => ({
        ...prev,
        payment_type: paymentType as
          | 'CARD'
          | 'BANK_TRANSFER'
          | 'CASH'
          | 'DEPOSIT'
          | undefined,
        offset: 0,
      }),
    })
  }

  const handleClear = () => {
    handleOurCompanyFilterChange(null)
    handleCustomerCompanyFilterChange(null)
    handlePaymentTypeFilterChange(null)
    handlePaymentStatusFilterChange(null)
  }

  return {
    handleOurCompanyFilterChange,
    handleCustomerCompanyFilterChange,
    handlePaymentTypeFilterChange,
    handlePaymentStatusFilterChange,
    handleClear,
  }
}
