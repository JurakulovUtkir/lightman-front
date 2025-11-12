import { useState, useEffect } from 'react'
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
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
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useNetworkCategories } from '../../categories/data/hooks'

interface FilterOption {
  label: string
  value: string
}

interface NetworkCategoryFilterProps {
  placeholder?: string
  filterOptions?: FilterOption[]
  selectedFilter?: string
  onFilterChange?: (value: string | null) => void
  searchable?: boolean
  useSearchableCategories?: boolean
  className?: string
}

export function NetworkCategoryFilter({
  placeholder = 'Search...',
  filterOptions: externalFilterOptions,
  selectedFilter,
  onFilterChange,
  searchable = false,
  useSearchableCategories = false,
  className,
}: NetworkCategoryFilterProps) {
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

  //   const hasFilters = filterOptions && filterOptions.length > 0

  // Find selected option label
  const selectedLabel = filterOptions.find(
    (opt) => opt.value === selectedFilter
  )?.label

  // Reset search when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between sm:w-[230px]'
          >
            {selectedLabel || (
              <span className='text-muted-foreground'>Filter by category</span>
            )}
            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 sm:w-[230px]' align='start'>
          {searchable ? (
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={placeholder}
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
                      {filterOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => {
                            onFilterChange?.(option.value)
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
                    {selectedFilter && (
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              onFilterChange?.(null)
                              setOpen(false)
                            }}
                            className='text-muted-foreground justify-center'
                          >
                            <Cross2Icon className='mr-2 h-3.5 w-3.5' />
                            Clear filter
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </>
                )}
              </CommandList>
            </Command>
          ) : (
            <Command>
              <CommandList>
                <CommandGroup>
                  {filterOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onFilterChange?.(option.value)
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
                {selectedFilter && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          onFilterChange?.(null)
                          setOpen(false)
                        }}
                        className='text-muted-foreground justify-center'
                      >
                        <Cross2Icon className='mr-2 h-3.5 w-3.5' />
                        Clear filter
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
