import { ColumnDef } from '@tanstack/react-table'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { formatPrice } from '@/utils/formatPrice'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { NetworkSocialSchema } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<NetworkSocialSchema>[] = [
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
      <div onDoubleClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-0.5'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center space-x-2'>
          <span
            className={`${row.getValue('is_active') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-spin rounded-full`}
          />
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-124'>
            {row.getValue('name')}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  //   Need to add network type and category
  {
    accessorKey: 'link',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Link' />
    ),
    cell: ({ row }) => (
      <div>
        <a
          href={row.getValue('link')}
          target='_blank'
          className='text-primary hover:underline'
        >
          {row.getValue('link')}
        </a>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'subscriber_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subscribers' />
    ),
    cell: ({ row }) => (
      <div>{formatPrice(row.getValue('subscriber_count'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'average_view_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Average views' />
    ),
    cell: ({ row }) => (
      <div>{formatPrice(row.getValue('average_view_count'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'buy_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Buy Price' />
    ),
    cell: ({ row }) => <div>{formatPrice(row.getValue('buy_price'))}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'standard_sell_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Standard Price' />
    ),
    cell: ({ row }) => (
      <div>{formatPrice(row.getValue('standard_sell_price'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'vip_sell_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vip Price' />
    ),
    cell: ({ row }) => <div>{formatPrice(row.getValue('vip_sell_price'))}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'no_watermark_sell_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No Watermark Price' />
    ),
    cell: ({ row }) => (
      <div>{formatPrice(row.getValue('no_watermark_sell_price'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Balance' />
    ),
    cell: ({ row }) => <div>{formatPrice(row.getValue('balance'))}</div>,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Creation date' />
    ),
    cell: ({ row }) => (
      <div>{formatDateToLongString(row.getValue('created_at'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'contact_info',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Contact info' />
    ),
    cell: ({ row }) => {
      const info = row.original.contact_info
      const contactInfo = info
        ? info?.length >= 20
          ? `${info.slice(0, 20)} ...`
          : info
        : '-'

      return (
        <div>
          {info && info?.length >= 20 ? (
            <Tooltip>
              <TooltipTrigger>{contactInfo}</TooltipTrigger>
              <TooltipContent className='max-w-[350px] md:max-w-[500px]'>
                {row.getValue('contact_info')}
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
    cell: ({ row }) => (
      <div onDoubleClick={(e) => e.stopPropagation()}>
        <DataTableRowActions row={row} />
      </div>
    ),
  },
]
