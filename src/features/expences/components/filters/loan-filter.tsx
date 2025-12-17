import { useState, useEffect } from 'react'
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
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
import { useLoans } from '@/features/loans/data/hooks'

interface LoanFilterProps {
  placeholder?: string
  selectedFilter?: string
  onFilterChange?: (value: string | null) => void
  searchable?: boolean
  className?: string
  fieldsWidth?: number
}

export function LoanFilter({
  placeholder = 'Search...',
  selectedFilter,
  onFilterChange,
  searchable = false,
  className,
  fieldsWidth = 365,
}: LoanFilterProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const { lang, tForm } = useLang()
  const t = tForm[lang]

  const { data: loansResponse, isLoading } = useLoans({
    offset: 0,
    limit: 20,
  })

  const allOptions =
    loansResponse?.data.data?.map((loan) => ({
      label: `${loan.counterparty_name} - ${loan.direction === 'WE_GAVE' ? 'We Gave' : 'We Received'} `,
      value: loan.id,
      counterpartyName: loan.counterparty_name,
    })) ?? []

  const filterOptions = searchable
    ? allOptions.filter((option) =>
        option.counterpartyName.toLowerCase().includes(search.toLowerCase())
      )
    : allOptions

  const selectedLabel = allOptions.find(
    (opt) => opt.value === selectedFilter
  )?.label

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
            className='w-full justify-between'
            style={{ width: fieldsWidth }}
          >
            {selectedLabel || (
              <span className='text-muted-foreground'>
                {t.form_labels.filter_loan}
              </span>
            )}
            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style={{ width: fieldsWidth }}
          className='w-full p-0'
          align='start'
        >
          {searchable ? (
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={placeholder}
                className='h-9'
                value={search}
                onValueChange={setSearch}
              />
              <CommandList className='max-h-[250px]'>
                {isLoading ? (
                  <div className='flex items-center justify-center p-4'>
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
                      <span className='text-muted-foreground text-sm'>
                        {t.form_labels.loading}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <CommandEmpty>{t.form_labels.no_data}</CommandEmpty>
                    <CommandGroup>
                      {filterOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
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
                            {t.form_labels.clear_filter}
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
                {isLoading ? (
                  <div className='flex items-center justify-center p-4'>
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
                      <span className='text-muted-foreground text-sm'>
                        {t.form_labels.loading}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <CommandGroup>
                      {filterOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
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
                            {t.form_labels.clear_filter}
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
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
