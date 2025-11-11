import { ColumnDef } from '@tanstack/react-table'
import { Download, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { formatDateToLongString } from '@/lib/dateFormatter'
import { formatPrice } from '@/utils/formatPrice'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CopyButton } from '@/components/copy-button'
import { ContractSchema } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'

// import PaymentStatus from './payment-status'

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

export const columns: ColumnDef<ContractSchema>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Is Active' />
    ),
    cell: ({ row }) => (
      <div
        className={`${row.getValue('is_active') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'contract_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Contract number' />
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'our_company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Our company' />
    ),
    cell: ({ row }) => <div>{row.original.our_company.name ?? '-'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'customer_company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer company' />
    ),
    cell: ({ row }) => <div>{row.original.customer_company.name ?? '-'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const buyPrice = row.original.price ?? 0
      return <div>{formatPrice(buyPrice)} UZS</div>
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'is_qqs',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Is QQS' />
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
      <DataTableColumnHeader column={column} title='File' />
    ),
    cell: ({ row }) => {
      const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/v1\/?$/, '')
      const file = row.original.file

      if (!file) {
        return <span className='text-muted-foreground text-sm'>No File</span>
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
              <TooltipContent className='max-w-[350px] overflow-auto md:max-w-[500px]'>
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
    enableSorting: false,
    enableHiding: false,
  },
  //   {
  //     accessorKey: 'updated_at',
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title='Updated at' />
  //     ),
  //     cell: ({ row }) => {
  //       const updatedAt = row.original.updated_at
  //       return (
  //         <div className='whitespace-nowrap'>
  //           {formatDateToLongString(updatedAt)}
  //         </div>
  //       )
  //     },
  //     enableSorting: true,
  //     enableHiding: false,
  //   },
]
