import {
  IconTag,
  IconEdit,
  IconCircleCheck,
  IconCircleX,
  IconCalendar,
} from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNetworkTagContext } from '../context'
import { NetworkTagSchema } from '../data/schema'

export const NetworkTagCards = ({
  data,
}: {
  data: NetworkTagSchema[] | undefined
}) => {
  //   const navigate = useNavigate()
  const { setOpen, setCurrentRow } = useNetworkTagContext()

  const handleEdit = (e: React.MouseEvent, payload: NetworkTagSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  //   const handleCardClick = (tagId: string) => {
  //     // TODO: Implement card click navigation
  //     console.log('Card clicked:', tagId)
  //   }

  return data && data?.length > 0 ? (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
      {data?.map((tag) => (
        <Card
          key={tag.id}
          className='group hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg'
          //   onClick={() => handleCardClick(tag.id)}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <IconTag className='text-primary h-5 w-5' />
                <Badge
                  variant={tag.is_active ? 'success' : 'destructive'}
                  className='gap-1'
                >
                  {tag.is_active ? (
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
                onClick={(e) => handleEdit(e, tag)}
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
              {tag.name}
            </CardTitle>

            <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
              <IconCalendar className='h-3.5 w-3.5' />
              <span>{formatToYearMonthDay(tag.created_at)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <Card className='border-dashed'>
      <CardContent className='flex flex-col items-center justify-center py-12'>
        <IconTag className='text-muted-foreground mb-4 h-12 w-12' />
        <CardTitle className='mb-2 text-xl'>No Network Tags Found</CardTitle>
        <p className='text-muted-foreground text-sm'>
          Create a network tag to get started
        </p>
      </CardContent>
    </Card>
  )
}
