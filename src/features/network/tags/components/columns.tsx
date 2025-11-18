import { ColumnDef } from '@tanstack/react-table'
import { IconCalendar, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { NetworkTagSchema } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<NetworkTagSchema>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div className='w-[600px]'>{row.getValue('name')} </div>,

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <Badge
            variant={row.getValue('is_active') ? 'success' : 'destructive'}
            className='gap-1'
          >
            {row.getValue('is_active') ? (
              <>
                <IconCircleCheck className='h-3 w-3' />
                Active
              </>
            ) : (
              <>
                <IconCircleX className='h-3 w-3' />
                Inactive
              </>
            )}
          </Badge>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created at' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
        <IconCalendar className='h-3.5 w-3.5' />
        <span>{formatDateToLongString(row.getValue('created_at'))}</span>
      </div>
    ),

    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
