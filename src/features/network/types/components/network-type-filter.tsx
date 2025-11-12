import { useState } from 'react'
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
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
import { useNetworkTypes } from '../../types/data/hooks'

interface FilterOption {
  label: string
  value: string
}

interface NetworkTypeFilterProps {
  placeholder?: string
  filterOptions?: FilterOption[]
  selectedFilter?: string
  onFilterChange?: (value: string | null) => void
  searchable?: boolean
  useSearchableTypes?: boolean
  className?: string
}

export function NetworkTypeFilter({
  placeholder = 'Search...',
  filterOptions: externalFilterOptions,
  selectedFilter,
  onFilterChange,
  searchable = false,
  useSearchableTypes = false,
  className,
}: NetworkTypeFilterProps) {
  const [open, setOpen] = useState(false)

  // Fetch network types if searchable types is enabled
  const typesQuery = useNetworkTypes()

  // Determine filter options source
  const filterOptions = useSearchableTypes
    ? (typesQuery.data?.data?.map((type) => ({
        label: type.name,
        value: type.id,
      })) ?? [])
    : (externalFilterOptions ?? [])

  const isLoadingOptions = useSearchableTypes
    ? typesQuery.isLoading || typesQuery.isFetching
    : false

  //   const hasFilters = filterOptions && filterOptions.length > 0

  // Find selected option label
  const selectedLabel = filterOptions.find(
    (opt) => opt.value === selectedFilter
  )?.label

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
              <span className='text-muted-foreground'>
                Filter by network type
              </span>
            )}
            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 sm:w-[230px]' align='start'>
          {searchable ? (
            <Command shouldFilter={true}>
              <CommandInput placeholder={placeholder} className='h-9' />
              <CommandList className='max-h-[250px]'>
                {isLoadingOptions ? (
                  <div className='flex items-center justify-center p-4'>
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
                      <span className='text-muted-foreground text-sm'>
                        Loading...
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
