import { ColumnDef } from '@tanstack/react-table'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { Checkbox } from '@/components/ui/checkbox'
import { ProjectSocialSchema } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<ProjectSocialSchema>[] = [
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
    accessorKey: 'social',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Social' />
    ),
    cell: ({ row }) => {
      const social = row.original.social
      return <div>{social.name ?? '-'}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'buy_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Buy price' />
    ),
    cell: ({ row }) => {
      const buyPrice = row.original.buy_price ?? 0
      return <div>{buyPrice.toLocaleString()} UZS</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'sell_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sell price' />
    ),
    cell: ({ row }) => {
      const sellPrice = row.original.sell_price ?? 0
      return <div>{sellPrice.toLocaleString()} UZS</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'is_paid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Is Paid' />
    ),
    cell: ({ row }) => {
      const isPaid = row.original.is_paid
      return (
        <div className='flex items-center gap-2'>
          <div
            className={`${isPaid ? 'bg-green-500' : 'bg-destructive'} h-2 w-2 animate-pulse rounded-full`}
          />
          <span className='text-muted-foreground text-sm'>
            {isPaid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'payment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment' />
    ),
    cell: ({ row }) => {
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/v1\/?$/, '')
      const payment = row.original.payment
      return payment ? (
        <a
          href={`${base_url}${payment}`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 hover:underline'
        >
          View Payment
        </a>
      ) : (
        <span className='text-muted-foreground'>No payment</span>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'post_screenshot',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Screenshot' />
    ),
    cell: ({ row }) => {
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/v1\/?$/, '')
      const screenshot = row.original.post_screenshot
      return screenshot ? (
        <a
          href={`${base_url}${screenshot}`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 hover:underline'
        >
          View Screenshot
        </a>
      ) : (
        <span className='text-muted-foreground'>No screenshot</span>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'post_link',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Post Link' />
    ),
    cell: ({ row }) => {
      const postLink = row.original.post_link
      return postLink ? (
        <a
          href={postLink}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 hover:underline'
        >
          View Post
        </a>
      ) : (
        <span className='text-muted-foreground'>No link</span>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'post_views',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Post views' />
    ),
    cell: ({ row }) => {
      const postViews = row.original.post_views ?? 0
      return <div>{postViews.toLocaleString()}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created at' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at
      return <div>{formatDateToLongString(createdAt)}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated at' />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at
      return <div>{formatDateToLongString(updatedAt)}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
