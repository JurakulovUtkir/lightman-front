import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProjectSocialContext } from '../context'
import { ProjectSocialSchema } from '../data/schema'

const PaymentStatus = ({
  isPaid,
  item,
}: {
  isPaid: boolean
  item: ProjectSocialSchema
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
    <Badge variant='success'>Paid</Badge>
  ) : (
    <Button variant='destructive' size='sm' onClick={hadleClick}>
      Unpaid
    </Button>
  )
}

export default PaymentStatus
