import { useState, useEffect } from 'react'
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

interface FilterOption {
  label: string
  value: string
}

interface SelectFilterProps {
  placeholder?: string
  filterOptions: FilterOption[]
  selectedFilter?: string
  onFilterChange?: (value: string | null) => void
  searchable?: boolean
  emptyText?: string
  className?: string
}

export function EnumFilter({
  placeholder = 'Select option...',
  filterOptions,
  selectedFilter,
  onFilterChange,
  searchable = false,
  emptyText = 'No data found.',
  className,
}: SelectFilterProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  // Client-side search filtering
  const filteredOptions = searchable
    ? filterOptions.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : filterOptions

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
            className='w-full justify-between sm:w-[365px]'
          >
            {selectedLabel || (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 sm:w-[365px]' align='start'>
          {searchable ? (
            <Command shouldFilter={false}>
              <CommandInput
                placeholder='Search...'
                className='h-9'
                value={search}
                onValueChange={setSearch}
              />
              <CommandList className='max-h-[250px]'>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option) => (
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
          ) : (
            <Command>
              <CommandList>
                <CommandGroup>
                  {filteredOptions.map((option) => (
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
