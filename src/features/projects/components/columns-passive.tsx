import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/formatPrice'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { ProjectSchema } from '../data/schema'
import Balance from './balance'

export const columnsPassive = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<ProjectSchema>[] => [
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
      <DataTableColumnHeader column={column} title={t.project_name} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2 xl:min-w-[500px]'>
        <div
          className={`${row.original.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
        />
        <LongText className='max-w-36 font-medium'>
          {row.getValue('name')}
        </LongText>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'project_manager',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.project_manager} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <LongText className='max-w-36 font-medium'>
          {row.original.project_manager?.full_name ?? '-'}
        </LongText>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.price} />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      return (
        <div className='font-medium'>
          {formatPrice(price)} {t.uzs}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'given_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.given_amount} />
    ),
    cell: ({ row }) => {
      const price = row.getValue('given_amount') as number
      return (
        <div className='font-medium'>
          {formatPrice(price)} {t.uzs}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.balance} />
    ),
    cell: ({ row }) => <Balance project={row.original} />,
    enableSorting: false,
  },
]
