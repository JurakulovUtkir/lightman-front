import { useState } from 'react'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { toast } from 'sonner'

interface CopyButtonProps {
  value: string
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_err) {
      toast.warning('Failed to copy')
    }
  }

  return copied ? (
    <IconCheck size={12} onClick={handleCopy} className='text-green-600' />
  ) : (
    <IconCopy size={12} onClick={handleCopy} />
  )
}
