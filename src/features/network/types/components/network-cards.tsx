import { useNavigate } from '@tanstack/react-router'
import { IconPencil } from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
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
    <div className='grid grid-cols-6 gap-4'>
      {data.map((item) => (
        <Card
          key={item.id}
          className='cursor-pointer transition-all hover:shadow-lg'
          onClick={() => handleCardClick(item.id)}
        >
          <CardContent className='flex items-center justify-between'>
            <CardTitle>{item.name}</CardTitle>
            <div className='flex items-center'>
              <Button
                onClick={(e) => handleEdit(e, item)}
                size='sm'
                variant='ghost'
                className='rounded-full'
              >
                <IconPencil />
              </Button>
            </div>
          </CardContent>
          <CardFooter className='text-muted-foreground flex items-center justify-between text-sm'>
            <div
              className={`${item.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
            />
            {formatToYearMonthDay(item.created_at)}
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <Card>
      <CardContent className='py-6'>
        <CardTitle className='text-center'>No Netrork types found</CardTitle>
      </CardContent>
    </Card>
  )
}

export default NetworkCards
