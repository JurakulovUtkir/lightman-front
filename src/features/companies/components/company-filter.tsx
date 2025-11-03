import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'

interface CompanyFilterProps {
  onFilterChange: (filters: {
    is_active?: boolean
    is_our_company?: boolean
    is_vip?: boolean
  }) => void
}

const filterGroups = [
  {
    title: 'Status',
    key: 'is_active' as const,
    options: [
      { label: 'Active', value: 'true' },
      { label: 'Inactive', value: 'false' },
    ],
  },
  {
    title: 'Company Type',
    key: 'is_our_company' as const,
    options: [{ label: 'Our Company', value: 'true' }],
  },
  {
    title: 'VIP Status',
    key: 'is_vip' as const,
    options: [{ label: 'Is VIP', value: 'true' }],
  },
]

export function CompanyFilter({ onFilterChange }: CompanyFilterProps) {
  const [selectedFilters, setSelectedFilters] = React.useState<{
    is_active?: string[]
    is_our_company?: string[]
    is_vip?: string[]
  }>({})

  const totalSelected = Object.values(selectedFilters).reduce(
    (acc, filters) => acc + (filters?.length || 0),
    0
  )

  const handleSelect = (groupKey: string, value: string) => {
    const currentValues =
      selectedFilters[groupKey as keyof typeof selectedFilters] || []
    const newSet = new Set(currentValues)

    if (newSet.has(value)) {
      newSet.delete(value)
    } else {
      newSet.clear() // For boolean filters, only one value at a time
      newSet.add(value)
    }

    const newFilters = {
      ...selectedFilters,
      [groupKey]: newSet.size > 0 ? Array.from(newSet) : undefined,
    }

    setSelectedFilters(newFilters)

    // Convert to boolean for API
    const apiFilters = {
      is_active:
        newFilters.is_active?.[0] === 'true'
          ? true
          : newFilters.is_active?.[0] === 'false'
            ? false
            : undefined,
      is_our_company:
        newFilters.is_our_company?.[0] === 'true'
          ? true
          : newFilters.is_our_company?.[0] === 'false'
            ? false
            : undefined,
      is_vip:
        newFilters.is_vip?.[0] === 'true'
          ? true
          : newFilters.is_vip?.[0] === 'false'
            ? false
            : undefined,
    }

    onFilterChange(apiFilters)
  }

  const handleClear = () => {
    setSelectedFilters({
      is_active: undefined,
      is_our_company: undefined,
      is_vip: undefined,
    })
    onFilterChange({
      is_active: undefined,
      is_our_company: undefined,
      is_vip: undefined,
    })
  }

  const getSelectedLabels = () => {
    const labels: string[] = []
    filterGroups.forEach((group) => {
      const selectedValues = selectedFilters[group.key] || []
      selectedValues.forEach((value) => {
        const option = group.options.find((opt) => opt.value === value)
        if (option) {
          labels.push(option.label)
        }
      })
    })
    return labels
  }

  const selectedLabels = getSelectedLabels()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          Filters
          {totalSelected > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {totalSelected}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {totalSelected > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {totalSelected} selected
                  </Badge>
                ) : (
                  selectedLabels.map((label, index) => (
                    <Badge
                      variant='secondary'
                      key={index}
                      className='rounded-sm px-1 font-normal'
                    >
                      {label}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[250px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search filters...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {filterGroups.map((group, groupIndex) => (
              <React.Fragment key={group.key}>
                <CommandGroup heading={group.title}>
                  {group.options.map((option) => {
                    const isSelected = (
                      selectedFilters[group.key] || []
                    ).includes(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleSelect(group.key, option.value)}
                      >
                        <div
                          className={cn(
                            'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className={cn('h-4 w-4')} />
                        </div>
                        {/* {option.icon && (
                          <option.icon className='text-muted-foreground mr-2 h-4 w-4' />
                        )} */}
                        <span>{option.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {groupIndex < filterGroups.length - 1 && <CommandSeparator />}
              </React.Fragment>
            ))}
            {totalSelected > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
