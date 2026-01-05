export function formatToYearMonthDay(dateInput: Date | string): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0')

  return `${day}.${month}.${year}`
}

export function formatDateToCustomString(isoDate: string): string {
  const date = new Date(isoDate)

  // Get date components
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  // Get time components
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  // const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${day}-${month}-${year} ${hours}:${minutes}`
}
