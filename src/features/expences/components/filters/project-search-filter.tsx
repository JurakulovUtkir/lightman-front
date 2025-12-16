import { useState, useEffect } from 'react'
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
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
import LongText from '@/components/long-text'
import { useProjects } from '@/features/projects/data/hooks'

interface ProjectFilterProps {
  placeholder?: string
  selectedFilter?: string
  onFilterChange?: (value: string | null) => void
  searchable?: boolean
  useSearchableProjects?: boolean
  className?: string
  fieldsWidth?: number
}

export const ProjectSearchFilter = ({
  placeholder = 'Search...',
  selectedFilter,
  onFilterChange,
  searchable = false,
  useSearchableProjects = false,
  className,
  fieldsWidth = 365,
}: ProjectFilterProps) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 500)
  const { lang, tForm } = useLang()
  const t = tForm[lang]
  // Conditionally fetch projects if searchable projects is enabled
  const shouldFetchProjects = useSearchableProjects && open
  const projectsQuery = useProjects({
    offset: 0,
    limit: 20,
    search: shouldFetchProjects ? debouncedSearch : '',
  })

  // Determine filter options source
  const filterOptions =
    projectsQuery.data?.data?.items?.map((project) => ({
      label: project.name,
      value: project.id,
    })) ?? []

  const isLoadingOptions = useSearchableProjects
    ? projectsQuery.isFetching
    : false

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
            style={{ width: fieldsWidth }}
            className='w-full justify-between'
          >
            {selectedLabel ? (
              selectedLabel.length >= 50 ? (
                <LongText className='max-w-36'>{selectedLabel}</LongText>
              ) : (
                selectedLabel
              )
            ) : (
              <span className='text-muted-foreground'>
                {t.form_labels.filter_by_project}
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
                {isLoadingOptions ? (
                  <div className='flex items-center justify-center p-4'>
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900'></div>
                      <span className='text-muted-foreground text-sm'>
                        {t.form_labels.searching}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <CommandEmpty> {t.form_labels.no_data}</CommandEmpty>
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
                          {option.label.length >= 50 ? (
                            <LongText className='max-w-36'>
                              {option.label}
                            </LongText>
                          ) : (
                            option.label
                          )}
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
                      {option.label.length >= 50 ? (
                        <LongText className='max-w-36'>{option.label}</LongText>
                      ) : (
                        option.label
                      )}
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
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
