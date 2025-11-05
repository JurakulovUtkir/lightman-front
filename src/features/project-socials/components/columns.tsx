import { ColumnDef } from '@tanstack/react-table'
import { Download, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { formatPrice } from '@/utils/formatPrice'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ProjectSocialSchema } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
// import { DataTableRowActions } from './data-table-row-actions'
import PaymentStatus from './payment-status'

// Helper function to download file
const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  } catch (_error) {
    toast.error('Failed to download file!')
  }
}

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
      return <div>{social?.name ?? '-'}</div>
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
      return <div>{formatPrice(buyPrice)} UZS</div>
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'sell_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sell price' />
    ),
    cell: ({ row }) => {
      const sellPrice = row.original.sell_price ?? 0
      return <div>{formatPrice(sellPrice)} UZS</div>
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'is_paid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Status' />
    ),
    cell: ({ row }) => {
      const isPaid = row.original.is_paid
      return <PaymentStatus isPaid={isPaid} item={row.original} />
    },
    enableSorting: true,
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

      if (!payment) {
        return <span className='text-muted-foreground text-sm'>No payment</span>
      }

      const fullUrl = `${base_url}${payment}`
      const filename = payment.split('/').pop() || 'payment.pdf'

      return (
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => window.open(fullUrl, '_blank')}
          >
            <Eye className='mr-1 h-4 w-4' />
            View
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => downloadFile(fullUrl, filename)}
          >
            <Download className='mr-1 h-4 w-4' />
            Download
          </Button>
        </div>
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

      if (!screenshot) {
        return (
          <span className='text-muted-foreground text-sm'>No screenshot</span>
        )
      }

      const fullUrl = `${base_url}${screenshot}`
      const filename = screenshot.split('/').pop() || 'screenshot.jpg'

      return (
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => window.open(fullUrl, '_blank')}
          >
            <Eye className='mr-1 h-4 w-4' />
            View
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => downloadFile(fullUrl, filename)}
          >
            <Download className='mr-1 h-4 w-4' />
            Download
          </Button>
        </div>
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
          className='block max-w-[200px] truncate text-blue-500 hover:underline'
        >
          {postLink}
        </a>
      ) : (
        <span className='text-muted-foreground text-sm'>No link</span>
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
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created at' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at
      return (
        <div className='whitespace-nowrap'>
          {formatDateToLongString(createdAt)}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated at' />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at
      return (
        <div className='whitespace-nowrap'>
          {formatDateToLongString(updatedAt)}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
