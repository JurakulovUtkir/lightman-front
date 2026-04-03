import { ColumnDef } from '@tanstack/react-table'
import {
  getPriceTypeColor,
  getPaymentStatusColor,
  getPaymentTypeColor,
  getStatusColorWithBg,
} from '@/lib/statusHelpers'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/formatPrice'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { ProjectSchema } from '../../data/schema'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<ProjectSchema>[] => [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.project_name} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <div
          className={`${row.original.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
        />
        <LongText className='max-w-36 font-medium'>
          {row.getValue('name')}
        </LongText>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'project_manager',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.project_manager} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <LongText className='max-w-36 font-medium'>
          {row.original.project_manager?.full_name ?? '-'}
        </LongText>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.status} />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof t.statusOptions
      return (
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColorWithBg(status)}`}
        >
          {t.statusOptions[status]}
        </div>
      )
    },
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

  // {
  //   accessorKey: 'category',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Category' />
  //   ),
  //   cell: ({ row }) => {
  //     const category = row.getValue('category') as { name: string }
  //     return (
  //       <div className='bg-secondary inline-flex items-center rounded-md px-2 py-1 text-xs'>
  //         {category?.name || '-'}
  //       </div>
  //     )
  //   },
  //   enableSorting: false,
  // },
  // {
  //   accessorKey: 'tags',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Tags' />
  //   ),
  //   cell: ({ row }) => {
  //     const tags = row.original.tags || []

  //     if (tags.length === 0) {
  //       return (
  //         <div className='text-muted-foreground flex items-center gap-1'>
  //           <IconTag className='h-4 w-4' />
  //           <span className='text-sm'>No tags</span>
  //         </div>
  //       )
  //     }

  //     const firstTag = tags[0]
  //     const remainingTags = tags.slice(1)

  //     if (tags.length === 1) {
  //       return (
  //         <Badge variant='secondary' className='gap-1 text-xs'>
  //           <IconTag className='h-3 w-3' />
  //           {firstTag}
  //         </Badge>
  //       )
  //     }

  //     return (
  //       <div className='flex items-center gap-1'>
  //         <Badge variant='secondary' className='gap-1 text-xs'>
  //           <IconTag className='h-3 w-3' />
  //           {firstTag}
  //         </Badge>
  //         <Tooltip>
  //           <TooltipTrigger asChild>
  //             <Badge variant='outline' className='cursor-help text-xs'>
  //               +{remainingTags.length}
  //             </Badge>
  //           </TooltipTrigger>
  //           <TooltipContent className='max-w-xs'>
  //             <div className='flex flex-wrap gap-1'>
  //               {remainingTags.map((tag) => (
  //                 <Badge
  //                   key={tag}
  //                   variant='secondary'
  //                   className='gap-1 text-xs'
  //                 >
  //                   <IconTag className='h-3 w-3' />
  //                   {tag}
  //                 </Badge>
  //               ))}
  //             </div>
  //           </TooltipContent>
  //         </Tooltip>
  //       </div>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: 'contract',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Contract' />
  //   ),
  //   cell: ({ row }) => {
  //     const contract = row.getValue('contract') as {
  //       contract_number: string
  //       name: string
  //     }
  //     return (
  //       <div className='flex flex-col gap-0.5'>
  //         <span className='text-sm font-medium'>
  //           <LongText className='max-w-36'>
  //             {contract?.contract_number}
  //           </LongText>
  //         </span>
  //         <span className='text-muted-foreground text-xs'>
  //           {contract?.name || ''}
  //         </span>
  //       </div>
  //     )
  //   },
  //   enableSorting: false,
  // },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.price} />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      return (
        <div className='font-medium'>
          {formatPrice(price)} {t.uzs}
        </div>
      )
    },
    enableSorting: false,
  },

  {
    accessorKey: 'payment_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.payment_status} />
    ),
    cell: ({ row }) => {
      const paymentStatus = row.getValue(
        'payment_status'
      ) as keyof typeof t.paymentStatusOptions
      return (
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${getPaymentStatusColor(paymentStatus)}`}
        >
          {t.paymentStatusOptions[paymentStatus]}
        </div>
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
      return (
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${paymentType && getPaymentTypeColor(paymentType)}`}
        >
          {paymentType ? t.paymentTypeOptions[paymentType] : '-'}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'price_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.price_type} />
    ),
    cell: ({ row }) => {
      const priceType = row.getValue(
        'price_type'
      ) as keyof typeof t.priceTypeOptions
      return (
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${priceType && getPriceTypeColor(priceType)}`}
        >
          {priceType ? t.priceTypeOptions[priceType] : '-'}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'is_qqs',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.qqs} />
    ),
    cell: ({ row }) => (
      <div
        className={`${row.getValue('is_qqs') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
      />
    ),
    enableSorting: false,
  },
]
