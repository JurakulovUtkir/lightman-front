import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useCardsContext } from '../context'

export function CardPrimaryButtons({ text }: { text: string }) {
  const { setOpen } = useCardsContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{text}</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
