import { useState, useEffect } from 'react'
import { Control, FieldValues, Path, useWatch } from 'react-hook-form'
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
import { useCards } from '@/features/companies/cards/data/hooks'
import { CardsSchema } from '@/features/companies/cards/data/schema'

type ComboboxOption = {
  value: string
  label: string
  balance?: string
  company_id?: string
  companyId?: string
  card_type?: string
}

interface FormComboboxCardsProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  detail?: Pick<CardsSchema, 'id' | 'name'>
  companyId?: string
  paymentTypeField?: Path<T>
}

export const FormComboboxCards = <T extends FieldValues>({
  name,
  label,
  control,
  detail,
  companyId,
  paymentTypeField,
}: FormComboboxCardsProps<T>) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const { lang, tForm } = useLang()
  const t = tForm[lang].form_labels

  const watchedPaymentType = useWatch({
    control,
    name: paymentTypeField as Path<T>,
  }) as 'card' | 'cash' | undefined

  const paymentType = paymentTypeField ? watchedPaymentType : undefined

  const {
    data: cardsResponse,
    isLoading: isLoadingCards,
    isFetching: isFetchingCards,
  } = useCards({
    offset: 0,
    limit: 50,
    company_id: companyId,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    card_type:
      paymentTypeField && paymentType
        ? (paymentType.toLowerCase() as 'card' | 'cash' | undefined)
        : undefined,
  })

  const isLoading = isLoadingCards || isFetchingCards

  useEffect(() => {
    if (paymentType) {
      // Optionally reset the field when payment type changes
      // Uncomment if you want to clear selection on payment type change
      // field.onChange('')
    }
  }, [paymentType])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (isLoading && !open) {
          return (
            <FormItem className='flex w-full flex-col space-y-1'>
              <FormLabel className='max-w-24'>{label}</FormLabel>
              <Skeleton className='h-10 w-full' />
              <FormMessage />
            </FormItem>
          )
        }

        // If paymentTypeField is provided but no payment type is selected, show disabled state
        if (paymentTypeField && !paymentType) {
          return (
            <FormItem className='flex w-full flex-col space-y-1'>
              <FormLabel className='max-w-24'>{label}</FormLabel>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  disabled
                  className='text-muted-foreground justify-between'
                >
                  {t.select_payment_type_first}
                  <IconSelector className='opacity-50' />
                </Button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }

        let options: ComboboxOption[] =
          cardsResponse?.data?.data?.map((card) => ({
            value: card.id,
            label: card.name,
            balance: card.balance.toString(),
            company_id: card.company_id,
            card_type: card.card_type,
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

        // Filter options based on search
        const filteredOptions = search
          ? options.filter((option) =>
              option.label.toLowerCase().includes(search.toLowerCase())
            )
          : options

        return (
          <FormItem className='flex w-full flex-col space-y-1'>
            <FormLabel className='max-w-24'>{label}</FormLabel>
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
                        {filteredOptions.length === 0 && (
                          <CommandEmpty>
                            {search.length < 2 ? t.at_least_two : t.no_cards}
                          </CommandEmpty>
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
                                <div className='flex flex-col gap-0.5'>
                                  <span>{item.label}</span>
                                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                    {item.card_type && (
                                      <>
                                        <span className='capitalize'>
                                          {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            t[item.card_type]
                                          }
                                        </span>
                                      </>
                                    )}
                                    {item.balance && (
                                      <span>
                                        <span>•</span>{' '}
                                        {parseFloat(
                                          item.balance
                                        ).toLocaleString()}{' '}
                                        {t.uzs}
                                      </span>
                                    )}
                                  </div>
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
