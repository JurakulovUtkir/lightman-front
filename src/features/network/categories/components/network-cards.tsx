import { IconPencil } from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { useNetworkCategoryContext } from '../context'
import { NetworkCategorySchema } from '../data/schema'

const NetworkCards = ({
  data,
}: {
  data: { items: NetworkCategorySchema[]; total: number } | undefined
}) => {
  const { setOpen, setCurrentRow } = useNetworkCategoryContext()

  const handleEdit = (payload: NetworkCategorySchema) => {
    setCurrentRow(payload)
    setOpen('update')
  }

  return data?.items.length ? (
    <div className='grid grid-cols-6 gap-4'>
      {data.items.map((item) => (
        <Card key={item.id}>
          <CardContent className='flex items-center justify-between'>
            <CardTitle>{item.name}</CardTitle>
            <div className='flex items-center'>
              <Button
                onClick={() => handleEdit(item)}
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
        <CardTitle className='text-center'>No Network types found</CardTitle>
      </CardContent>
    </Card>
  )
}

export default NetworkCards
