import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCalendar } from '@tabler/icons-react'
import { toNumber } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { FormatDateToLongString } from '@/components/date-formatter'
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { FormComboboxCompany } from '@/features/projects/components/form-combobox-company'
import { CardsDialogType } from '../context'
import { useCreateCard, useUpdateCard } from '../data/hooks'
import { CardsSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: CardsSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<CardsSchema | null>>
  setOpen?: (str: CardsDialogType | null) => void
}

export function CardMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createCard = useCreateCard()
  const updateCard = useUpdateCard()
  const isUpdate = !!currentRow
  const [openDate, setOpenDate] = useState(false)

  const { lang, tForm, tCard } = useLang()
  const t = tForm[lang]

  const formSchema = useMemo(
    () =>
      z.object({
        name: z
          .string({
            error: t.form_validations.name,
          })
          .min(1, t.form_validations.enter_a_name)
          .max(150, t.form_validations.invalid_name),
        description: z.string().optional(),
        company_id: z
          .string({
            error: t.form_validations.required_field,
          })
          .min(1),
        expiration_date: z
          .date({
            error: t.form_validations.required_field,
          })
          .min(1),
        balance: z.number().min(0, t.form_validations.invalid_value).optional(),
        is_active: z.boolean().optional(),
      }),
    [t]
  )

  type CompanyForm = z.infer<typeof formSchema>

  const form = useForm<CompanyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      balance: toNumber(currentRow?.balance),
    },
  })

  const onSubmit = (values: CompanyForm) => {
    if (isUpdate) {
      updateCard.mutate(
        {
          id: currentRow.id,
          data: values,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createCard.mutate(values, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const handleDelete = () => {
    if (isUpdate && setCurrentRow && setOpen && currentRow) {
      setCurrentRow(currentRow)
      setOpen('delete')
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex max-w-full flex-col sm:max-w-md'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate ? tCard[lang].update_card : tCard[lang].create_card}
          </SheetTitle>
          <SheetDescription>
            {isUpdate ? tCard[lang].update_desc : tCard[lang].create_desc}
            {tCard[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='company-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='is_active'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <FormControl>
                          <Switch
                            defaultChecked
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>{t.form_labels.is_active}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormComboboxCompany
                control={form.control}
                name='company_id'
                label={t.form_labels.company}
                filterOurCompany={true}
                setValue={form.setValue}
                // detail={currentRow?.company ?? undefined}
              />

              <FormFieldWrapper
                control={form.control}
                name='name'
                label={t.form_labels.card_name}
                placeholder={t.form_placeholders.enter_name}
              />

              <FormFieldWrapper
                control={form.control}
                name='balance'
                label={t.form_labels.balance}
                placeholder={t.form_placeholders.enter_balance}
                type='number'
                suffix={t.form_placeholders.uzs}
              />

              <FormField
                control={form.control}
                name='expiration_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-1'>
                    <FormLabel>{t.form_labels.expiration_date}</FormLabel>
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                            onClick={() => setOpenDate(true)}
                          >
                            {field.value ? (
                              <FormatDateToLongString
                                dateString={field.value}
                              />
                            ) : (
                              <span>{t.form_labels.expiration_date}</span>
                            )}
                            <IconCalendar className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setOpenDate(false)
                          }}
                          startMonth={
                            new Date(new Date().getFullYear() - 1, 0, 1)
                          }
                          endMonth={
                            new Date(new Date().getFullYear() + 10, 11, 31)
                          }
                          captionLayout='dropdown'
                          disabled={(date) => {
                            const oneWeekAgo = new Date()
                            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
                            oneWeekAgo.setHours(0, 0, 0, 0)
                            return date < oneWeekAgo
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormFieldWrapper
                control={form.control}
                name='description'
                label={t.form_labels.description}
                placeholder={t.form_placeholders.enter_description}
                type='textarea'
              />
            </form>
          </Form>
        </div>
        <SheetFooter>
          {isUpdate && (
            <Button onClick={handleDelete} size='sm' variant='destructive'>
              {t.buttons.delete}
            </Button>
          )}
          <Button
            disabled={isUpdate ? updateCard.isPending : createCard.isPending}
            form='company-form'
            type='submit'
          >
            {(isUpdate ? updateCard.isPending : createCard.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
