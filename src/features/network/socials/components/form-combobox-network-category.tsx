import { useState } from 'react'
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'
import { IconCheck, IconSelector } from '@tabler/icons-react'
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
import {
  useNetworkCategories,
  useCreateNetworkCategory,
} from '../../categories/data/hooks'
import { NetworkCategorySchema } from '../../categories/data/schema'

type ComboboxOption = {
  value: string
  label: string
}

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  detail?: Pick<NetworkCategorySchema, 'id' | 'name'>
  enableCreate?: boolean
}

export const FormComboboxNetworkCategory = <T extends FieldValues>({
  name,
  label,
  control,
  detail,
  enableCreate = false,
}: FormComboboxProps<T>) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const debouncedSearch = useDebounce(search, 500)
  const { lang, tForm } = useLang()
  const t = tForm[lang].form_labels

  const {
    data: networkCategories,
    isLoading: isLoadingNetworkCategories,
    isFetching: isFetchingNetworkCategories,
  } = useNetworkCategories({
    offset: 0,
    limit: 20,
    search: debouncedSearch,
  })

  const createNetworkCategory = useCreateNetworkCategory()

  const isLoading = isLoadingNetworkCategories || isFetchingNetworkCategories

  const handleCreateCategory = async (
    categoryName: string,
    field: ControllerRenderProps<T, Path<T>>
  ) => {
    if (!enableCreate) return

    setIsCreating(true)
    try {
      const response = await createNetworkCategory.mutateAsync({
        name: categoryName,
        is_active: true,
      })

      // Extract the category from the nested response
      const newCategory = response.data

      // Set the new category ID as the selected value
      field.onChange(newCategory.id)
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
        // Show skeleton only on initial load, not during search
        if (isLoading && !debouncedSearch && !open) {
          return (
            <FormItem className='flex w-full flex-col space-y-1'>
              <FormLabel className='max-w-32'>{label}</FormLabel>
              <Skeleton className='h-10 w-full' />
              <FormMessage />
            </FormItem>
          )
        }

        let options: ComboboxOption[] =
          networkCategories?.data?.items?.map((a) => ({
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
          (field.value ? `${t.selected_id} ${field.value}` : '')

        const hasExactMatch = options.some(
          (option) => option.label.toLowerCase() === search.toLowerCase()
        )

        const showCreateOption =
          enableCreate && search.length >= 2 && !hasExactMatch && !isLoading

        return (
          <FormItem className='flex w-full flex-col space-y-1'>
            <FormLabel className='max-w-32'>{label}</FormLabel>
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
                    {field.value ? displayLabel : t.select_value}
                    <IconSelector className='opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='p-0'>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={t.search_value}
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
                            {t.searching}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {options.length === 0 && !showCreateOption && (
                          <CommandEmpty>
                            {enableCreate && search.length < 2
                              ? t.at_least_two
                              : t.no_categories}
                          </CommandEmpty>
                        )}
                        {showCreateOption && (
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                handleCreateCategory(search, field)
                              }}
                              disabled={isCreating}
                              className='bg-muted/50'
                            >
                              <span className='font-medium'>
                                {isCreating
                                  ? t.creating
                                  : `${t.create} "${search}"`}
                              </span>
                            </CommandItem>
                          </CommandGroup>
                        )}
                        {options.length > 0 && (
                          <CommandGroup>
                            {options.map((item) => (
                              <CommandItem
                                value={item.label}
                                key={item.value}
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
