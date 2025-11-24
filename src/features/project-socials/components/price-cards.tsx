import { useMemo } from 'react'
import {
  IconCurrencyDollar,
  IconCalculator,
  IconTrendingUp,
  IconEye,
} from '@tabler/icons-react'
import { formatPrice } from '@/utils/formatPrice'
import { ProjectSocialResponse } from '../data/types'

interface PriceCardsProps {
  data: ProjectSocialResponse
  statistics?: {
    planned_views_count: number
    actual_views_count: number
  }
}

const PriceCards = ({ data, statistics }: PriceCardsProps) => {
  const { totalPrice, totalPriceWithQQS, totalProfit } = useMemo(() => {
    if (!data?.data?.length) {
      return { totalPrice: 0, totalPriceWithQQS: 0, totalProfit: 0 }
    }

    const total = data.data.reduce((sum, item) => {
      return sum + (Number(item.sell_price) || 0)
    }, 0)

    const profit = data.data.reduce((sum, item) => {
      const sellPrice = Number(item.sell_price) || 0
      const buyPrice = Number(item.buy_price) || 0
      return sum + (sellPrice - buyPrice)
    }, 0)

    return {
      totalPrice: total,
      totalPriceWithQQS: total * 1.12,
      totalProfit: profit,
    }
  }, [data?.data])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const viewsProgress = useMemo(() => {
    if (!statistics) return 0
    const { planned_views_count, actual_views_count } = statistics
    if (planned_views_count === 0) return 0
    return Math.min((planned_views_count / actual_views_count) * 100, 100)
  }, [statistics])

  return (
    <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:gap-6'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100'>
          <IconCurrencyDollar className='h-5 w-5 text-blue-600' stroke={2} />
        </div>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-xs'>Project Price</p>
          <p className='truncate text-lg font-bold'>
            {formatPrice(totalPrice)} UZS
          </p>
        </div>
      </div>

      <div className='bg-border hidden h-10 w-px lg:block' />

      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100'>
          <IconCalculator className='h-5 w-5 text-green-600' stroke={2} />
        </div>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-xs'>Price with QQS (12%)</p>
          <p className='truncate text-lg font-bold'>
            {formatPrice(totalPriceWithQQS)} UZS
          </p>
        </div>
      </div>

      <div className='bg-border hidden h-10 w-px lg:block' />

      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100'>
          <IconTrendingUp className='h-5 w-5 text-purple-600' stroke={2} />
        </div>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-xs'>Total Profit</p>
          <p className='truncate text-lg font-bold'>
            {formatPrice(totalProfit)} UZS
          </p>
        </div>
      </div>

      {statistics && (
        <>
          <div className='bg-border hidden h-10 w-px lg:block' />

          <div className='flex min-w-[280px] items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100'>
              <IconEye className='h-5 w-5 text-cyan-600' stroke={2} />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 flex items-center justify-between gap-2'>
                <p className='text-muted-foreground text-xs'>Views Progress</p>
                <p className='text-xs font-medium'>
                  {viewsProgress.toFixed(0)}%
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-bold whitespace-nowrap'>
                  {formatNumber(statistics.planned_views_count)}
                </p>
                <span className='text-muted-foreground text-xs'>/</span>
                <p className='text-muted-foreground text-sm font-medium whitespace-nowrap'>
                  {formatNumber(statistics.actual_views_count)}
                </p>
              </div>
              <div className='mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
                <div
                  className='h-full rounded-full bg-cyan-600 transition-all duration-300'
                  style={{ width: `${viewsProgress}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PriceCards
