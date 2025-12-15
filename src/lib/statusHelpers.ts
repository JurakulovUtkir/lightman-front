import { CorporateExpenceType, ExpenceType } from '@/constants/enums'

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'text-gray-700 dark:text-gray-300',
    active: 'text-green-700 dark:text-green-300',
    on_hold: 'text-orange-700 dark:text-orange-300',
    approved: 'text-blue-700 dark:text-blue-300',
    requested: 'text-yellow-600 dark:text-yellow-300',
    done: 'text-blue-700 dark:text-blue-300',
    canceled: 'text-red-700  dark:text-red-300',
    requested_to_done: 'text-green-700 dark:text-green-300',
  }
  return colors[status.toLowerCase()] || 'text-gray-700 dark:text-gray-300'
}
export const getStatusColorWithBg = (status: string): string => {
  const colors: Record<string, string> = {
    draft:
      'bg-gray-50 border-gray-200 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
    active:
      'bg-green-50 border-green-200 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    on_hold:
      'bg-orange-50 border-orange-200 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300',
    approved:
      'bg-blue-50 border-blue-200 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    requested:
      'bg-yellow-50 border-yellow-200 text-yellow-600 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    done: 'bg-blue-50 border-blue-200 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    canceled:
      'bg-red-50 border-red-200 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
    requested_to_done:
      'bg-green-50 border-green-200 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
  }
  return (
    colors[status.toLowerCase()] ||
    'bg-gray-50 border-gray-200 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  )
}
export const getPaymentStatusColor = (paymentStatus: string): string => {
  const colors: Record<string, string> = {
    paid: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    pending:
      'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    unpaid:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
    cancelled:
      'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
  }
  return (
    colors[paymentStatus.toLowerCase()] ||
    'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  )
}
export const getPriceTypeColor = (priceType: string): string => {
  const colors: Record<string, string> = {
    standard: 'bg-slate-100 text-slate-800 border-slate-200',
    vip: 'bg-amber-100 text-amber-800 border-amber-200',
    no_watermark: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  }
  return (
    colors[priceType.toLowerCase()] ||
    'bg-gray-100 text-gray-800 border-gray-200'
  )
}
export const getPaymentTypeColor = (paymentType: string): string => {
  switch (paymentType) {
    case 'CASH':
      return 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
    case 'CARD':
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
    case 'BANK_TRANSFER':
      return 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300'
    case 'DEPOSIT':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  }
}

export const getExpenceTypeColor = (type: ExpenceType | string): string => {
  const colors: Record<ExpenceType, string> = {
    [ExpenceType.CHANNEL_POST]:
      'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    [ExpenceType.CHANNEL_DEPOSIT_TOPUP]:
      'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300',
    [ExpenceType.CHANNEL_POST_FROM_DEPOSIT]:
      'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300',
    [ExpenceType.SALARY]:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    [ExpenceType.SALARY_ADVANCE]:
      'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
    [ExpenceType.BONUS]:
      'border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300',
    [ExpenceType.LOAN_GIVEN]:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
    [ExpenceType.LOAN_TAKEN]:
      'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300',
    [ExpenceType.LOAN_REPAYMENT]:
      'border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-800 dark:bg-lime-950 dark:text-lime-300',
    [ExpenceType.COMPANY_TRANSFER]:
      'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    [ExpenceType.CARD_WITHDRAW]:
      'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300',
    [ExpenceType.CASH_WITHDRAW]:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    [ExpenceType.SERVICE_EXPENCE]:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    [ExpenceType.CLIENT_PAYMENT]:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
    [ExpenceType.FOUNDER_INPUT]:
      'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    [ExpenceType.OTHER]:
      'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
  }

  return (
    colors[type as ExpenceType] ||
    'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  )
}
export const getExpenceOriginTypeColor = (
  type: CorporateExpenceType | string
): string => {
  const colors: Record<CorporateExpenceType, string> = {
    [CorporateExpenceType.EXPENCE]:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
    [CorporateExpenceType.INCOME]:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    [CorporateExpenceType.TRANSFER]:
      'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  }

  return (
    colors[type as CorporateExpenceType] ||
    'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  )
}

// Add these to your existing statusHelpers.ts file

export const getPropertyStatusColor = (
  status: 'IN_USE' | 'IN_STOCK' | 'REPAIRED' | 'WRITTEN_OFF' | 'SOLD' | 'LOST'
): string => {
  const colors = {
    IN_USE: 'border-blue-500 bg-blue-50 text-blue-700',
    IN_STOCK: 'border-green-500 bg-green-50 text-green-700',
    REPAIRED: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    WRITTEN_OFF: 'border-red-500 bg-red-50 text-red-700',
    SOLD: 'border-purple-500 bg-purple-50 text-purple-700',
    LOST: 'border-gray-500 bg-gray-50 text-gray-700',
  }
  return colors[status] || 'border-gray-300 bg-gray-50 text-gray-600'
}

export const getPropertyCategoryColor = (
  category:
    | 'BUILDING'
    | 'VEHICLE'
    | 'EQUIPMENT'
    | 'FURNITURE'
    | 'ELECTRONICS'
    | 'OTHER'
): string => {
  const colors = {
    BUILDING: 'border-amber-500 bg-amber-50 text-amber-700',
    VEHICLE: 'border-cyan-500 bg-cyan-50 text-cyan-700',
    EQUIPMENT: 'border-indigo-500 bg-indigo-50 text-indigo-700',
    FURNITURE: 'border-pink-500 bg-pink-50 text-pink-700',
    ELECTRONICS: 'border-violet-500 bg-violet-50 text-violet-700',
    OTHER: 'border-slate-500 bg-slate-50 text-slate-700',
  }
  return colors[category] || 'border-gray-300 bg-gray-50 text-gray-600'
}
