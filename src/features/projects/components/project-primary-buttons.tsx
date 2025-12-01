import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useProjectContext } from '../context'

export function ProjectPrimaryButtons({ text }: { text: string }) {
  const { setOpen } = useProjectContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{text}</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
