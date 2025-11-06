import { useState } from 'react'
import { Control, FieldValues, Path, UseFormSetValue } from 'react-hook-form'
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
import { useNetworkSocials } from '@/features/network/socials/data/hooks'
import { NetworkSocialSchema } from '@/features/network/socials/data/schema'

type ComboboxOption = {
  value: string
  label: string
  category?: string
  type?: string
  buy_price?: string | number
  standard_sell_price?: string | number
  vip_sell_price?: string | number
  no_watermark_sell_price?: string | number
}

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  detail?: Pick<NetworkSocialSchema, 'id' | 'name'>
  categoryId?: string
  socialNetworkTypeId?: string
  disabled?: boolean
  setValue?: UseFormSetValue<T>
  priceType?: 'standard' | 'vip' | 'no_watermark'
}

export const FormComboboxNetworkSocial = <T extends FieldValues>({
  name,
  label,
  control,
  detail,
  categoryId,
  socialNetworkTypeId,
  disabled = false,
  setValue,
  priceType = 'standard',
}: FormComboboxProps<T>) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 500)

  const {
    data: networkSocials,
    isLoading: isLoadingNetworkSocials,
    isFetching: isFetchingNetworkSocials,
  } = useNetworkSocials({
    offset: 0,
    limit: 20,
    search: debouncedSearch,
    category_id: categoryId,
    social_network_type_id: socialNetworkTypeId,
  })

  const isLoading = isLoadingNetworkSocials || isFetchingNetworkSocials

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (isLoading && !debouncedSearch && !open) {
          return (
            <FormItem className='flex w-full flex-col'>
              <FormLabel>{label}</FormLabel>
              <Skeleton className='h-10 w-full' />
              <FormMessage />
            </FormItem>
          )
        }

        let options: ComboboxOption[] =
          networkSocials?.data?.items?.map((social) => ({
            value: social.id,
            label: social.name,
            category: social.category?.name,
            type: social.social_network_type?.name,
            buy_price: social.buy_price,
            standard_sell_price: social.standard_sell_price,
            vip_sell_price: social.vip_sell_price,
            no_watermark_sell_price: social.no_watermark_sell_price,
          })) ?? []

        // Only add detail as fallback if:
        // 1. Detail exists
        // 2. Field has a value
        // 3. The value matches the detail id (prevents stale detail from being used)
        // 4. It's not already in options
        if (
          detail &&
          detail.id &&
          field.value &&
          field.value === detail.id &&
          !options.some((item) => item.value === field.value)
        ) {
          options = [
            ...options,
            {
              value: detail.id,
              label: detail.name,
            },
          ]
        }

        const selectedOption = options.find(
          (item) => item.value === field.value
        )

        // If there's a value but no matching option, show placeholder instead of ID
        const displayLabel =
          field.value && selectedOption ? selectedOption.label : ''

        return (
          <FormItem className='flex w-full flex-col'>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    disabled={disabled}
                    className={cn(
                      'justify-between',
                      !displayLabel && 'text-muted-foreground'
                    )}
                  >
                    {disabled
                      ? 'Select network type first'
                      : displayLabel || `Select ${label.toLowerCase()}`}
                    <IconSelector className='opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='p-0' align='start'>
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
                        <CommandEmpty>No social networks found.</CommandEmpty>
                        <CommandGroup>
                          {options.map((item) => (
                            <CommandItem
                              value={item.label}
                              key={item.value}
                              onSelect={() => {
                                field.onChange(item.value)

                                if (setValue) {
                                  // Set buy_price if it exists
                                  if (item.buy_price) {
                                    const buyPrice =
                                      typeof item.buy_price === 'string'
                                        ? parseFloat(item.buy_price)
                                        : item.buy_price
                                    setValue(
                                      'buy_price' as Path<T>,
                                      buyPrice as T[Path<T>]
                                    )
                                  }

                                  // Set sell_price based on price_type
                                  let sellPrice: number | undefined
                                  if (
                                    priceType === 'standard' &&
                                    item.standard_sell_price
                                  ) {
                                    sellPrice =
                                      typeof item.standard_sell_price ===
                                      'string'
                                        ? parseFloat(item.standard_sell_price)
                                        : item.standard_sell_price
                                  } else if (
                                    priceType === 'vip' &&
                                    item.vip_sell_price
                                  ) {
                                    sellPrice =
                                      typeof item.vip_sell_price === 'string'
                                        ? parseFloat(item.vip_sell_price)
                                        : item.vip_sell_price
                                  } else if (
                                    priceType === 'no_watermark' &&
                                    item.no_watermark_sell_price
                                  ) {
                                    sellPrice =
                                      typeof item.no_watermark_sell_price ===
                                      'string'
                                        ? parseFloat(
                                            item.no_watermark_sell_price
                                          )
                                        : item.no_watermark_sell_price
                                  }

                                  if (sellPrice !== undefined) {
                                    setValue(
                                      'sell_price' as Path<T>,
                                      sellPrice as T[Path<T>]
                                    )
                                  }
                                }

                                setOpen(false)
                              }}
                            >
                              <div className='flex flex-1 flex-col gap-0.5'>
                                <span className='font-medium'>
                                  {item.label}
                                </span>
                                {(item.category || item.type) && (
                                  <span className='text-muted-foreground text-xs'>
                                    {[item.type, item.category]
                                      .filter(Boolean)
                                      .join(' • ')}
                                  </span>
                                )}
                              </div>
                              <IconCheck
                                className={cn(
                                  'ml-auto shrink-0',
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
