import { useLang } from '@/hooks/useLang'

export function FormatDateToLongString({
  dateString,
}: {
  dateString: string | Date | null | undefined
}) {
  const { lang, general } = useLang()

  if (!dateString) return '-'

  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  const monthNames = general[lang].months

  return `${monthNames[month]} ${day}, ${year}`
}
