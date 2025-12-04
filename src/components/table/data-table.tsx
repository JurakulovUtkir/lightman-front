import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ExpandedState,
  getExpandedRowModel,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  offset?: number
  limit?: number
  total: number
  onRowDoubleClick?: (payload: TData) => void
  renderSubComponent?: (row: TData) => React.ReactNode
  enableExpanding?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  offset = 0,
  limit = 10,
  total,
  onRowDoubleClick,
  renderSubComponent,
  enableExpanding = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const { lang, general } = useLang()
  const t = general[lang].columns

  const shouldShowExpandColumn = enableExpanding && renderSubComponent
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(enableExpanding && { expanded }),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...(enableExpanding && { onExpandedChange: setExpanded }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(enableExpanding && { getExpandedRowModel: getExpandedRowModel() }),
    manualPagination: true,
    pageCount: Math.ceil(total / limit),
  })

  return (
    <div className='space-y-4'>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader className='bg-primary-foreground'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {shouldShowExpandColumn && <TableHead className='w-12' />}
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    onDoubleClick={() => onRowDoubleClick?.(row.original)}
                    className='cursor-pointer'
                  >
                    {shouldShowExpandColumn && (
                      <TableCell>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            row.toggleExpanded()
                          }}
                          className='rounded p-1 transition-colors hover:bg-gray-100'
                          aria-label={
                            row.getIsExpanded() ? 'Collapse row' : 'Expand row'
                          }
                        >
                          {row.getIsExpanded() ? (
                            <ChevronDown className='h-4 w-4' />
                          ) : (
                            <ChevronRight className='h-4 w-4' />
                          )}
                        </button>
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {enableExpanding &&
                    row.getIsExpanded() &&
                    renderSubComponent && (
                      <TableRow>
                        <TableCell
                          colSpan={row.getVisibleCells().length + 1}
                          className='p-0'
                        >
                          <div className='border-t'>
                            {renderSubComponent(row.original)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (shouldShowExpandColumn ? 1 : 0)}
                  className='h-24 text-center'
                >
                  {t.no_results}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        offset={offset}
        limit={limit}
        total={total}
      />
    </div>
  )
}
