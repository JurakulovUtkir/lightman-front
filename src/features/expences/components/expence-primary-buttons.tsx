import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useExpenceContext } from '../context'

export function ExpencePrimaryButtons({ text }: { text: string }) {
  const { setOpen } = useExpenceContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{text}</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
