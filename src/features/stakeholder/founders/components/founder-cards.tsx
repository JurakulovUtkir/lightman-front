import {
  IconEdit,
  IconUserCircle,
  IconCalendar,
  IconWallet,
  IconCircleCheck,
  IconCircleX,
  IconUsers,
} from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useFounderContext } from '../context'
import { FounderSchema } from '../data/schema'

const FounderCards = ({ data }: { data: FounderSchema[] | undefined }) => {
  const { setOpen, setCurrentRow } = useFounderContext()

  const handleEdit = (e: React.MouseEvent, payload: FounderSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('uz-UZ').format(balance)
  }

  return data?.length ? (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'>
      {data.map((item) => (
        <Card
          key={item.id}
          className='group hover:border-primary/50 transition-all hover:shadow-md'
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between'>
              <Badge
                variant={item.is_active ? 'success' : 'destructive'}
                className='gap-1 text-xs'
              >
                {item.is_active ? (
                  <>
                    <IconCircleCheck className='h-3 w-3' />
                    Active
                  </>
                ) : (
                  <>
                    <IconCircleX className='h-3 w-3' />
                    Inactive
                  </>
                )}
              </Badge>
              <Button
                onClick={(e) => handleEdit(e, item)}
                size='icon'
                variant='ghost'
                className='h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <IconEdit className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='flex flex-col items-center gap-3'>
              <div className='bg-primary/10 rounded-full p-3'>
                <IconUserCircle className='text-primary h-10 w-10' />
              </div>
              <CardTitle className='line-clamp-2 text-center text-base leading-tight'>
                {item.name}
              </CardTitle>
            </div>

            <Separator />

            <div className='space-y-2'>
              <div className='bg-muted/50 flex items-center gap-2 rounded-md p-2'>
                <IconWallet className='text-muted-foreground h-4 w-4' />
                <div className='flex-1'>
                  <p className='text-muted-foreground text-xs'>Balance</p>
                  <p className='text-sm font-semibold'>
                    {formatBalance(item.balance)}{' '}
                    <span className='text-muted-foreground text-xs font-normal'>
                      UZS
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className='pt-3'>
            <div className='text-muted-foreground flex w-full items-center justify-center gap-1.5 text-xs'>
              <IconCalendar className='h-3.5 w-3.5' />
              <span>{formatToYearMonthDay(item.updated_at)}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <Card className='border-dashed'>
      <CardContent className='flex flex-col items-center justify-center py-12'>
        <IconUsers className='text-muted-foreground mb-4 h-12 w-12' />
        <CardTitle className='mb-2 text-xl'>No Founders Found</CardTitle>
        <p className='text-muted-foreground text-sm'>
          Add founders to start tracking balances
        </p>
      </CardContent>
    </Card>
  )
}

export default FounderCards
