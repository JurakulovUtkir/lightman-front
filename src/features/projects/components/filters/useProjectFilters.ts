import { useNavigate } from '@tanstack/react-router'

/**
 * Custom hook for managing expense filter handlers
 * Provides reusable filter change functions that update URL search params
 */
export const useProjectFilters = () => {
  const navigate = useNavigate()

  const handleCategoryFilterChange = (categoryId: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        category_id: categoryId || undefined,
        offset: 0,
      }),
    })
  }

  const handleStatusFilterChange = (status: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        status: status as
          | 'draft'
          | 'active'
          | 'on_hold'
          | 'approved'
          | 'requested'
          | 'done'
          | 'canceled'
          | undefined,
        offset: 0,
      }),
    })
  }
  const handleOurCompanyFilterChange = (ourCompanyId: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        our_company_id: ourCompanyId || undefined,
        offset: 0,
      }),
    })
  }
  const handleProjectManagerFilterChange = (userId: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        project_manager_id: userId || undefined,
        offset: 0,
      }),
    })
  }

  const handleCustomerCompanyFilterChange = (
    customerCompanyId: string | null
  ) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        customer_company_id: customerCompanyId || undefined,
        offset: 0,
      }),
    })
  }

  const handleDistiburionFilterChange = (distributionId: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        distribution_id: distributionId || undefined,
        offset: 0,
      }),
    })
  }

  const handlePriceTypeFilterChange = (priceType: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        price_type: priceType as
          | 'standard'
          | 'vip'
          | 'no_watermark'
          | undefined,
        offset: 0,
      }),
    })
  }

  const handleMaxPriceFilterChange = (maxPrice: number | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        max_price: maxPrice || undefined,
        offset: 0,
      }),
    })
  }

  const handleMinPriceFilterChange = (minPrice: number | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        min_price: minPrice || undefined,
        offset: 0,
      }),
    })
  }

  const handleClear = () => {
    handleCategoryFilterChange(null)
    handleStatusFilterChange(null)
    handleOurCompanyFilterChange(null)
    handleCustomerCompanyFilterChange(null)
    handleDistiburionFilterChange(null)
    handlePriceTypeFilterChange(null)
    handleMaxPriceFilterChange(null)
    handleMinPriceFilterChange(null)
    handleProjectManagerFilterChange(null)
  }

  return {
    handleCategoryFilterChange,
    handleStatusFilterChange,
    handleOurCompanyFilterChange,
    handleDistiburionFilterChange,
    handleCustomerCompanyFilterChange,
    handlePriceTypeFilterChange,
    handleMaxPriceFilterChange,
    handleMinPriceFilterChange,
    handleClear,
    handleProjectManagerFilterChange,
  }
}
