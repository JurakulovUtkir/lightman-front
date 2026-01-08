import { useState } from 'react'
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'
import { IconCheck, IconSelector, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { Badge } from '@/components/ui/badge'
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
import { Switch } from '@/components/ui/switch'
import {
  useCreateNetworkCategory,
  useNetworkCategories,
} from '@/features/network/categories/data/hooks'

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  enableCreate?: boolean
  disabled?: boolean
  withSwitch?: boolean
}

export const FormComboboxCategories = <T extends FieldValues>({
  name,
  label,
  control,
  enableCreate = false,
  disabled = false,
  withSwitch = false,
}: FormComboboxProps<T>) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [switchEnabled, setSwitchEnabled] = useState(false)
  const { lang, tForm } = useLang()
  const t = tForm[lang].form_labels

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
    isFetching: isFetchingCategories,
  } = useNetworkCategories({
    offset: 0,
    limit: 100,
    search: search.length >= 2 ? search : undefined,
  })

  const createNetworkCategory = useCreateNetworkCategory()

  const isLoading = isLoadingCategories || isFetchingCategories

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

      // Add the new category ID to the selected values
      const currentValues = (field.value || []) as string[]

      field.onChange([...currentValues, newCategory.id])
      setSearch('')
    } catch (error) {
      return error
    } finally {
      setIsCreating(false)
    }
  }

  // Determine if button should be disabled
  const isButtonDisabled = withSwitch ? !switchEnabled : disabled

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const categories = categoriesResponse?.data?.items || []
        const selectedCategoryIds = (field.value || []) as string[]

        // Get selected category objects for display
        const selectedCategories = categories.filter((cat) =>
          selectedCategoryIds.includes(cat.id)
        )

        // Get available categories (not yet selected)
        const availableCategories = categories.filter(
          (cat) => !selectedCategoryIds.includes(cat.id)
        )

        const hasExactMatch = categories.some(
          (cat) => cat.name.toLowerCase() === search.toLowerCase()
        )

        const showCreateOption =
          enableCreate && search.length >= 2 && !hasExactMatch && !isLoading

        return (
          <FormItem className='flex w-full flex-col space-y-1'>
            <div className='flex items-center gap-4'>
              <FormLabel className='max-w-20'>{label}</FormLabel>
              {withSwitch && (
                <Switch
                  checked={switchEnabled}
                  onCheckedChange={setSwitchEnabled}
                />
              )}
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={isButtonDisabled}
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'h-auto min-h-10 justify-between hover:bg-transparent',
                      !selectedCategoryIds.length && 'text-muted-foreground'
                    )}
                  >
                    <div className='flex flex-wrap gap-1'>
                      {selectedCategories.length > 0 ? (
                        selectedCategories.map((category) => (
                          <Badge
                            key={category.id}
                            variant='secondary'
                            className='gap-1'
                            onClick={(e) => {
                              e.stopPropagation()
                              const newValues = selectedCategoryIds.filter(
                                (id: string) => id !== category.id
                              )
                              field.onChange(newValues)
                            }}
                          >
                            {category.name}
                            <IconX className='h-3 w-3' />
                          </Badge>
                        ))
                      ) : (
                        <span>{t.select_categories}</span>
                      )}
                    </div>
                    <IconSelector className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-(--radix-popover-trigger-width) p-0'>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={t.search_categories}
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
                        {availableCategories.length === 0 &&
                          !showCreateOption && (
                            <CommandEmpty>
                              {enableCreate && search.length < 2
                                ? t.at_least_two
                                : t.no_categories || 'No categories found.'}
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
                        {availableCategories.length > 0 && (
                          <CommandGroup>
                            {availableCategories.map((category) => (
                              <CommandItem
                                key={category.id}
                                value={category.name}
                                onSelect={() => {
                                  const newValues = [
                                    ...selectedCategoryIds,
                                    category.id,
                                  ]
                                  field.onChange(newValues)
                                  setSearch('')
                                }}
                              >
                                {category.name}
                                <IconCheck
                                  className={cn(
                                    'ml-auto',
                                    selectedCategoryIds.includes(category.id)
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
