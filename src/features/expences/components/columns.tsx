import { ColumnDef } from '@tanstack/react-table'
import { Download, Eye } from 'lucide-react'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { downloadFile } from '@/lib/helpers'
import {
  formatExpenceType,
  formatPaymentType,
  getExpenceTypeColor,
  getPaymentTypeColor,
} from '@/lib/statusHelpers'
import { formatPrice } from '@/utils/formatPrice'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { ExpenceSchema } from '../data/schema'

export const columns: ColumnDef<ExpenceSchema>[] = [
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
    accessorKey: 'project',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project' />
    ),
    cell: ({ row }) => {
      const project = row.getValue('project') as { name: string } | undefined
      return <LongText className='max-w-36'>{project?.name || '-'}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => {
      const user = row.getValue('user') as { full_name: string } | undefined
      return <LongText className='max-w-36'>{user?.full_name || '-'}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company' />
    ),
    cell: ({ row }) => {
      const company = row.getValue('company') as { name: string } | undefined
      return <LongText className='max-w-36'>{company?.name || '-'}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'distribution',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Distribution' />
    ),
    cell: ({ row }) => {
      const distribution = row.getValue('distribution') as
        | { name: string }
        | undefined
      return (
        <LongText className='max-w-28'>{distribution?.name || '-'}</LongText>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      return (
        <LongText className='max-w-48'>
          {row.getValue('description') ?? '-'}
        </LongText>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'expence_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Expence Type' />
    ),
    cell: ({ row }) => {
      const expenceType = row.getValue('expence_type') as string
      return (
        <Badge variant='outline' className={getExpenceTypeColor(expenceType)}>
          {formatExpenceType(expenceType)}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'payment_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Type' />
    ),
    cell: ({ row }) => {
      const paymentType = row.getValue('payment_type') as string
      if (!paymentType)
        return <span className='text-muted-foreground text-sm'>-</span>
      return (
        <Badge variant='outline' className={getPaymentTypeColor(paymentType)}>
          {formatPaymentType(paymentType)}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount ?? 0
      return <div className='font-medium'>{formatPrice(amount)} UZS</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'file_url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='File' />
    ),
    cell: ({ row }) => {
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/v1\/?$/, '')
      const file = row.original.file_url

      if (!file) {
        return <span className='text-muted-foreground text-sm'>No File</span>
      }

      const fullUrl = `${base_url}${file}`
      const filename = file.split('/').pop() || 'expence.pdf'

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
  },
]
