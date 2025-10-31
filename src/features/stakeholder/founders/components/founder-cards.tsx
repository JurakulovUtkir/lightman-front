import { IconEdit, IconUserFilled } from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { useFounderContext } from '../context'
import { FounderSchema } from '../data/schema'

const FounderCards = ({ data }: { data: FounderSchema[] | undefined }) => {
  const { setOpen, setCurrentRow } = useFounderContext()

  const handleEdit = (e: React.MouseEvent, payload: FounderSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  return data?.length ? (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8'>
      {data.map((item) => (
        <Card
          key={item.id}
          //   className='cursor-pointer transition-all hover:shadow-lg'
          //   onClick={() => handleCardClick(item.id)}
        >
          <CardContent className='flex justify-between'>
            <div
              className={`${item.is_active ? `bg-green-500` : `bg-destructive`} mt-0.5 h-2 w-2 animate-pulse rounded-full`}
            />

            <div className='flex flex-col items-center justify-center gap-4'>
              <IconUserFilled size={40} />
              <CardTitle>{item.name}</CardTitle>
            </div>

            <IconEdit
              size={16}
              onClick={(e) => handleEdit(e, item)}
              className='cursor-pointer'
            />
          </CardContent>
          <CardFooter className='flex flex-col'>
            <span>
              Balance: <b>{item.balance}</b>{' '}
              <span className='text-xs'> UZS</span>
            </span>
            <span className='text-xs'>
              {formatToYearMonthDay(item.updated_at)}
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <Card>
      <CardContent className='py-6'>
        <CardTitle className='text-center'>No Founders found</CardTitle>
      </CardContent>
    </Card>
  )
}

export default FounderCards
