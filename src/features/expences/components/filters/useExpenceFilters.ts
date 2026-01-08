import { useNavigate } from '@tanstack/react-router'
import {
  CorporateExpenceType,
  ExpenceType,
  PaymentType,
} from '@/constants/enums'

type RouteContext = {
  isFounder?: boolean
  isProject?: boolean
  isCompany?: boolean
  isCard?: boolean
  isUser?: boolean
  isExpenceDetails?: boolean
}

type FilterValue = string | number | null | undefined

/**
 * Custom hook for managing expense filter handlers
 * Provides reusable filter change functions that update URL search params
 */
export const useExpenceFilters = ({
  isFounder = false,
  isProject = false,
  isCompany = false,
  isCard = false,
  isUser = false,
  isExpenceDetails = false,
}: RouteContext = {}) => {
  const navigate = useNavigate()

  // Determine route based on context flags
  const getRoute = () => {
    if (isFounder) return '/stakeholder/founders/expence/$id'
    if (isProject) return '/projects/expence/$id'
    if (isCompany) return '/companies/expence/$id'
    if (isCard) return '/companies/cards/expence/$id'
    if (isUser) return '/users/expence/$id'
    if (isExpenceDetails) return '/expences/expence-details/$id'
    return '/expences'
  }

  // Generic filter handler that updates a single search param
  const createFilterHandler = (paramName: string) => {
    return (value: FilterValue) => {
      navigate({
        to: getRoute(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        search: (prev) => ({
          ...prev,
          [paramName]: value || undefined,
          offset: 0,
        }),
      })
    }
  }

  // Type-specific handlers with proper typing
  const handleTypeFilterChange = (type: string | null) => {
    navigate({
      to: getRoute(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        type: (type as CorporateExpenceType) || undefined,
        offset: 0,
      }),
    })
  }

  const handleExpenseTypeFilterChange = (expenseType: string | null) => {
    navigate({
      to: getRoute(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        expence_type: (expenseType as ExpenceType) || undefined,
        offset: 0,
      }),
    })
  }

  const handlePaymentTypeFilterChange = (paymentType: string | null) => {
    navigate({
      to: getRoute(),
      search: (prev) => ({
        ...prev,
        payment_type: (paymentType as PaymentType) || undefined,
        offset: 0,
      }),
    })
  }

  // Generic handlers for other filters
  const handleDistributionFilterChange = createFilterHandler('distribution_id')
  const handleCompanyFilterChange = createFilterHandler('company_id')
  const handleProjectFilterChange = createFilterHandler('project_id')
  const handleUserFilterChange = createFilterHandler('user_id')
  const handleDateFromFilterChange = createFilterHandler('date_from')
  const handleDateToFilterChange = createFilterHandler('date_to')
  const handleMaxAmountFilterChange = createFilterHandler('max_amount')
  const handleMinAmountFilterChange = createFilterHandler('min_amount')
  const handleLoanFilterChange = createFilterHandler('loan_id')
  const handleCardFilterChange = createFilterHandler('card_id')

  // Clear all filters at once
  const handleClear = () => {
    navigate({
      to: getRoute(),
      search: () => ({ offset: 0 }),
    })
  }

  return {
    handleTypeFilterChange,
    handleExpenseTypeFilterChange,
    handlePaymentTypeFilterChange,
    handleDistributionFilterChange,
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

// // Need to check urgent
// import { useNavigate } from '@tanstack/react-router'
// import {
//   CorporateExpenceType,
//   ExpenceType,
//   PaymentType,
// } from '@/constants/enums'

// /**
//  * Custom hook for managing expense filter handlers
//  * Provides reusable filter change functions that update URL search params
//  */
// export const useExpenceFilters = ({
//   isFounder = false,
//   isProject = false,
//   isCompany = false,
//   isCard = false,
//   isUser = false,
// }: {
//   isFounder?: boolean
//   isProject?: boolean
//   isCompany?: boolean
//   isCard?: boolean
//   isUser?: boolean
// }) => {
//   const navigate = useNavigate()

//   const handleTypeFilterChange = (type: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         type: type as CorporateExpenceType | undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleExpenceTypeFilterChange = (expenceType: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         expence_type: expenceType as ExpenceType | undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handlePaymentTypeFilterChange = (paymentType: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       search: (prev) => ({
//         ...prev,
//         payment_type: paymentType as PaymentType | undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleDistiburionFilterChange = (distributionId: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         distribution_id: distributionId || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleCompanyFilterChange = (companyId: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         company_id: companyId || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleProjectFilterChange = (projectId: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         project_id: projectId || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleUserFilterChange = (userId: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         user_id: userId || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleDateFromFilterChange = (dateFrom: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         date_from: dateFrom || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleDateToFilterChange = (dateTo: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         date_to: dateTo || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleMaxAmountFilterChange = (maxAmount: number | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         max_amount: maxAmount || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleMinAmountFilterChange = (minAmount: number | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         min_amount: minAmount || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleLoanFilterChange = (loanId: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         loan_id: loanId || undefined,
//         offset: 0,
//       }),
//     })
//   }
//   const handleCardFilterChange = (cardId: string | null) => {
//     navigate({
//       to: isFounder
//         ? '/stakeholder/founders/expence/$id'
//         : isProject
//           ? '/projects/expence/$id'
//           : isCompany
//             ? '/companies/expence/$id'
//             : isCard
//               ? '/companies/cards/expence/$id'
//               : isUser
//                 ? '/users/expence/$id'
//                 : '/expences',
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       search: (prev) => ({
//         ...prev,
//         card_id: cardId || undefined,
//         offset: 0,
//       }),
//     })
//   }

//   const handleClear = () => {
//     handleTypeFilterChange(null)
//     handleExpenceTypeFilterChange(null)
//     handlePaymentTypeFilterChange(null)
//     handleDistiburionFilterChange(null)
//     handleCompanyFilterChange(null)
//     handleProjectFilterChange(null)
//     handleUserFilterChange(null)
//     handleDateFromFilterChange(null)
//     handleDateToFilterChange(null)
//     handleMaxAmountFilterChange(null)
//     handleMinAmountFilterChange(null)
//     handleLoanFilterChange(null)
//     handleCardFilterChange(null)
//   }

//   return {
//     handleTypeFilterChange,
//     handleExpenceTypeFilterChange,
//     handlePaymentTypeFilterChange,
//     handleDistiburionFilterChange,
//     handleCompanyFilterChange,
//     handleProjectFilterChange,
//     handleUserFilterChange,
//     handleDateFromFilterChange,
//     handleDateToFilterChange,
//     handleMaxAmountFilterChange,
//     handleMinAmountFilterChange,
//     handleLoanFilterChange,
//     handleCardFilterChange,
//     handleClear,
//   }
// }
