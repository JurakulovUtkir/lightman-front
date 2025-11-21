export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    on_hold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    requested: 'bg-purple-100 text-purple-800 border-purple-200',
    done: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    canceled: 'bg-red-100 text-red-800 border-red-200',
  }
  return (
    colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
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

export const getPaymentStatusColor = (paymentStatus: string): string => {
  const colors: Record<string, string> = {
    paid: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    unpaid: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return (
    colors[paymentStatus.toLowerCase()] ||
    'bg-gray-100 text-gray-800 border-gray-200'
  )
}

export const formatPriceType = (priceType: string): string => {
  const formatted: Record<string, string> = {
    standard: 'Standard',
    vip: 'VIP',
    no_watermark: 'No Watermark',
  }
  return formatted[priceType.toLowerCase()] || priceType
}

export const getPaymentTypeColor = (paymentType: string): string => {
  switch (paymentType) {
    case 'cash':
      return 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
    case 'card':
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
    case 'bank_transfer':
      return 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300'
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  }
}

export const formatPaymentType = (paymentType: string): string => {
  switch (paymentType) {
    case 'cash':
      return 'Cash'
    case 'card':
      return 'Card'
    case 'bank_transfer':
      return 'Bank Transfer'
    default:
      return paymentType
  }
}

export const getExpenceTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    salary: 'bg-blue-100 text-blue-800 border-blue-200',
    office: 'bg-purple-100 text-purple-800 border-purple-200',
    equipment: 'bg-amber-100 text-amber-800 border-amber-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return (
    colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
  )
}

export const formatExpenceType = (type: string): string => {
  const formatted: Record<string, string> = {
    salary: 'Salary',
    office: 'Office',
    equipment: 'Equipment',
    other: 'Other',
  }
  return formatted[type.toLowerCase()] || type
}
