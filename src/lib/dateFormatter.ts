export function formatDateToLongString(
  isoInput: string | Date | null | undefined
): string {
  if (!isoInput) return '-'

  const date = typeof isoInput === 'string' ? new Date(isoInput) : isoInput

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatToYearMonthDay(dateInput: Date | string): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatDateToString(
  isoInput: string | Date | null | undefined
): string {
  if (!isoInput) return '-'

  const date = typeof isoInput === 'string' ? new Date(isoInput) : isoInput

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  return date.toLocaleString('en-US', options)
}
