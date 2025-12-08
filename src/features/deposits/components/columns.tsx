import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/formatPrice'
import { Checkbox } from '@/components/ui/checkbox'
import { FormatDateToLongString } from '@/components/date-formatter'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { DepositSchema } from '../data/schema'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<DepositSchema>[] => [
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
      <DataTableColumnHeader column={column} title={t.deposit_name} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2 lg:w-[700px]'>
        {row.getValue('name')}
      </div>
    ),
    enableSorting: false,
  },

  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.balance} />
    ),
    cell: ({ row }) => (
      <div>
        {formatPrice(row.getValue('balance'))} {t.uzs}
      </div>
    ),
    enableSorting: false,
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.created_at} />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at
      return (
        <div className='text-sm whitespace-nowrap'>
          <FormatDateToLongString dateString={createdAt} />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.updated_at} />
    ),
    cell: ({ row }) => {
      const updated_at = row.original.updated_at
      return (
        <div className='text-sm whitespace-nowrap'>
          <FormatDateToLongString dateString={updated_at} />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
