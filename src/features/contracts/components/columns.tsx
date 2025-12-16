import { ColumnDef } from '@tanstack/react-table'
import { Download, Eye } from 'lucide-react'
import { downloadFile } from '@/lib/helpers'
import { formatPrice } from '@/utils/formatPrice'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CopyButton } from '@/components/copy-button'
import { FormatDateToLongString } from '@/components/date-formatter'
import LongText from '@/components/long-text'
import { ContractSchema } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<ContractSchema>[] => [
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
      <DataTableColumnHeader column={column} title={t.contract_name} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        {' '}
        <div
          className={`${row.original.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
        />
        <LongText className='max-w-36'>{row.getValue('name')}</LongText>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'contract_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.contract_number} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <CopyButton value={row.getValue('contract_number')} />
        <span>{row.getValue('contract_number')}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'our_company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.our_company} />
    ),
    cell: ({ row }) => {
      const company = row.getValue('our_company') as { name: string }
      return <LongText className='max-w-36'>{company?.name}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'customer_company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.customer_company} />
    ),
    cell: ({ row }) => {
      const customer = row.getValue('customer_company') as { name: string }
      return <LongText className='max-w-36'>{customer?.name}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.price} />
    ),
    cell: ({ row }) => {
      const buyPrice = row.original.price ?? 0
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
    accessorKey: 'is_qqs',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.is_vat} />
    ),
    cell: ({ row }) => (
      <div
        className={`${row.getValue('is_qqs') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.file} />
    ),
    cell: ({ row }) => {
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/v1\/?$/, '')
      const file = row.original.file

      if (!file) {
        return (
          <span className='text-muted-foreground text-sm'>{t.no_file}</span>
        )
      }

      const fullUrl = `${base_url}${file}`
      const filename = file.split('/').pop() || 'payment.pdf'

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
  //   {
  //     accessorKey: 'updated_at',
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title={t.updated_at} />
  //     ),
  //     cell: ({ row }) => {
  //       const updatedAt = row.original.updated_at
  //       return (
  //         <div className='whitespace-nowrap'>
  //          <FormatDateToLongString dateString={updatedAt} />
  //         </div>
  //       )
  //     },
  //     enableSorting: true,
  //     enableHiding: false,
  //   },
]
