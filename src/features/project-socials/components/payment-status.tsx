import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProjectSocialContext } from '../context'
import { ProjectSocialSchema } from '../data/schema'

const PaymentStatus = ({
  isPaid,
  item,
  t,
}: {
  isPaid: boolean
  item: ProjectSocialSchema
  t: (typeof import('@/translations/general.json'))['en']['columns']
}) => {
  const { setOpen, setCurrentRow } = useProjectSocialContext()
  const hadleClick = () => {
    if (!item.id) {
      toast.warning('Unable to find project ID')
      return
    }
    setCurrentRow(item)
    setOpen('paid')
  }
  return isPaid ? (
    <Badge variant='success' className='px-5.5'>
      {t.paid}
    </Badge>
  ) : (
    <Button variant='destructive' size='sm' onClick={hadleClick}>
      {t.unpaid}
    </Button>
  )
}

export default PaymentStatus
