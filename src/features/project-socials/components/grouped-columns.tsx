import { ColumnDef } from '@tanstack/react-table'
import { formatPrice } from '@/utils/formatPrice'
import LongText from '@/components/long-text'
import { ProjectSocialSchema } from '../data/schema'

export interface GroupedRow {
  socialId: string
  socialName: string
  socialLink: string
  subscriberCount: number
  count: number
  totalBuyPrice: number
  totalSellPrice: number
  paymentStatus: 'Paid' | 'Unpaid'
  items: ProjectSocialSchema[]
}

export const groupedColumns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<GroupedRow>[] => [
  {
    accessorKey: 'socialName',
    header: t.social_name,
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <LongText className='max-w-36 font-semibold'>
          {row.original.socialName}
        </LongText>
        <a
          href={row.original.socialLink}
          target='_blank'
          rel='noopener noreferrer'
          className='max-w-max text-xs text-blue-500 hover:underline'
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.socialLink?.length >= 50 ? (
            <LongText className='max-w-36 font-semibold'>
              {row.original.socialLink}
            </LongText>
          ) : (
            row.original.socialLink
          )}
        </a>
      </div>
    ),
  },
  {
    accessorKey: 'subscriberCount',
    header: t.subscribers,
    cell: ({ row }) => (
      <div className='font-medium'>
        {row.original.subscriberCount.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'count',
    header: t.posts_count,
    cell: ({ row }) => (
      <div className='text-center font-semibold'>{row.original.count}</div>
    ),
  },
  {
    accessorKey: 'totalBuyPrice',
    header: t.total_buy_price,
    cell: ({ row }) => (
      <div className='font-medium'>
        {formatPrice(row.original.totalBuyPrice)} {t.uzs}
      </div>
    ),
  },
  {
    accessorKey: 'totalSellPrice',
    header: t.total_sell_price,
    cell: ({ row }) => (
      <div className='font-medium'>
        {formatPrice(row.original.totalSellPrice)} {t.uzs}
      </div>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    header: t.payment_status,
    cell: ({ row }) => {
      const allPaid = row.original.items.every((item) => item.is_paid)
      const somePaid = row.original.items.some((item) => item.is_paid)

      let displayStatus = t.unpaid
      let colorClass =
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'

      if (allPaid) {
        displayStatus = t.paid
        colorClass =
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      } else if (somePaid) {
        displayStatus = t.partially_paid
        colorClass =
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      }

      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
          {displayStatus}
        </span>
      )
    },
  },
]
