import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useContractContext } from '../context'

export function ContractPrimaryButtons({ text }: { text: string }) {
  const { setOpen } = useContractContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{text}</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
