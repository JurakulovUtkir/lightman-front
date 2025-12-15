import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { FormatDateToLongString } from '@/components/date-formatter'
import LongText from '@/components/long-text'
import { DistributorSchema } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<DistributorSchema>[] => [
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
    accessorKey: 'founder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.distributor} />
    ),
    cell: ({ row }) => {
      const founder = row.original.founder.name
      return (
        <div className='flex items-center gap-4'>
          {' '}
          <div
            className={`${row.original.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
          />
          <LongText className='max-w-36'>{founder}</LongText>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'percentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.percentage} />
    ),
    cell: ({ row }) => <div>{row.getValue('percentage')} %</div>,

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
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.description} />
    ),
    cell: ({ row }) => {
      return (
        <LongText className='max-w-36'>{row.getValue('description')}</LongText>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
