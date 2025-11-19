import { ColumnDef } from '@tanstack/react-table'
import { formatPrice } from '@/utils/formatPrice'
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

export const groupedColumns: ColumnDef<GroupedRow>[] = [
  {
    accessorKey: 'socialName',
    header: 'Social Name',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-semibold'>{row.original.socialName}</span>
        <a
          href={row.original.socialLink}
          target='_blank'
          rel='noopener noreferrer'
          className='text-xs text-blue-500 hover:underline'
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.socialLink}
        </a>
      </div>
    ),
  },
  {
    accessorKey: 'subscriberCount',
    header: 'Subscribers',
    cell: ({ row }) => (
      <div className='font-medium'>
        {row.original.subscriberCount.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'count',
    header: 'Posts Count',
    cell: ({ row }) => (
      <div className='text-center font-semibold'>{row.original.count}</div>
    ),
  },
  {
    accessorKey: 'totalBuyPrice',
    header: 'Total Buy Price',
    cell: ({ row }) => (
      <div className='font-medium'>
        {formatPrice(row.original.totalBuyPrice)} UZS
      </div>
    ),
  },
  {
    accessorKey: 'totalSellPrice',
    header: 'Total Sell Price',
    cell: ({ row }) => (
      <div className='font-medium'>
        {formatPrice(row.original.totalSellPrice)} UZS
      </div>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const allPaid = row.original.items.every((item) => item.is_paid)
      const somePaid = row.original.items.some((item) => item.is_paid)

      let displayStatus = 'Unpaid'
      let colorClass =
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'

      if (allPaid) {
        displayStatus = 'Paid'
        colorClass =
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      } else if (somePaid) {
        displayStatus = 'Partially Paid'
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
