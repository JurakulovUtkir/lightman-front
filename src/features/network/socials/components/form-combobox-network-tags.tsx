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
import { useNetworkTags, useCreateNetworkTag } from '../../tags/data/hooks'

interface FormComboboxProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  enableCreate?: boolean
}

export const FormComboboxNetworkTags = <T extends FieldValues>({
  name,
  label,
  control,
  enableCreate = false,
}: FormComboboxProps<T>) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { lang, tForm } = useLang()
  const t = tForm[lang].form_labels

  const {
    data: tagsResponse,
    isLoading: isLoadingTags,
    isFetching: isFetchingTags,
  } = useNetworkTags({
    offset: 0,
    limit: 100,
    search: search.length >= 2 ? search : undefined,
  })

  const createNetworkTag = useCreateNetworkTag()

  const isLoading = isLoadingTags || isFetchingTags

  const handleCreateTag = async (
    tagName: string,
    field: ControllerRenderProps<T, Path<T>>
  ) => {
    if (!enableCreate) return

    setIsCreating(true)
    try {
      const response = await createNetworkTag.mutateAsync({
        name: tagName,
        is_active: true,
      })

      // Extract the tag from the nested response
      const newTag = response.data

      // Add the new tag name to the selected values
      const currentValues = (field.value || []) as string[]

      field.onChange([...currentValues, newTag.name])
      setSearch('')
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
        const tags = tagsResponse?.data?.items || []
        const selectedTags = (field.value || []) as string[]

        const availableTags = tags.filter(
          (tag) => !selectedTags.includes(tag.name)
        )

        const hasExactMatch = tags.some(
          (tag) => tag.name.toLowerCase() === search.toLowerCase()
        )

        const showCreateOption =
          enableCreate && search.length >= 2 && !hasExactMatch && !isLoading

        return (
          <FormItem className='flex w-full flex-col space-y-1'>
            <FormLabel className='max-w-20'>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'h-auto min-h-10 justify-between hover:bg-transparent',
                      !selectedTags.length && 'text-muted-foreground'
                    )}
                  >
                    <div className='flex flex-wrap gap-1'>
                      {selectedTags.length > 0 ? (
                        selectedTags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='gap-1'
                            onClick={(e) => {
                              e.stopPropagation()
                              const newValues = selectedTags.filter(
                                (t: string) => t !== tag
                              )
                              field.onChange(newValues)
                            }}
                          >
                            {tag}
                            <IconX className='h-3 w-3' />
                          </Badge>
                        ))
                      ) : (
                        <span>{t.select_tags}</span>
                      )}
                    </div>
                    <IconSelector className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-(--radix-popover-trigger-width) p-0'>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={t.search_tags}
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
                        {availableTags.length === 0 && !showCreateOption && (
                          <CommandEmpty>
                            {enableCreate && search.length < 2
                              ? t.at_least_two
                              : t.no_tags}
                          </CommandEmpty>
                        )}
                        {showCreateOption && (
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                handleCreateTag(search, field)
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
                        {availableTags.length > 0 && (
                          <CommandGroup>
                            {availableTags.map((tag) => (
                              <CommandItem
                                key={tag.id}
                                value={tag.name}
                                onSelect={() => {
                                  const newValues = [...selectedTags, tag.name]
                                  field.onChange(newValues)
                                  setSearch('')
                                }}
                              >
                                {tag.name}
                                <IconCheck
                                  className={cn(
                                    'ml-auto',
                                    selectedTags.includes(tag.name)
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
