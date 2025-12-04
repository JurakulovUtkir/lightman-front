import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/formatPrice'
import { Checkbox } from '@/components/ui/checkbox'
import { CopyButton } from '@/components/copy-button'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { CompanySchema } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const columns = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<CompanySchema>[] => [
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
      <DataTableColumnHeader column={column} title={t.company_name} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        {' '}
        <div
          className={`${row.original.is_our_company ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
        />
        <LongText className='max-w-36'>{row.getValue('name')}</LongText>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.address} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('address')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'bank',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.bank} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('bank')}</LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'stir',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.stir} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <CopyButton value={row.getValue('stir')} />
        <span>{row.getValue('stir')}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'mfo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.mfo} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <CopyButton value={row.getValue('mfo')} />
        <span>{row.getValue('mfo')}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'account_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.account_number} />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <CopyButton value={row.getValue('account_number')} />
        <span>{row.getValue('account_number')}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.balance} />
    ),
    cell: ({ row }) => (
      <div>
        {formatPrice(row.getValue('balance'))} {t.uzs}
      </div>
    ),
    enableSorting: false,
  },
  // {
  //   accessorKey: 'is_our_company',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Is our company' />
  //   ),
  //   cell: ({ row }) => (
  //     <div
  //       className={`${row.getValue('is_our_company') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
  //     />
  //   ),
  //   enableSorting: false,
  // },
  {
    accessorKey: 'is_vip',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.is_vip} />
    ),
    cell: ({ row }) => (
      <div
        className={`${row.getValue('is_vip') ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
      />
    ),
    enableSorting: false,
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
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
