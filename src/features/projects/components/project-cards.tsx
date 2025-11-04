// import { useNavigate } from '@tanstack/react-router'
import { IconEdit } from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { useProjectContext } from '../context'
import { ProjectSchema } from '../data/schema'

const ProjectCards = ({
  data,
}: {
  data: { items: ProjectSchema[]; total: number } | undefined
}) => {
  //   const navigate = useNavigate()
  const { setOpen, setCurrentRow } = useProjectContext()

  const handleEdit = (e: React.MouseEvent, payload: ProjectSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  const handleCardClick = (projectId: string) => {
    // eslint-disable-next-line no-console
    console.log('projectId', projectId)

    // navigate({
    //   to: '/network/socials',
    //   search: {
    //     offset: 0,
    //     category_id: projectId,
    //   },
    // })
  }

  return data?.items.length ? (
    <div className='grid grid-cols-3 gap-4'>
      {data.items.map((item) => (
        <Card
          key={item.id}
          className='cursor-pointer transition-all hover:shadow-lg'
          onClick={() => handleCardClick(item.id)}
        >
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div
                  className={`${item.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
                />
                <Badge variant='secondary' className='capitalize'>
                  {item.status}
                </Badge>
              </div>
              <Button
                onClick={(e) => handleEdit(e, item)}
                size='sm'
                variant='ghost'
                className='rounded-full'
              >
                <IconEdit />
              </Button>
            </div>
          </CardContent>
          <CardFooter className='flex-col items-start'>
            <h2 className='mb-1 font-semibold'>{item.name}</h2>
            <div className='flex w-full items-center justify-between'>
              <p className='line-clamp-2 text-gray-500'>{item.description}</p>
              <p className='text-sm text-gray-500'>
                {formatToYearMonthDay(item.created_at)}
              </p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <Card>
      <CardContent className='py-6'>
        <CardTitle className='text-center'>No Projects found</CardTitle>
      </CardContent>
    </Card>
  )
}

export default ProjectCards
