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
export const getExpenceTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    salary:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    avans:
      'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
    project:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    deposit:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
    transfer:
      'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    other:
      'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
  }
  return (
    colors[type.toLowerCase()] ||
    'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  )
}
export const getExpenceOriginTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    expence:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
    income:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    deposit:
      'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  }
  return (
    colors[type.toLowerCase()] ||
    'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  )
}
