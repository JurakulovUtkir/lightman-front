import { useState, useEffect } from 'react'
import { CaretSortIcon, EyeNoneIcon, CheckIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { useNetworkCategories } from '../../categories/data/hooks'

interface FilterOption {
  label: string
  value: string
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  filterOptions?: FilterOption[]
  selectedFilter?: string
  onFilterChange?: (value: string | null) => void
  // New props for searchable filters with data fetching
  searchable?: boolean
  useSearchableCategories?: boolean
}

export function DataTableColumnCategoryHeader<TData, TValue>({
  column,
  title,
  className,
  filterOptions: externalFilterOptions,
  selectedFilter,
  onFilterChange,
  searchable = false,
  useSearchableCategories = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 500)

  // Conditionally fetch categories if searchable categories is enabled
  const shouldFetchCategories = useSearchableCategories && open
  const categoriesQuery = useNetworkCategories({
    offset: 0,
    limit: 20,
    search: shouldFetchCategories ? debouncedSearch : '',
  })

  // Determine filter options source
  const filterOptions = useSearchableCategories
    ? (categoriesQuery.data?.data?.items?.map((cat) => ({
        label: cat.name,
        value: cat.id,
      })) ?? [])
    : (externalFilterOptions ?? [])

  const isLoadingOptions = useSearchableCategories
    ? categoriesQuery.isFetching
    : false

  const hasFilters = filterOptions && filterOptions.length > 0
  const canHide = column.getCanHide()

  // Reset search when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  // If no filtering, just return title
  if (!hasFilters && !searchable) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='data-[state=open]:bg-accent -ml-3 h-8'
          >
            <span>{title}</span>
            {selectedFilter ? (
              <span className='bg-primary text-primary-foreground ml-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px]'>
                1
              </span>
            ) : (
              <CaretSortIcon className='ml-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-[200px]'>
          {(hasFilters || searchable) && onFilterChange && (
            <>
              <DropdownMenuLabel className='text-muted-foreground text-xs font-normal'>
                Filter by categories
              </DropdownMenuLabel>

              {searchable ? (
                <Command shouldFilter={false} className='border-none'>
                  <CommandInput
                    placeholder={`Search ${title.toLowerCase()}...`}
                    className='h-9'
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList className='max-h-[250px]'>
                    {isLoadingOptions ? (
                      <div className='flex items-center justify-center p-4'>
                        <div className='flex items-center gap-2'>
                          <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
                          <span className='text-muted-foreground text-sm'>
                            Searching...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No data found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              onFilterChange(null)
                              setOpen(false)
                            }}
                            className='justify-between'
                          >
                            All
                            {!selectedFilter && (
                              <CheckIcon className='text-primary h-4 w-4' />
                            )}
                          </CommandItem>
                          {filterOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                onFilterChange(option.value)
                                setOpen(false)
                              }}
                              className='justify-between'
                            >
                              {option.label}
                              {selectedFilter === option.value && (
                                <CheckIcon className='text-primary h-4 w-4' />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={() => onFilterChange(null)}
                    className='justify-between'
                  >
                    All
                    {!selectedFilter && (
                      <CheckIcon className='text-primary h-4 w-4' />
                    )}
                  </DropdownMenuItem>
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onFilterChange(option.value)}
                      className='justify-between'
                    >
                      {option.label}
                      {selectedFilter === option.value && (
                        <CheckIcon className='text-primary h-4 w-4' />
                      )}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </>
          )}

          {/* For Hiding */}
          {canHide && (hasFilters || searchable) && <DropdownMenuSeparator />}

          {canHide && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeNoneIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
