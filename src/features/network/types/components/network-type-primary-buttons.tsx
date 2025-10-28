import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useNetworkTypeContext } from '../context'

export function NetworkTypePrimaryButtons() {
  const { setOpen } = useNetworkTypeContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
