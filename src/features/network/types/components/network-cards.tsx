import { IconPencil, IconTrash } from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { useNetworkTypeContext } from '../context'
import { NetworkTypeSchema } from '../data/schema'

const NetworkCards = ({ data }: { data: NetworkTypeSchema[] | undefined }) => {
  const { setOpen, setCurrentRow } = useNetworkTypeContext()

  const handleDelete = (paload: NetworkTypeSchema) => {
    setCurrentRow(paload)
    setOpen('delete')
  }
  const handleEdit = (paload: NetworkTypeSchema) => {
    setCurrentRow(paload)
    setOpen('update')
  }

  return data?.length ? (
    <div className='grid grid-cols-6 gap-4'>
      {data.map((item) => (
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
              <Button
                onClick={() => handleDelete(item)}
                size='sm'
                variant='ghost'
                className='rounded-full'
              >
                <IconTrash />
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
