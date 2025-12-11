import { ColumnDef } from '@tanstack/react-table'
import { getExpenceTypeColor, getPaymentTypeColor } from '@/lib/statusHelpers'
import { formatPrice } from '@/utils/formatPrice'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { FormatDateToLongString } from '@/components/date-formatter'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { ExpenceSchema } from '@/features/expences/data/schema'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<ExpenceSchema>[] => [
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
      <DataTableColumnHeader column={column} title={t.expence_type} />
    ),
    cell: ({ row }) => {
      const expenceOriginType = row.original.type
      const expenceType = row.getValue(
        'expence_type'
      ) as keyof typeof t.expenceTypeOptions
      return (
        <div className='flex items-center gap-2'>
          {/* Need to check */}
          <div
            className={` ${
              getExpenceTypeColor(expenceType)
              // expenceType === 'salary'
              // ? 'bg-blue-500'
              // : expenceType === 'avans'
              //   ? 'bg-amber-500'
              //   : 'bg-gray-500'
            } h-2 w-2 rounded-full`}
          />
          <span className='capitalize'>
            {expenceOriginType
              ? `${t.expenceOriginTypeOptions[expenceOriginType]} - `
              : ``}
            {t.expenceTypeOptions[expenceType]}
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
      <DataTableColumnHeader column={column} title={t.amount} />
    ),
    cell: ({ row }) => {
      return (
        <div className='font-medium'>
          {formatPrice(row.getValue('amount'))} {t.uzs}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'company_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.company} />
    ),
    cell: ({ row }) => {
      const companyName = row.getValue('company_name') as string
      return <LongText className='max-w-48'>{companyName}</LongText>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'project_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.project} />
    ),
    cell: ({ row }) => {
      const projectName = row.getValue('project_name') as string
      return <LongText className='max-w-40'>{projectName}</LongText>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'payment_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.payment_type} />
    ),
    cell: ({ row }) => {
      const paymentType = row.getValue(
        'payment_type'
      ) as keyof typeof t.paymentTypeOptions

      if (!paymentType)
        return <span className='text-muted-foreground text-sm'>-</span>
      return (
        <Badge variant='outline' className={getPaymentTypeColor(paymentType)}>
          {t.paymentTypeOptions[paymentType]}
        </Badge>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.created_at} />
    ),
    cell: ({ row }) => (
      <div>
        <FormatDateToLongString dateString={row.getValue('created_at')} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.updated_at} />
    ),
    cell: ({ row }) => (
      <div>
        <FormatDateToLongString dateString={row.getValue('updated_at')} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
