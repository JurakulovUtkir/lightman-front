import { useNavigate } from '@tanstack/react-router'
import { IconEdit } from '@tabler/icons-react'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDistributionContext } from '../context'
import { DistributionSchema } from '../data/schema'

const DistributionCards = ({
  data,
}: {
  data: DistributionSchema[] | undefined
}) => {
  const navigate = useNavigate()
  const { setOpen, setCurrentRow } = useDistributionContext()
  const handleEdit = (e: React.MouseEvent, payload: DistributionSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  const handleCardClick = (id: string) => {
    navigate({
      to: '/stakeholder/distributors/$id',
      params: { id },
    })
  }

  return data?.length ? (
    <div className='grid grid-cols-6 gap-4'>
      {data.map((item) => (
        <Card
          key={item.id}
          className='cursor-pointer transition-all hover:shadow-lg'
          onClick={() => handleCardClick(item.id)}
        >
          <CardContent className='flex justify-between'>
            <div className='flex items-center gap-4'>
              <div
                className={`${item.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
              />
              <CardTitle>{item.name}</CardTitle>
            </div>

            <div className='flex items-center gap-4'>
              <IconEdit
                size={16}
                onClick={(e) => handleEdit(e, item)}
                className='cursor-pointer'
              />
            </div>
          </CardContent>
          <CardFooter className='text-foreground pt-6 text-sm'>
            {item.description && item.description?.length >= 40 ? (
              <Tooltip>
                <TooltipTrigger className='text-left'>
                  {item.description.slice(0, 40)} ...
                </TooltipTrigger>
                <TooltipContent className='max-w-[350px] overflow-auto md:max-w-[500px]'>
                  {item.description}
                </TooltipContent>
              </Tooltip>
            ) : (
              <p>{item.description ? item.description : ''}</p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <Card>
      <CardContent className='py-6'>
        <CardTitle className='text-center'>No Distributions found</CardTitle>
      </CardContent>
    </Card>
  )
}

export default DistributionCards
