// import { useNavigate } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import {
  IconEdit,
  IconBuilding,
  IconUsers,
  IconCalendar,
  IconFolderOpen,
  IconCreditCard,
  IconTag,
} from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import {
  formatPriceType,
  getPaymentStatusColor,
  getPriceTypeColor,
  getStatusColor,
} from '@/lib/statusHelpers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useProjectContext } from '../context'
import { ProjectSchema } from '../data/schema'

const ProjectCards = ({
  data,
}: {
  data: { items: ProjectSchema[]; total: number } | undefined
}) => {
  const navigate = useNavigate()
  const { setOpen, setCurrentRow } = useProjectContext()

  const handleEdit = (e: React.MouseEvent, payload: ProjectSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  const handleCardClick = (id: string) => {
    navigate({
      to: '/projects/socials/$id',
      params: { id },
    })
  }

  return data?.items.length ? (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {data.items.map((item) => (
        <Card
          key={item.id}
          className='group hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg'
          onClick={() => handleCardClick(item.id)}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <div
                  className={`${item.is_active ? 'bg-green-500' : 'bg-gray-400'} h-2.5 w-2.5 rounded-full ${item.is_active ? 'animate-pulse' : ''}`}
                  title={item.is_active ? 'Active' : 'Inactive'}
                />
                <CardTitle className='line-clamp-1 text-lg'>
                  {item.name}
                </CardTitle>
              </div>
              <Button
                onClick={(e) => handleEdit(e, item)}
                size='icon'
                variant='ghost'
                className='h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <IconEdit className='h-4 w-4' />
              </Button>
            </div>
            <CardDescription className='line-clamp-2 min-h-10'>
              {item.description || 'No description provided'}
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge
                variant='outline'
                className={`${getStatusColor(item.status)} font-medium capitalize`}
              >
                {item.status}
              </Badge>
              <Badge
                variant='outline'
                className={`${getPriceTypeColor(item.price_type)} font-medium`}
              >
                <IconTag className='mr-1 h-3 w-3' />
                {formatPriceType(item.price_type)}
              </Badge>
              <Badge
                variant='outline'
                className={`${getPaymentStatusColor(item.payment_status)} font-medium capitalize`}
              >
                <IconCreditCard className='mr-1 h-3 w-3' />
                {item.payment_status}
              </Badge>
            </div>

            <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
              <IconCalendar className='h-3.5 w-3.5' />
              <span>{formatToYearMonthDay(item.created_at)}</span>
            </div>

            <Separator />

            <div className='space-y-2'>
              <div className='flex items-start gap-2'>
                <IconBuilding className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
                <div className='min-w-0 flex-1'>
                  <p className='text-muted-foreground text-xs'>Our Company</p>
                  <p className='truncate text-sm font-medium'>
                    {item.our_company.name}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <IconUsers className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
                <div className='min-w-0 flex-1'>
                  <p className='text-muted-foreground text-xs'>Customer</p>
                  <p className='truncate text-sm font-medium'>
                    {item.customer_company.name}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <Card className='border-dashed'>
      <CardContent className='flex flex-col items-center justify-center py-12'>
        <IconFolderOpen className='text-muted-foreground mb-4 h-12 w-12' />
        <CardTitle className='mb-2 text-xl'>No Projects Found</CardTitle>
        <p className='text-muted-foreground text-sm'>
          Get started by creating your first project
        </p>
      </CardContent>
    </Card>
  )
}

export default ProjectCards
