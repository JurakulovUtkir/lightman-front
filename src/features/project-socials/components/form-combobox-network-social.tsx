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
import { useNetworkSocials } from '@/features/network/socials/data/hooks'
import { NetworkSocialSchema } from '@/features/network/socials/data/schema'

type ComboboxOption = {
  value: string
  label: string
  category?: string
  type?: string
}

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  detail?: Pick<NetworkSocialSchema, 'id' | 'name'>
  categoryId?: string
  socialNetworkTypeId?: string
}

export const FormComboboxNetworkSocial = <T extends FieldValues>({
  name,
  label,
  control,
  detail,
  categoryId,
  socialNetworkTypeId,
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

  // Determine if we're currently loading or fetching
  const isLoading = isLoadingNetworkSocials || isFetchingNetworkSocials

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Show skeleton only on initial load, not during search
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

        // Need to fix while searching
        const displayLabel =
          selectedOption?.label ??
          (field.value ? `Selected ID: ${field.value}` : '')

        return (
          <FormItem className='flex w-full flex-col'>
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
