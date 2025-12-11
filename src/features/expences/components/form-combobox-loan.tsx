import { useState } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
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
import { useLoans } from '@/features/loans/data/hooks'
import { LoanSchema } from '@/features/loans/data/schema'

type ComboboxOption = {
  value: string
  label: string
  direction?: string
  //   status?: string
  planned_amount?: string
  given_amount?: string
}

interface FormComboboxLoansProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  detail?: Pick<LoanSchema, 'id' | 'counterparty_name'>
  direction?: 'WE_GAVE' | 'WE_TOOK' // Optional filter by direction
  //   status?: 'ACTIVE' | 'CLOSED' // Optional filter by status
}

export const FormComboboxLoans = <T extends FieldValues>({
  name,
  label,
  control,
  detail,
  direction,
  //   status,
}: FormComboboxLoansProps<T>) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const { lang, tForm } = useLang()
  const t = tForm[lang].form_labels

  const {
    data: loansResponse,
    isLoading: isLoadingLoans,
    isFetching: isFetchingLoans,
  } = useLoans({
    offset: 0,
    limit: 50,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    direction,
    // status,
  })

  const isLoading = isLoadingLoans || isFetchingLoans

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

        let options: ComboboxOption[] =
          loansResponse?.data?.data?.map((loan) => ({
            value: loan.id,
            label: loan.counterparty_name,
            direction: loan.direction,
            // status: loan.status,
            planned_amount: loan.planned_amount?.toString(),
            given_amount: loan.given_amount?.toString(),
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
            label: detail.counterparty_name,
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
                            {search.length < 2 ? t.at_least_two : t.no_loans}
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
                                  <div className='text-muted-foreground flex gap-2 text-xs'>
                                    {item.direction && (
                                      <span>
                                        {item.direction === 'WE_GAVE'
                                          ? 'We Gave'
                                          : 'We Took'}
                                      </span>
                                    )}
                                    {/* {item.status && (
                                      <span className='capitalize'>
                                        • {item.status.toLowerCase()}
                                      </span>
                                    )} */}
                                  </div>
                                  {item.planned_amount && (
                                    <span className='text-muted-foreground text-xs'>
                                      Planned:{' '}
                                      {parseFloat(
                                        item.planned_amount
                                      ).toLocaleString()}{' '}
                                      | Given:{' '}
                                      {parseFloat(
                                        item.given_amount || '0'
                                      ).toLocaleString()}
                                    </span>
                                  )}
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
