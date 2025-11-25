import { useNavigate } from '@tanstack/react-router'

/**
 * Custom hook for managing expense filter handlers
 * Provides reusable filter change functions that update URL search params
 */
export const useExpenceFilters = ({
  isFounder = false,
}: {
  isFounder?: boolean
}) => {
  const navigate = useNavigate()

  const handleTypeFilterChange = (type: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        type: type as 'expence' | 'income' | 'deposit' | undefined,
        offset: 0,
      }),
    })
  }

  const handleExpenceTypeFilterChange = (expenceType: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        expence_type: expenceType as
          | 'salary'
          | 'avans'
          | 'project'
          | 'deposit'
          | 'other'
          | undefined,
        offset: 0,
      }),
    })
  }

  const handlePaymentTypeFilterChange = (paymentType: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        payment_type: paymentType as 'card' | 'cash' | undefined,
        offset: 0,
      }),
    })
  }

  const handleDistiburionFilterChange = (distributionId: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        distribution_id: distributionId || undefined,
        offset: 0,
      }),
    })
  }

  const handleCompanyFilterChange = (companyId: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        company_id: companyId || undefined,
        offset: 0,
      }),
    })
  }

  const handleProjectFilterChange = (projectId: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        project_id: projectId || undefined,
        offset: 0,
      }),
    })
  }

  const handleUserFilterChange = (userId: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        user_id: userId || undefined,
        offset: 0,
      }),
    })
  }

  const handleDateFromFilterChange = (dateFrom: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        date_from: dateFrom || undefined,
        offset: 0,
      }),
    })
  }

  const handleDateToFilterChange = (dateTo: string | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        date_to: dateTo || undefined,
        offset: 0,
      }),
    })
  }

  const handleMaxAmountFilterChange = (maxAmount: number | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        max_amount: maxAmount || undefined,
        offset: 0,
      }),
    })
  }

  const handleMinAmountFilterChange = (minAmount: number | null) => {
    navigate({
      to: isFounder ? '/stakeholder/founders/expence/$id' : '/expences',
      search: (prev) => ({
        ...prev,
        min_amount: minAmount || undefined,
        offset: 0,
      }),
    })
  }

  const handleClear = () => {
    handleTypeFilterChange(null)
    handleExpenceTypeFilterChange(null)
    handlePaymentTypeFilterChange(null)
    handleDistiburionFilterChange(null)
    handleCompanyFilterChange(null)
    handleProjectFilterChange(null)
    handleUserFilterChange(null)
    handleDateFromFilterChange(null)
    handleDateToFilterChange(null)
    handleMaxAmountFilterChange(null)
    handleMinAmountFilterChange(null)
  }

  return {
    handleTypeFilterChange,
    handleExpenceTypeFilterChange,
    handlePaymentTypeFilterChange,
    handleDistiburionFilterChange,
    handleCompanyFilterChange,
    handleProjectFilterChange,
    handleUserFilterChange,
    handleDateFromFilterChange,
    handleDateToFilterChange,
    handleMaxAmountFilterChange,
    handleMinAmountFilterChange,
    handleClear,
  }
}
