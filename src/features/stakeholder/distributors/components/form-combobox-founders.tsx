import { useState } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
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
import { useFounders } from '../../founders/data/hooks'
import { FounderSchema } from '../../founders/data/schema'

type ComboboxOption = {
  value: string
  label: string
}

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  detail?: FounderSchema
  excludeFounderIds?: string[] // IDs of founders that should be excluded from the list
}

export const FormComboboxFounders = <T extends FieldValues>({
  name,
  label,
  control,
  detail,
  excludeFounderIds = [],
}: FormComboboxProps<T>) => {
  const [open, setOpen] = useState(false)
  const { lang, tForm } = useLang()
  const t = tForm[lang].form_labels
  const {
    data: founders,
    isLoading: isLoadingFounders,
    isFetching: isFetchingFounders,
  } = useFounders()

  const isLoading = isLoadingFounders || isFetchingFounders

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (isLoading && !open) {
          return (
            <FormItem className='flex w-full flex-col space-y-1'>
              <FormLabel className='max-w-40'>{label}</FormLabel>
              <Skeleton className='h-10 w-full' />
              <FormMessage />
            </FormItem>
          )
        }

        // Filter out founders that are already assigned (unless it's the current selection)
        const availableFounders =
          founders?.data?.filter(
            (founder) =>
              !excludeFounderIds.includes(founder.id) ||
              founder.id === field.value
          ) ?? []

        let options: ComboboxOption[] = availableFounders.map((a) => ({
          value: a.id,
          label: a.name,
        }))

        // Handle fallback from detail (for update case)
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
              <PopoverContent className='p-0'>
                <Command>
                  <CommandInput placeholder={t.search_value} className='h-9' />
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
                        <CommandEmpty>
                          {options.length === 0
                            ? t.founders_assigned
                            : t.no_data}
                        </CommandEmpty>
                        <CommandGroup>
                          {options.map((item) => (
                            <CommandItem
                              key={item.value}
                              value={item.label}
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
