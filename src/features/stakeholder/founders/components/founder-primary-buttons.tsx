import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useFounderContext } from '../context'

export function FounderPrimaryButtons({ text }: { text: string }) {
  const { setOpen } = useFounderContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{text}</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
