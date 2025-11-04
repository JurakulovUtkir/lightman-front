// import { useNavigate } from '@tanstack/react-router'
import {
  IconEdit,
  IconBuilding,
  IconUsers,
  IconCalendar,
  IconFolderOpen,
} from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
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
  const { setOpen, setCurrentRow } = useProjectContext()

  const handleEdit = (e: React.MouseEvent, payload: ProjectSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  const handleCardClick = (projectId: string) => {
    // eslint-disable-next-line no-console
    console.log('projectId', projectId)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      on_hold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      requested: 'bg-purple-100 text-purple-800 border-purple-200',
      done: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      canceled: 'bg-red-100 text-red-800 border-red-200',
    }
    return (
      colors[status.toLowerCase()] ||
      'bg-gray-100 text-gray-800 border-gray-200'
    )
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
            <CardDescription className='line-clamp-2 min-h-[2.5rem]'>
              {item.description || 'No description provided'}
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Badge
                variant='outline'
                className={`${getStatusColor(item.status)} font-medium capitalize`}
              >
                {item.status}
              </Badge>
              <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
                <IconCalendar className='h-3.5 w-3.5' />
                <span>{formatToYearMonthDay(item.created_at)}</span>
              </div>
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
