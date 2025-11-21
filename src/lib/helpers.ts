import { toast } from 'sonner'

export const toNumber = (
  value: string | number | undefined
): number | undefined => {
  if (value === undefined || value === null) return undefined
  return typeof value === 'string' ? parseFloat(value) : value
}

export const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  } catch (_error) {
    toast.error('Failed to download file!')
  }
}
