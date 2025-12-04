import { ColumnDef } from '@tanstack/react-table'
import { IconTag } from '@tabler/icons-react'
import { formatPrice } from '@/utils/formatPrice'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from '@/components/ui/tooltip'
import { NetworkSocialSchema } from '../data/schema'

// import { DataTableColumnCategoryHeader } from './data-table-column-category-header'
// import { DataTableColumnTypeHeader } from './data-table-column-type-header'

export const columns = (
  // selectedCategoryId: string | undefined,
  // onCategoryFilterChange: (categoryId: string | null) => void,
  // selectedTypeId: string | undefined,
  // onTypeFilterChange: (typeId: string | null) => void
  t: (typeof import('@/translations/general.json'))['en']['columns']
): ColumnDef<NetworkSocialSchema>[] => [
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
      <DataTableColumnHeader column={column} title={t.name} />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-2'>
          {' '}
          <div
            className={`${row.original.is_active ? `bg-green-500` : `bg-destructive`} h-2 w-2 animate-pulse rounded-full`}
          />
          <LongText className='max-w-36'>{row.getValue('name')}</LongText>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'social_network_type',
    header: ({ column }) => (
      // <DataTableColumnTypeHeader
      //   column={column}
      //   title='Network type'
      //   selectedFilter={selectedTypeId}
      //   onFilterChange={onTypeFilterChange}
      //   searchable={true}
      //   useSearchableTypes={true}
      // />
      <DataTableColumnHeader column={column} title={t.network_type} />
    ),
    cell: ({ row }) => {
      const type = row.original.social_network_type
      return (
        <div className='flex items-center space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-124'>
            <LongText className='max-w-36'>{type?.name}</LongText>
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      // <DataTableColumnCategoryHeader
      //   column={column}
      //   title='Category'
      //   selectedFilter={selectedCategoryId}
      //   onFilterChange={onCategoryFilterChange}
      //   searchable={true}
      //   useSearchableCategories={true}
      // />
      <DataTableColumnHeader column={column} title={t.category} />
    ),
    cell: ({ row }) => {
      const category = row.original.category
      return (
        <div className='flex items-center space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-124'>
            <LongText className='max-w-36'>{category?.name}</LongText>
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'tags',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.tags} />
    ),
    cell: ({ row }) => {
      const tags = row.original.tags || []

      if (tags.length === 0) {
        return (
          <div className='text-muted-foreground flex items-center gap-1'>
            <IconTag className='h-4 w-4' />
            <span className='text-sm'>{t.no_tags}</span>
          </div>
        )
      }

      const firstTag = tags[0]
      const remainingTags = tags.slice(1)

      if (tags.length === 1) {
        return (
          <Badge variant='secondary' className='gap-1 text-xs'>
            <IconTag className='h-3 w-3' />
            {firstTag}
          </Badge>
        )
      }

      return (
        <div className='flex items-center gap-1'>
          <Badge variant='secondary' className='gap-1 text-xs'>
            <IconTag className='h-3 w-3' />
            {firstTag}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant='outline' className='cursor-help text-xs'>
                +{remainingTags.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className='max-w-xs'>
              <div className='flex flex-wrap gap-1'>
                {remainingTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='gap-1 text-xs'
                  >
                    <IconTag className='h-3 w-3' />
                    {tag}
                  </Badge>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'subscriber_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.subscribers} />
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
      <DataTableColumnHeader column={column} title={t.average_views} />
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
      <DataTableColumnHeader
        column={column}
        title={`${t.buy_price} ${t.uzs}`}
      />
    ),
    cell: ({ row }) => <div>{formatPrice(row.getValue('buy_price'))}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'standard_sell_price',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={`${t.standard_price} ${t.uzs}`}
      />
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
      <DataTableColumnHeader
        column={column}
        title={`${t.vip_price} ${t.uzs}`}
      />
    ),
    cell: ({ row }) => <div>{formatPrice(row.getValue('vip_sell_price'))}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'no_watermark_sell_price',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={`${t.no_watermark_price} ${t.uzs}`}
      />
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
      <DataTableColumnHeader column={column} title={`${t.balance} ${t.uzs}`} />
    ),
    cell: ({ row }) => <div>{formatPrice(row.getValue('balance'))}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'link',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t.link} />
    ),
    cell: ({ row }) => (
      <div>
        <a
          href={row.getValue('link')}
          target='_blank'
          className='text-primary hover:underline'
        >
          <LongText className='max-w-36'>{row.getValue('link')}</LongText>
        </a>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'contact_info',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Contact info' />
  //   ),
  //   cell: ({ row }) => {
  //     const info = row.original.contact_info
  //     const contactInfo = info
  //       ? info?.length >= 20
  //         ? `${info.slice(0, 20)} ...`
  //         : info
  //       : '-'

  //     return (
  //       <div>
  //         {info && info?.length >= 20 ? (
  //           <Tooltip>
  //             <TooltipTrigger>{contactInfo}</TooltipTrigger>
  //             <TooltipContent className='max-w-[350px] md:max-w-[500px]'>
  //               {row.getValue('contact_info')}
  //             </TooltipContent>
  //           </Tooltip>
  //         ) : (
  //           <p>{info?.length ? info : '-'}</p>
  //         )}
  //       </div>
  //     )
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => (
  //     <div onDoubleClick={(e) => e.stopPropagation()}>
  //       <DataTableRowActions row={row} />
  //     </div>
  //   ),
  // },
]
