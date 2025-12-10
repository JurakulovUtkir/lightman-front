import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/formatPrice'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { FormatDateToLongString } from '@/components/date-formatter'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { LoanSchema } from '../data/schema'

// import { DataTableRowActions } from './data-table-row-actions'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<LoanSchema>[] => [
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
    accessorKey: 'counterparty_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.counterparty} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 font-medium'>
        {row.getValue('counterparty_name')}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'direction',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.direction_name} />
    ),
    cell: ({ row }) => {
      const direction = row.original.direction as keyof typeof t.direction

      return (
        <Badge
          variant={direction === 'WE_GAVE' ? 'destructive' : 'default'}
          className='whitespace-nowrap'
        >
          {t.direction[direction]}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.status} />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'h-2 w-2 animate-pulse rounded-full',
              status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'
            )}
          />
          <span className='capitalize'>{status.toLowerCase()}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'planned_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.planned_amount} />
    ),
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>
        {formatPrice(row.getValue('planned_amount'))} {t.uzs}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'given_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.given_amount} />
    ),
    cell: ({ row }) => (
      <div className='font-medium whitespace-nowrap'>
        {formatPrice(row.getValue('given_amount'))} {t.uzs}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.start_date} />
    ),
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>
        <FormatDateToLongString dateString={row.getValue('start_date')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.due_date} />
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue('due_date') as string
      const isOverdue =
        new Date(dueDate) < new Date() && row.getValue('status') === 'ACTIVE'

      return (
        <div
          className={cn(
            'whitespace-nowrap',
            isOverdue && 'text-destructive font-medium'
          )}
        >
          <FormatDateToLongString dateString={dueDate} />
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'closed_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.closed_date} />
    ),
    cell: ({ row }) => {
      const closedDate = row.getValue('closed_date') as string | null
      return (
        <div className='whitespace-nowrap'>
          {closedDate ? (
            <FormatDateToLongString dateString={closedDate} />
          ) : (
            <span className='text-muted-foreground'>—</span>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.notes} />
    ),
    cell: ({ row }) => {
      const note = row.getValue('note') as string | null
      return (
        <LongText className='max-w-48'>
          {note || <span className='text-muted-foreground'>—</span>}
        </LongText>
      )
    },
    enableSorting: false,
  },
  //   {
  //     id: 'actions',
  //     cell: ({ row }) => <DataTableRowActions row={row} />,
  //   },
]
