import { ColumnDef } from '@tanstack/react-table'
import { formatDateToLongString } from '@/lib/dateFormatter'
import {
  getStatusColor,
  getPriceTypeColor,
  getPaymentStatusColor,
  getPaymentTypeColor,
  formatPaymentType,
  formatPriceType,
} from '@/lib/statusHelpers'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { ProjectSchema } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<ProjectSchema>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project name' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <div
          className={`${row.original.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
        />
        <span className='font-medium'>{row.getValue('name')}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate'>
        {row.getValue('description') || '-'}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'customer_company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const customer = row.getValue('customer_company') as { name: string }
      return <div>{customer?.name || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'our_company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Our Company' />
    ),
    cell: ({ row }) => {
      const company = row.getValue('our_company') as { name: string }
      return <div>{company?.name || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => {
      const category = row.getValue('category') as { name: string }
      return (
        <div className='bg-secondary inline-flex items-center rounded-md px-2 py-1 text-xs'>
          {category?.name || '-'}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'contract',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Contract' />
    ),
    cell: ({ row }) => {
      const contract = row.getValue('contract') as {
        contract_number: string
        name: string
      }
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-sm font-medium'>
            {contract?.contract_number || '-'}
          </span>
          <span className='text-muted-foreground text-xs'>
            {contract?.name || ''}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      return (
        <div className='font-medium'>{price?.toLocaleString('en-US')} UZS</div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(status)}`}
        >
          {status}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'payment_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment' />
    ),
    cell: ({ row }) => {
      const paymentStatus = row.getValue('payment_status') as string
      return (
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${getPaymentStatusColor(paymentStatus)}`}
        >
          {paymentStatus}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'payment_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Type' />
    ),
    cell: ({ row }) => {
      const paymentType = row.getValue('payment_type') as string
      return (
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${getPaymentTypeColor(paymentType)}`}
        >
          {formatPaymentType(paymentType)}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'price_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price Type' />
    ),
    cell: ({ row }) => {
      const priceType = row.getValue('price_type') as string
      return (
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${getPriceTypeColor(priceType)}`}
        >
          {formatPriceType(priceType)}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'is_qqs',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='QQS' />
    ),
    cell: ({ row }) => (
      <div
        className={`${row.getValue('is_qqs') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created at' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground text-sm'>
        {formatDateToLongString(row.getValue('created_at'))}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
