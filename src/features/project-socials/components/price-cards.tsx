import { useMemo } from 'react'
import {
  IconCurrencyDollar,
  IconCalculator,
  IconTrendingUp,
  IconEye,
  IconReceipt,
} from '@tabler/icons-react'
import { formatPrice } from '@/utils/formatPrice'
import { useLang } from '@/hooks/useLang'
import { ProjectSchema } from '@/features/projects/data/schema'
import { ProjectSocialResponse } from '../data/types'

interface PriceCardsProps {
  data: ProjectSocialResponse
  project: ProjectSchema | undefined
  statistics?: {
    planned_views_count: number
    actual_views_count: number
  }
  expenceStatistics?: {
    given_amount: string
    project_id: string
    project_name: string
    total_expensed_by_service: number
    total_income: number
    total_planned_buy_expense: number
    total_planned_sell_expense: number
  }
}

const PriceCards = ({
  data,
  project,
  statistics,
  expenceStatistics,
}: PriceCardsProps) => {
  const { lang, tProject, general } = useLang()
  const t = tProject[lang]

  const { totalPrice, totalPriceWithQQS, totalProfit, isQQS } = useMemo(() => {
    if (!data?.data?.length) {
      return {
        totalPrice: 0,
        totalPriceWithQQS: 0,
        totalProfit: 0,
        isQQS: false,
      }
    }

    const total = data.data.reduce((sum, item) => {
      return sum + (Number(item.sell_price) || 0)
    }, 0)

    const profit = data.data.reduce((sum, item) => {
      const sellPrice = Number(item.sell_price) || 0
      const buyPrice = Number(item.buy_price) || 0
      return sum + (sellPrice - buyPrice)
    }, 0)

    const hasQQS = project?.is_qqs === true

    return {
      totalPrice: total,
      totalPriceWithQQS: total * 1.12,
      totalProfit: profit,
      isQQS: hasQQS,
    }
  }, [data?.data])

  const expenseProgress = useMemo(() => {
    if (!expenceStatistics)
      return { percentage: 0, numerator: 0, denominator: 0 }

    const {
      total_expensed_by_service,
      total_planned_sell_expense,
      total_income,
    } = expenceStatistics

    if (total_income === 0)
      return { percentage: 0, numerator: 0, denominator: 0 }

    const totalExpense = total_expensed_by_service + total_planned_sell_expense
    const numerator = isQQS ? 1.12 * totalExpense : totalExpense
    const percentage = Math.min((numerator / total_income) * 100, 100)

    return {
      percentage,
      numerator,
      denominator: total_income,
    }
  }, [expenceStatistics, isQQS])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const viewsProgress = useMemo(() => {
    if (!statistics) return 0
    const { planned_views_count, actual_views_count } = statistics

    if (actual_views_count === 0) return 0
    return Math.min((actual_views_count / planned_views_count) * 100, 100)
  }, [statistics])

  return (
    <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:gap-6'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100'>
          <IconCurrencyDollar className='h-5 w-5 text-blue-600' stroke={2} />
        </div>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-xs'>{t.project_price}</p>
          <p className='truncate text-lg font-bold'>
            {formatPrice(totalPrice)} {general[lang].columns.uzs}
          </p>
        </div>
      </div>

      <div className='bg-border hidden h-10 w-px lg:block' />

      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100'>
          <IconCalculator className='h-5 w-5 text-green-600' stroke={2} />
        </div>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-xs'>
            {t.price_with_vat} (12%)
          </p>
          <p className='truncate text-lg font-bold'>
            {formatPrice(totalPriceWithQQS)} {general[lang].columns.uzs}
          </p>
        </div>
      </div>

      <div className='bg-border hidden h-10 w-px lg:block' />

      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100'>
          <IconTrendingUp className='h-5 w-5 text-purple-600' stroke={2} />
        </div>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-xs'>{t.total_profit}</p>
          <p className='truncate text-lg font-bold'>
            {formatPrice(totalProfit)} {general[lang].columns.uzs}
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
                <p className='text-muted-foreground text-xs'>
                  {t.views_progress}
                </p>
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

      {expenceStatistics && (
        <>
          <div className='bg-border hidden h-10 w-px lg:block' />

          <div className='flex min-w-[280px] items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100'>
              <IconReceipt className='h-5 w-5 text-orange-600' stroke={2} />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 flex items-center justify-between gap-2'>
                <p className='text-muted-foreground text-xs'>
                  {t.expense_progress}
                  {isQQS && ' (+12%)'}
                </p>
                <p className='text-xs font-medium'>
                  {expenseProgress.percentage.toFixed(0)}%
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-bold whitespace-nowrap'>
                  {formatPrice(expenseProgress.denominator)}{' '}
                  {general[lang].columns.uzs}
                </p>
                <span className='text-muted-foreground text-xs'>/</span>
                <p className='text-muted-foreground text-sm font-medium whitespace-nowrap'>
                  {formatPrice(expenseProgress.numerator)}{' '}
                  {general[lang].columns.uzs}
                </p>
              </div>
              <div className='mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
                <div
                  className='h-full rounded-full bg-orange-600 transition-all duration-300'
                  style={{ width: `${expenseProgress.percentage}%` }}
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
