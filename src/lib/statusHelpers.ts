export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft:
      'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
    active:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    on_hold:
      'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    approved:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    requested:
      'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
    done: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    canceled:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  }
  return (
    colors[status.toLowerCase()] ||
    'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  )
}
// Need to remove after translations
export const formatStatus = (status: string): string => {
  const formatted: Record<string, string> = {
    draft: 'Draft',
    active: 'Active',
    on_hold: 'On Hold',
    approved: 'Approved',
    requested: 'Requested',
    done: 'Done',
    canceled: 'Canceled',
  }
  return formatted[status.toLowerCase()] || status
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
// Need to remove after translations
export const formatPaymentStatus = (paymentStatus: string): string => {
  const formatted: Record<string, string> = {
    pending: 'Pending',
    paid: 'Paid',
    cancelled: 'Cancelled',
    unpaid: 'Unpaid',
  }
  return formatted[paymentStatus.toLowerCase()] || paymentStatus
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
// Need to remove after translations
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
    case 'deposit':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
  }
}
// Need to remove after translations
export const formatPaymentType = (paymentType: string): string => {
  switch (paymentType) {
    case 'cash':
      return 'Cash'
    case 'card':
      return 'Card'
    case 'bank_transfer':
      return 'Bank Transfer'
    case 'deposit':
      return 'Deposit'
    default:
      return paymentType
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
// Need to remove after translations
export const formatExpenceType = (type: string): string => {
  const formatted: Record<string, string> = {
    salary: 'Salary',
    avans: 'Avans',
    project: 'Project',
    deposit: 'Deposit',
    transfer: 'Transfer',
    other: 'Other',
  }
  return formatted[type.toLowerCase()] || type
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
// Need to remove after translations
export const formatExpenceOriginType = (type: string): string => {
  const formatted: Record<string, string> = {
    expence: 'Expence',
    income: 'Income',
    deposit: 'Deposit',
  }
  return formatted[type.toLowerCase()] || type
}
