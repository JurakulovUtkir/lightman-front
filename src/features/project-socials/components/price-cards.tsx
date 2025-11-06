import { useMemo } from 'react'
import {
  IconCurrencyDollar,
  IconCalculator,
  IconTrendingUp,
} from '@tabler/icons-react'
import { formatPrice } from '@/utils/formatPrice'
import { ProjectSocialResponse } from '../data/types'

const PriceCards = ({ data }: { data: ProjectSocialResponse }) => {
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

  return (
    <div className='mb-6 flex items-center gap-6'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
          <IconCurrencyDollar className='h-5 w-5 text-blue-600' stroke={2} />
        </div>
        <div>
          <p className='text-muted-foreground text-xs'>Project Price</p>
          <p className='text-lg font-bold'>{formatPrice(totalPrice)} UZS</p>
        </div>
      </div>

      <div className='bg-border h-10 w-px' />

      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100'>
          <IconCalculator className='h-5 w-5 text-green-600' stroke={2} />
        </div>
        <div>
          <p className='text-muted-foreground text-xs'>Price with QQS (12%)</p>
          <p className='text-lg font-bold'>
            {formatPrice(totalPriceWithQQS)} UZS
          </p>
        </div>
      </div>

      <div className='bg-border h-10 w-px' />

      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
          <IconTrendingUp className='h-5 w-5 text-purple-600' stroke={2} />
        </div>
        <div>
          <p className='text-muted-foreground text-xs'>Total Profit</p>
          <p className='text-lg font-bold'>{formatPrice(totalProfit)} UZS</p>
        </div>
      </div>
    </div>
  )
}

export default PriceCards
