import { ColumnDef } from '@tanstack/react-table'
import { formatPrice } from '@/utils/formatPrice'
import { ProjectSocialSchema } from '../data/schema'

export interface GroupedRow {
  projectId: string
  projectName: string
  count: number
  totalBuyPrice: number
  totalSellPrice: number
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial'
  items: ProjectSocialSchema[]
}

export const groupedColumns: ColumnDef<GroupedRow>[] = [
  {
    accessorKey: 'projectId',
    header: 'Project name',
    cell: ({ row }) => <div>{row.original.projectName}</div>,
  },
  {
    accessorKey: 'count',
    header: 'Items Count',
    cell: ({ row }) => (
      <div className='font-semibold'>{row.original.count}</div>
    ),
  },
  {
    accessorKey: 'totalBuyPrice',
    header: 'Total Buy Price',
    cell: ({ row }) => <div>{formatPrice(row.original.totalBuyPrice)} UZS</div>,
  },
  {
    accessorKey: 'totalSellPrice',
    header: 'Total Sell Price',
    cell: ({ row }) => (
      <div>{formatPrice(row.original.totalSellPrice)} UZS</div>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const status = row.original.paymentStatus
      const styles = {
        Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Unpaid:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Partial:
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      }
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
        >
          {status}
        </span>
      )
    },
  },
]
