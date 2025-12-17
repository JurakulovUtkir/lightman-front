import { ColumnDef } from '@tanstack/react-table'
import {
  getExpenceOriginTypeColor,
  getExpenceTypeColor,
  getPaymentTypeColor,
} from '@/lib/statusHelpers'
import { formatPrice } from '@/utils/formatPrice'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { FormatDateToLongString } from '@/components/date-formatter'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { ExpenceSchema } from '@/features/expences/data/schema'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<ExpenceSchema>[] => [
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
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.type} />
    ),
    cell: ({ row }) => {
      const expenceOriginType = row.getValue(
        'type'
      ) as keyof typeof t.expenceOriginTypeOptions
      return (
        <Badge
          variant='outline'
          className={getExpenceOriginTypeColor(expenceOriginType)}
        >
          {t.expenceOriginTypeOptions[expenceOriginType]}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'expence_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.expence_type} />
    ),
    cell: ({ row }) => {
      const expenceType = row.getValue(
        'expence_type'
      ) as keyof typeof t.expenceTypeOptions
      return (
        <Badge variant='outline' className={getExpenceTypeColor(expenceType)}>
          {t.expenceTypeOptions[expenceType]}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'distribution',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.distribution} />
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
    accessorKey: 'payment_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.payment_type} />
    ),
    cell: ({ row }) => {
      const paymentType = row.getValue(
        'payment_type'
      ) as keyof typeof t.paymentTypeOptions
      if (!paymentType)
        return <span className='text-muted-foreground text-sm'>-</span>
      return (
        <Badge variant='outline' className={getPaymentTypeColor(paymentType)}>
          {t.paymentTypeOptions[paymentType]}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.amount} />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount ?? 0
      return (
        <div className='font-medium'>
          {formatPrice(amount)} {t.uzs}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'commission',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.commission} />
    ),
    cell: ({ row }) => {
      const commission = row.original.commission ?? 0
      return (
        <div className='font-medium'>
          {formatPrice(commission)} {t.uzs}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'project',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.project} />
    ),
    cell: ({ row }) => {
      const project = row.getValue('project') as { name: string } | undefined
      return <LongText className='max-w-36'>{project?.name || '-'}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.company} />
    ),
    cell: ({ row }) => {
      const company = row.getValue('company') as { name: string } | undefined
      return <LongText className='max-w-36'>{company?.name || '-'}</LongText>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.user} />
    ),
    cell: ({ row }) => {
      const user = row.getValue('user') as { full_name: string } | undefined
      return <LongText className='max-w-36'>{user?.full_name || '-'}</LongText>
    },
    enableSorting: false,
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
    enableSorting: true,
  },
]

// {
//   accessorKey: 'file_url',
//   header: ({ column }) => (
//     <DataTableColumnHeader column={column} title={t.file} />
//   ),
//   cell: ({ row }) => {
//     const base_url = import.meta.env.VITE_API_BASE_URL.replace(/\/v1\/?$/, '')
//     const file = row.original.file_url

//     if (!file) {
//       return (
//         <span className='text-muted-foreground text-sm'>{t.no_file}</span>
//       )
//     }

//     const fullUrl = `${base_url}${file}`
//     const filename = file.split('/').pop() || 'expence.pdf'

//     return (
//       <div className='flex items-center gap-2'>
//         <Button
//           variant='outline'
//           size='sm'
//           onClick={() => window.open(fullUrl, '_blank')}
//         >
//           <Eye className='h-4 w-4' />
//         </Button>
//         <Button
//           variant='outline'
//           size='sm'
//           onClick={() => downloadFile(fullUrl, filename)}
//         >
//           <Download className='h-4 w-4' />
//         </Button>
//       </div>
//     )
//   },
//   enableSorting: false,
// },
// {
//   accessorKey: 'description',
//   header: ({ column }) => (
//     <DataTableColumnHeader column={column} title={t.description} />
//   ),
//   cell: ({ row }) => {
//     return (
//       <LongText className='max-w-48'>
//         {row.getValue('description') ?? '-'}
//       </LongText>
//     )
//   },
//   enableSorting: false,
// },
