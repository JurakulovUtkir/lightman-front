import { ColumnDef } from '@tanstack/react-table'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { callTypes, userTypes } from '../data/data'
import { User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Full name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('full_name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableHiding: false,
    enableSorting: false,
  },

  {
    accessorKey: 'phone_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => <div>{row.getValue('phone_number')}</div>,
    enableSorting: false,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const badgeColor = callTypes.get(status)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {row.getValue('status')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const { role } = row.original
      const userType = userTypes.find(({ value }) => value === role)

      if (!userType) {
        return null
      }

      return (
        <div className='flex items-center gap-x-2'>
          {userType.icon && (
            <userType.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm capitalize'>{row.getValue('role')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'is_verified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Is verified' />
    ),
    cell: ({ row }) => (
      <div
        className={`${row.getValue('is_verified') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'employee_company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company' />
    ),
    cell: ({ row }) => {
      const { is_our_employee, employee_company } = row.original

      return (
        <div className='flex items-center gap-2'>
          <div
            className={`${is_our_employee ? `bg-green-500` : `bg-destructive`} h-2 w-2 flex-shrink-0 animate-pulse rounded-full`}
          />
          {is_our_employee ? (
            <span className='text-sm font-medium'>Our Employee</span>
          ) : (
            <LongText className='max-w-36 text-sm'>
              {employee_company?.name || '-'}
            </LongText>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'salary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Salary' />
    ),
    cell: ({ row }) => {
      const salary = row.getValue('salary') as number | null | undefined

      if (!salary && salary !== 0) {
        return <div className='text-muted-foreground'>-</div>
      }

      // Format number with spaces for thousands
      const formattedSalary = salary.toLocaleString('en-US').replace(/,/g, ' ')

      return (
        <div className='font-medium'>
          {formattedSalary}{' '}
          <span className='text-muted-foreground text-xs'>UZS</span>
        </div>
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
  },

  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
