import { useState } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { IconCheck, IconSelector } from '@tabler/icons-react'
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '../../projects/data/hooks'
import { ProjectSchema } from '../../projects/data/schema'

type ComboboxOption = {
  value: string
  label: string
}

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  detail?: Pick<ProjectSchema, 'id' | 'name'>
}

export const FormComboboxProject = <T extends FieldValues>({
  name,
  label,
  control,
  detail,
}: FormComboboxProps<T>) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 500)

  const {
    data: projects,
    isLoading: isLoadingProjects,
    isFetching: isFetchingProjects,
  } = useProjects({
    offset: 0,
    limit: 20,
    search: debouncedSearch,
  })

  // Determine if we're currently loading or fetching
  const isLoading = isLoadingProjects || isFetchingProjects

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Show skeleton only on initial load, not during search
        if (isLoading && !debouncedSearch && !open) {
          return (
            <FormItem className='flex w-full flex-col space-y-1'>
              <FormLabel>{label}</FormLabel>
              <Skeleton className='h-10 w-full' />
              <FormMessage />
            </FormItem>
          )
        }

        let options: ComboboxOption[] =
          projects?.data?.items?.map((project) => ({
            value: project.id,
            label: project.name,
          })) ?? []

        // Handle fallback from detail
        if (
          detail &&
          detail.id &&
          field.value &&
          !options.some((item) => item.value === field.value)
        ) {
          const fallbackOption: ComboboxOption = {
            value: detail.id,
            label: detail.name,
          }

          if (!options.some((opt) => opt.value === fallbackOption.value)) {
            options = [...options, fallbackOption]
          }
        }

        const selectedOption = options.find(
          (item) => item.value === field.value
        )
        const displayLabel =
          selectedOption?.label ??
          (field.value ? `Selected ID: ${field.value}` : '')

        return (
          <FormItem className='flex w-full flex-col space-y-1'>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value
                      ? displayLabel
                      : `Select ${label.toLowerCase()}`}
                    <IconSelector className='opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='max-w-[400px] p-0'>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                    className='h-9'
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    {isLoading ? (
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
                        <CommandEmpty>No project found.</CommandEmpty>
                        <CommandGroup>
                          {options.map((item) => (
                            <CommandItem
                              value={item.label}
                              key={item.value}
                              onSelect={() => {
                                field.onChange(item.value)
                                setOpen(false)
                              }}
                            >
                              {item.label}
                              <IconCheck
                                className={cn(
                                  'ml-auto',
                                  item.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
