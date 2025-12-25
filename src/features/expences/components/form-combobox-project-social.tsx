import { useState, useEffect } from 'react'
import {
  Control,
  FieldValues,
  Path,
  useWatch,
  UseFormSetValue,
} from 'react-hook-form'
import { IconCheck, IconSelector } from '@tabler/icons-react'
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
import { useProjectSocials } from '../../project-socials/data/hooks'
import { ProjectSocialSchema } from '../../project-socials/data/schema'

type ComboboxOption = {
  value: string
  label: string
  createdAt: string
  buyPrice: number
}

interface FormComboboxProjectSocialProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  projectIdField: Path<T>
  amountField: Path<T>
  setValue: UseFormSetValue<T>
  detail?: Pick<ProjectSocialSchema, 'id' | 'social' | 'created_at'>
  isPaid?: boolean
}

export const FormComboboxProjectSocial = <T extends FieldValues>({
  name,
  label,
  control,
  projectIdField,
  amountField,
  setValue,
  detail,
  isPaid = false,
}: FormComboboxProjectSocialProps<T>) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const { lang, tForm } = useLang()
  const t = tForm[lang].form_labels

  const projectId = useWatch({
    control,
    name: projectIdField,
  })

  const {
    data: projectSocials,
    isLoading: isLoadingProjectSocials,
    isFetching: isFetchingProjectSocials,
  } = useProjectSocials({
    projectId,
    isPaid,
  })

  const isLoading = isLoadingProjectSocials || isFetchingProjectSocials

  useEffect(() => {
    if (projectId) {
      // Optionally reset the field when project changes
      // Uncomment if you want to clear selection on project change
      // field.onChange('')
    }
  }, [projectId])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Show skeleton only on initial load
        if (isLoading && !open) {
          return (
            <FormItem className='flex w-full flex-col space-y-1'>
              <FormLabel className='max-w-40'>{label}</FormLabel>
              <Skeleton className='h-10 w-full' />
              <FormMessage />
            </FormItem>
          )
        }

        // If no project is selected, show disabled state
        if (!projectId) {
          return (
            <FormItem className='flex w-full flex-col space-y-1'>
              <FormLabel className='max-w-40'>{label}</FormLabel>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  disabled
                  className='text-muted-foreground justify-between'
                >
                  {t.select_project_first}
                  <IconSelector className='opacity-50' />
                </Button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }

        let options: ComboboxOption[] =
          projectSocials?.data?.map((projectSocial) => ({
            value: projectSocial.id,
            label: projectSocial.social.name,
            createdAt: new Date(projectSocial.created_at).toLocaleDateString(),
            buyPrice: projectSocial.buy_price,
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
            label: detail.social.name,
            createdAt: new Date(detail.created_at).toLocaleDateString(),
            buyPrice: 0, // Default value if not available in detail
          }

          if (!options.some((opt) => opt.value === fallbackOption.value)) {
            options = [...options, fallbackOption]
          }
        }

        // Filter options based on search
        const filteredOptions = search
          ? options.filter((option) =>
              option.label.toLowerCase().includes(search.toLowerCase())
            )
          : options

        const selectedOption = options.find(
          (item) => item.value === field.value
        )
        const displayLabel =
          selectedOption?.label ??
          (field.value ? `${t.selected_id} ${field.value}` : '')

        return (
          <FormItem className='flex w-full flex-col space-y-1'>
            <FormLabel className='max-w-40'>{label}</FormLabel>
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
              <PopoverContent className='max-w-[400px] p-0'>
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
                        <CommandEmpty>{t.no_project_social_found}</CommandEmpty>
                        <CommandGroup>
                          {filteredOptions.map((item) => (
                            <CommandItem
                              value={item.value}
                              key={item.value}
                              onSelect={() => {
                                field.onChange(item.value)
                                // Set the buy_price to the amount field
                                setValue(
                                  amountField,
                                  item.buyPrice as T[Path<T>]
                                )
                                setOpen(false)
                              }}
                            >
                              <div className='flex flex-col'>
                                <span>{item.label}</span>
                                <span className='text-muted-foreground text-xs'>
                                  {item.createdAt}
                                </span>
                              </div>
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
