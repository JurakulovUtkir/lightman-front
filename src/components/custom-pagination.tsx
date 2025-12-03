import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CustomPaginationProps {
  offset: number
  limit: number
  total: number
}

export function CustomPagination({
  offset,
  limit,
  total,
}: CustomPaginationProps) {
  const navigate = useNavigate()
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)
  const { lang, general, interpolate } = useLang()
  const t = general[lang].pagination

  const handleOffsetChange = (newOffset: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigate({ search: (prev) => ({ ...prev, offset: newOffset }) })
  }

  const handleLimitChange = (newLimit: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigate({ search: (prev) => ({ ...prev, limit: newLimit, offset: 0 }) })
  }

  const handleFirstPage = () => {
    handleOffsetChange(0)
  }

  const handlePreviousPage = () => {
    const newOffset = Math.max(0, offset - limit)
    handleOffsetChange(newOffset)
  }

  const handleNextPage = () => {
    const newOffset = Math.min(offset + limit, (totalPages - 1) * limit)
    handleOffsetChange(newOffset)
  }

  const handleLastPage = () => {
    handleOffsetChange((totalPages - 1) * limit)
  }

  return (
    <div
      className='flex flex-col justify-between gap-4 overflow-clip px-2 py-4 lg:flex-row lg:items-center'
      style={{ overflowClipMargin: 1 }}
    >
      <div className='text-muted-foreground hidden flex-1 text-sm sm:block'>
        {interpolate(t.showing_results, {
          from: offset + 1,
          to: Math.min(offset + limit, total),
          total: total,
        })}
      </div>
      <div className='flex w-full items-center justify-between sm:space-x-6 lg:w-auto lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='hidden text-sm font-medium sm:block'>
            {t.items_per_page}
          </p>
          <Select
            value={limit.toString()}
            onValueChange={(value) => handleLimitChange(Number(value))}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-center text-sm font-medium'>
          {interpolate(t.page_of, { current: currentPage, total: totalPages })}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={handleFirstPage}
            disabled={currentPage === 1}
          >
            <span className='sr-only'>{t.go_first}</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <span className='sr-only'>{t.go_previous}</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <span className='sr-only'>{t.go_next}</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
          >
            <span className='sr-only'>{t.go_last}</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
