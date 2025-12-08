import { ColumnDef } from '@tanstack/react-table'
import { formatDateToCustomString } from '@/lib/dateFormatter'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ActionSchema } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<ActionSchema>[] => [
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
    accessorKey: 'tag',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.tags} />
    ),
    cell: ({ row }) => {
      const tag = row.getValue('tag') as string
      return (
        <Badge variant='outline' className='capitalize'>
          {tag}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'method',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.method} />
    ),
    cell: ({ row }) => {
      const method = row.getValue('method') as string
      const methodColors: Record<string, string> = {
        GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        POST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        PATCH:
          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      }
      return (
        <Badge className={methodColors[method] || 'bg-gray-100'}>
          {method}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'path',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.path} />
    ),
    cell: ({ row }) => {
      const path = row.getValue('path') as string
      return (
        <div className='max-w-[300px] truncate font-mono text-xs' title={path}>
          {path}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.status} />
    ),
    cell: ({ row }) => {
      const statusCode = row.getValue('status_code') as number

      let colorClass = 'bg-gray-100 text-gray-800'
      if (statusCode >= 200 && statusCode < 300) {
        colorClass =
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      } else if (statusCode >= 400 && statusCode < 500) {
        colorClass =
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      } else if (statusCode >= 500) {
        colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }

      return <Badge className={colorClass}>{statusCode}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'success',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.success} />
    ),
    cell: ({ row }) => {
      const success = row.getValue('success') as boolean
      return (
        <Badge variant={success ? 'default' : 'destructive'}>
          {success ? '✓' : '✗'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.user} />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      if (!user) {
        return <span className='text-muted-foreground text-sm'>—</span>
      }
      return (
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>{user.full_name}</span>
          <span className='text-muted-foreground text-xs'>
            {user.phone_number}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'ip',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.ip_address} />
    ),
    cell: ({ row }) => {
      const ip = row.getValue('ip') as string
      return <span className='font-mono text-xs'>{ip}</span>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'duration_ms',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.duration} />
    ),
    cell: ({ row }) => {
      const duration = row.getValue('duration_ms') as number

      let colorClass = 'text-green-600'
      if (duration > 100) colorClass = 'text-yellow-600'
      if (duration > 500) colorClass = 'text-orange-600'
      if (duration > 1000) colorClass = 'text-red-600'

      return (
        <span className={`font-mono text-sm ${colorClass}`}>{duration}ms</span>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user_agent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.user_agent} />
    ),
    cell: ({ row }) => {
      const userAgent = row.getValue('user_agent') as string
      const browserMatch = userAgent?.match(
        /(Chrome|Firefox|Safari|Edge)\/[\d.]+/
      )
      const browser = browserMatch ? browserMatch[0] : t.unknown

      return (
        <div
          className='text-muted-foreground max-w-[200px] truncate text-xs'
          title={userAgent}
        >
          {browser}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'error_message',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.error} />
    ),
    cell: ({ row }) => {
      const error = row.getValue('error_message') as string | null
      if (!error) {
        return <span className='text-muted-foreground text-xs'>—</span>
      }
      return (
        <div
          className='max-w-[200px] truncate text-xs text-red-600'
          title={error}
        >
          {error}
        </div>
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
    cell: ({ row }) => {
      const createdAt = row.original.created_at
      return (
        <div className='text-sm whitespace-nowrap'>
          {formatDateToCustomString(createdAt)}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
