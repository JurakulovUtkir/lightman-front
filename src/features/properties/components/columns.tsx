import { ColumnDef } from '@tanstack/react-table'
import {
  getPropertyStatusColor,
  getPropertyCategoryColor,
} from '@/lib/statusHelpers'
import { formatPrice } from '@/utils/formatPrice'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { FormatDateToLongString } from '@/components/date-formatter'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { PropertySchema } from '../data/schema'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<PropertySchema>[] => [
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
      <DataTableColumnHeader column={column} title={t.property_name} />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-4'>
          <div
            className={`${row.original.is_active ? 'bg-green-500' : 'bg-destructive'} h-2 w-2 animate-pulse rounded-full`}
          />
          <LongText className='max-w-36'>{row.getValue('name')}</LongText>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.company} />
    ),
    cell: ({ row }) => {
      const company = row.original.company
      return <LongText className='max-w-36'>{company.name ?? '-'}</LongText>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.status} />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as
        | keyof typeof t.propertyStatus
        | null

      if (!status) {
        return <span className='text-muted-foreground text-sm'>-</span>
      }

      return (
        <Badge variant='outline' className={getPropertyStatusColor(status)}>
          {t.propertyStatus[status]}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.category} />
    ),
    cell: ({ row }) => {
      const category = row.getValue('category') as
        | keyof typeof t.propertyCategory
        | null

      if (!category) {
        return <span className='text-muted-foreground text-sm'>-</span>
      }

      return (
        <Badge variant='outline' className={getPropertyCategoryColor(category)}>
          {t.propertyCategory[category]}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.count} />
    ),
    cell: ({ row }) => {
      const count = row.original.count ?? 0
      return <div className='font-medium'>{formatPrice(count)}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.price} />
    ),
    cell: ({ row }) => {
      const price = row.original.price ?? 0
      return (
        <div className='font-medium'>
          {formatPrice(price)} {t.uzs}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'current_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.current_price} />
    ),
    cell: ({ row }) => {
      const current_price = row.original.current_price ?? 0
      return (
        <div className='font-medium'>
          {formatPrice(current_price)} {t.uzs}
        </div>
      )
    },
    enableSorting: true,
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
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>
        <FormatDateToLongString dateString={row.getValue('created_at')} />
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.updated_at} />
    ),
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>
        <FormatDateToLongString dateString={row.getValue('updated_at')} />
      </div>
    ),
    enableSorting: true,
  },
]
