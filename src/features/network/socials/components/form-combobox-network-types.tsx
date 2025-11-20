import { useState } from 'react'
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'
import { IconCheck, IconSelector } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
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
import { useNetworkTypes, useCreateNetworkType } from '../../types/data/hooks'
import { NetworkTypeSchema } from '../../types/data/schema'

type ComboboxOption = {
  value: string
  label: string
}

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  detail?: Pick<NetworkTypeSchema, 'id' | 'name'>
  enableCreate?: boolean
}

export const FormComboboxNetworkTypes = <T extends FieldValues>({
  name,
  label,
  control,
  detail,
  enableCreate = false,
}: FormComboboxProps<T>) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const {
    data: networkTypes,
    isLoading: isLoadingNetworkTypes,
    isFetching: isFetchingNetworkTypes,
  } = useNetworkTypes()

  const createNetworkType = useCreateNetworkType()

  const isLoading = isLoadingNetworkTypes || isFetchingNetworkTypes

  const handleCreateType = async (
    typeName: string,
    field: ControllerRenderProps<T, Path<T>>
  ) => {
    if (!enableCreate) return

    setIsCreating(true)
    try {
      const response = await createNetworkType.mutateAsync({
        name: typeName,
        is_active: true,
      })

      // Extract the type from the nested response
      const newType = response.data

      // Set the new type ID as the selected value
      field.onChange(newType.id)
      setSearch('')
      setOpen(false)
    } catch (error) {
      return error
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (isLoading && !open) {
          return (
            <FormItem className='flex w-full flex-col space-y-1'>
              <FormLabel>{label}</FormLabel>
              <Skeleton className='h-10 w-full' />
              <FormMessage />
            </FormItem>
          )
        }

        let options: ComboboxOption[] =
          networkTypes?.data?.map((a) => ({
            value: a.id,
            label: a.name,
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

        // Filter options based on search
        const filteredOptions = search
          ? options.filter((option) =>
              option.label.toLowerCase().includes(search.toLowerCase())
            )
          : options

        const hasExactMatch = options.some(
          (option) => option.label.toLowerCase() === search.toLowerCase()
        )

        const showCreateOption =
          enableCreate && search.length >= 2 && !hasExactMatch && !isLoading

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
              <PopoverContent className='p-0'>
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
                        {filteredOptions.length === 0 && !showCreateOption && (
                          <CommandEmpty>
                            {enableCreate && search.length < 2
                              ? 'Type at least 2 characters to search'
                              : 'No network types found.'}
                          </CommandEmpty>
                        )}
                        {showCreateOption && (
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                handleCreateType(search, field)
                              }}
                              disabled={isCreating}
                              className='bg-muted/50'
                            >
                              <span className='font-medium'>
                                {isCreating
                                  ? 'Creating...'
                                  : `Create "${search}"`}
                              </span>
                            </CommandItem>
                          </CommandGroup>
                        )}
                        {filteredOptions.length > 0 && (
                          <CommandGroup>
                            {filteredOptions.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.label}
                                onSelect={() => {
                                  field.onChange(item.value)
                                  setSearch('')
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
                        )}
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
