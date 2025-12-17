// Need to check urgent
import { useNavigate } from '@tanstack/react-router'
import {
  CorporateExpenceType,
  ExpenceType,
  PaymentType,
} from '@/constants/enums'

/**
 * Custom hook for managing expense filter handlers
 * Provides reusable filter change functions that update URL search params
 */
export const useExpenceFilters = ({
  isFounder = false,
  isProject = false,
  isCompany = false,
  isCard = false,
}: {
  isFounder?: boolean
  isProject?: boolean
  isCompany?: boolean
  isCard?: boolean
}) => {
  const navigate = useNavigate()

  const handleTypeFilterChange = (type: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        type: type as CorporateExpenceType | undefined,
        offset: 0,
      }),
    })
  }

  const handleExpenceTypeFilterChange = (expenceType: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        expence_type: expenceType as ExpenceType | undefined,
        offset: 0,
      }),
    })
  }

  const handlePaymentTypeFilterChange = (paymentType: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      search: (prev) => ({
        ...prev,
        payment_type: paymentType as PaymentType | undefined,
        offset: 0,
      }),
    })
  }

  const handleDistiburionFilterChange = (distributionId: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        distribution_id: distributionId || undefined,
        offset: 0,
      }),
    })
  }

  const handleCompanyFilterChange = (companyId: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        company_id: companyId || undefined,
        offset: 0,
      }),
    })
  }

  const handleProjectFilterChange = (projectId: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        project_id: projectId || undefined,
        offset: 0,
      }),
    })
  }

  const handleUserFilterChange = (userId: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        user_id: userId || undefined,
        offset: 0,
      }),
    })
  }

  const handleDateFromFilterChange = (dateFrom: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        date_from: dateFrom || undefined,
        offset: 0,
      }),
    })
  }

  const handleDateToFilterChange = (dateTo: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        date_to: dateTo || undefined,
        offset: 0,
      }),
    })
  }

  const handleMaxAmountFilterChange = (maxAmount: number | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        max_amount: maxAmount || undefined,
        offset: 0,
      }),
    })
  }

  const handleMinAmountFilterChange = (minAmount: number | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        min_amount: minAmount || undefined,
        offset: 0,
      }),
    })
  }

  const handleLoanFilterChange = (loanId: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        loan_id: loanId || undefined,
        offset: 0,
      }),
    })
  }
  const handleCardFilterChange = (cardId: string | null) => {
    navigate({
      to: isFounder
        ? '/stakeholder/founders/expence/$id'
        : isProject
          ? '/projects/expence/$id'
          : isCompany
            ? '/companies/expence/$id'
            : isCard
              ? '/companies/cards/expence/$id'
              : '/expences',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        card_id: cardId || undefined,
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
    handleLoanFilterChange,
    handleCardFilterChange,
    handleClear,
  }
}
