import { ColumnDef } from '@tanstack/react-table'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DistributorSchema } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<DistributorSchema>[] = [
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
    accessorKey: 'is_active',
    header: ({ column }) => <DataTableColumnHeader column={column} title='' />,
    cell: ({ row }) => {
      return (
        <div>
          <div
            className={`${row.getValue('is_active') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
          />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'founder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Distributor' />
    ),
    cell: ({ row }) => {
      const founder = row.original.founder.name
      return <div>{founder}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'percentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Percentage' />
    ),
    cell: ({ row }) => <div>{row.getValue('percentage')} %</div>,

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'percentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Percentage' />
    ),
    cell: ({ row }) => <div>{row.getValue('percentage')} %</div>,

    enableSorting: false,
    enableHiding: false,
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
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const info = row.original.description
      const contactInfo = info
        ? info?.length >= 50
          ? `${info.slice(0, 50)} ...`
          : info
        : '-'

      return (
        <div>
          {info && info?.length >= 50 ? (
            <Tooltip>
              <TooltipTrigger>{contactInfo}</TooltipTrigger>
              <TooltipContent className='max-w-[350px] md:max-w-[500px]'>
                {row.getValue('description')}
              </TooltipContent>
            </Tooltip>
          ) : (
            <p>{info?.length ? info : '-'}</p>
          )}
        </div>
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
