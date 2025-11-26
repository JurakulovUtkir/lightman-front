import { ColumnDef } from '@tanstack/react-table'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { formatPaymentType, getPaymentTypeColor } from '@/lib/statusHelpers'
import { formatPrice } from '@/utils/formatPrice'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { ExpenceSchema } from '@/features/expences/data/schema'

export const columns: ColumnDef<ExpenceSchema>[] = [
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
    accessorKey: 'expence_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Expense Type' />
    ),
    cell: ({ row }) => {
      const type = row.original.type
      const expenseType = row.getValue('expence_type') as string
      return (
        <div className='flex items-center gap-2'>
          <div
            className={`${
              expenseType === 'salary'
                ? 'bg-blue-500'
                : expenseType === 'avans'
                  ? 'bg-amber-500'
                  : 'bg-gray-500'
            } h-2 w-2 rounded-full`}
          />
          <span className='capitalize'>
            {type ? `${type} - ` : ``}
            {expenseType}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return (
        <div className='font-medium'>
          {formatPrice(row.getValue('amount'))} UZS
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company' />
    ),
    cell: ({ row }) => {
      const companyName = row.original.company.name ?? '-'
      return <LongText className='max-w-48'>{companyName}</LongText>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'project_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project' />
    ),
    cell: ({ row }) => {
      const projectName = row.original.project.name ?? '-'
      return <LongText className='max-w-40'>{projectName}</LongText>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'payment_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Type' />
    ),
    cell: ({ row }) => {
      const paymentType = row.getValue('payment_type') as string
      if (!paymentType)
        return <span className='text-muted-foreground text-sm'>-</span>
      return (
        <Badge variant='outline' className={getPaymentTypeColor(paymentType)}>
          {formatPaymentType(paymentType)}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created at' />
    ),
    cell: ({ row }) => (
      <div>{formatDateToLongString(row.getValue('created_at'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated at' />
    ),
    cell: ({ row }) => (
      <div>{formatDateToLongString(row.getValue('updated_at'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
