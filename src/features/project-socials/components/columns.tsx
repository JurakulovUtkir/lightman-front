import { ColumnDef } from '@tanstack/react-table'
import { Download, Eye } from 'lucide-react'
import { downloadFile } from '@/lib/helpers'
import { formatPrice } from '@/utils/formatPrice'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormatDateToLongString } from '@/components/date-formatter'
import LongText from '@/components/long-text'
import { ProjectSocialSchema } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import PaymentStatus from './payment-status'

export const columns = (
  t: (typeof import('@/translations/general.json'))['uz']['columns']
): ColumnDef<ProjectSocialSchema>[] => [
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
      <DataTableColumnHeader column={column} title={t.social} />
    ),
    cell: ({ row }) => {
      const social = row.original.social
      return <LongText className='max-w-36'>{social?.name}</LongText>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'buy_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.buy_price} />
    ),
    cell: ({ row }) => {
      const buyPrice = row.original.buy_price ?? 0
      return (
        <div>
          {formatPrice(buyPrice)} {t.uzs}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'sell_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.sell_price} />
    ),
    cell: ({ row }) => {
      const sellPrice = row.original.sell_price ?? 0
      return (
        <div>
          {formatPrice(sellPrice)} {t.uzs}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'is_paid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.payment_status} />
    ),
    cell: ({ row }) => {
      const isPaid = row.original.is_paid
      return <PaymentStatus isPaid={isPaid} item={row.original} t={t} />
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'payment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.payment} />
    ),
    cell: ({ row }) => {
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/v1\/?$/, '')
      const payment = row.original.payment

      if (!payment) {
        return (
          <span className='text-muted-foreground text-sm'>{t.no_payment}</span>
        )
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
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => downloadFile(fullUrl, filename)}
          >
            <Download className='h-4 w-4' />
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
      <DataTableColumnHeader column={column} title={t.screenshot} />
    ),
    cell: ({ row }) => {
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/v1\/?$/, '')
      const screenshot = row.original.post_screenshot

      if (!screenshot) {
        return (
          <span className='text-muted-foreground text-sm'>
            {t.no_screenshot}
          </span>
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
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => downloadFile(fullUrl, filename)}
          >
            <Download className='h-4 w-4' />
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
      <DataTableColumnHeader column={column} title={t.post_link} />
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
        <span className='text-muted-foreground text-sm'>{t.no_link}</span>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'post_views',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.post_views} />
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
      <DataTableColumnHeader column={column} title={t.created_at} />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at
      return (
        <div className='whitespace-nowrap'>
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
      const updatedAt = row.original.updated_at
      return (
        <div className='whitespace-nowrap'>
          <FormatDateToLongString dateString={updatedAt} />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
