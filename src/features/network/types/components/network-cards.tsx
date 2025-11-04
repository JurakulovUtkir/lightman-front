import { useNavigate } from '@tanstack/react-router'
import {
  IconEdit,
  IconCalendar,
  IconNetwork,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNetworkTypeContext } from '../context'
import { NetworkTypeSchema } from '../data/schema'

const NetworkCards = ({ data }: { data: NetworkTypeSchema[] | undefined }) => {
  const navigate = useNavigate()
  const { setOpen, setCurrentRow } = useNetworkTypeContext()

  const handleEdit = (e: React.MouseEvent, payload: NetworkTypeSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  const handleCardClick = (typeId: string) => {
    navigate({
      to: '/network/socials',
      search: {
        offset: 0,
        social_network_type_id: typeId,
      },
    })
  }

  return data?.length ? (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
      {data.map((item) => (
        <Card
          key={item.id}
          className='group hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg'
          onClick={() => handleCardClick(item.id)}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <IconNetwork className='text-primary h-5 w-5' />
                <Badge
                  variant={item.is_active ? 'default' : 'secondary'}
                  className='gap-1'
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
              </div>
              <Button
                onClick={(e) => handleEdit(e, item)}
                size='icon'
                variant='ghost'
                className='h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <IconEdit className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>

          <CardContent className='space-y-3'>
            <CardTitle className='line-clamp-2 text-base leading-tight'>
              {item.name}
            </CardTitle>

            <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
              <IconCalendar className='h-3.5 w-3.5' />
              <span>{formatToYearMonthDay(item.created_at)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <Card className='border-dashed'>
      <CardContent className='flex flex-col items-center justify-center py-12'>
        <IconNetwork className='text-muted-foreground mb-4 h-12 w-12' />
        <CardTitle className='mb-2 text-xl'>No Network Types Found</CardTitle>
        <p className='text-muted-foreground text-sm'>
          Create a network type to get started
        </p>
      </CardContent>
    </Card>
  )
}

export default NetworkCards
