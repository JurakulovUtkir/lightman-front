import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCalendar } from '@tabler/icons-react'
import { getDirectionOptions } from '@/constants'
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
import { FormatDateToLongString } from '@/components/date-formatter'
import { FormFieldSelect } from '@/components/form-field-select'
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { LoanDialogType } from '../context'
import { useCreateLoan, useUpdateLoan } from '../data/hooks'
import { LoanSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: LoanSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<LoanSchema | null>>
  setOpen?: (str: LoanDialogType | null) => void
}

export function LoanMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createLoan = useCreateLoan()
  const updateLoan = useUpdateLoan()
  const isUpdate = !!currentRow

  // Separate state for each date popover
  const [openStartDate, setOpenStartDate] = useState(false)
  const [openDueDate, setOpenDueDate] = useState(false)
  const [openClosedDate, setOpenClosedDate] = useState(false)

  const { lang, tForm, tLoan, general } = useLang()
  const t = tForm[lang]
  const t_general = general[lang].columns

  const formSchema = useMemo(
    () =>
      z.object({
        direction: z.enum(['WE_GAVE', 'WE_TOOK'], {
          error: t.form_validations.direction,
        }),
        counterparty_name: z
          .string({
            error: t.form_validations.counterparty,
          })
          .min(1, t.form_validations.enter_a_counterparty)
          .max(150, t.form_validations.invalid_counterparty),
        planned_amount: z.number().min(0, t.form_validations.invalid_value),
        given_amount: z.number().min(0, t.form_validations.invalid_value),
        start_date: z.date({
          error: t.form_validations.required_field,
        }),
        due_date: z.date({
          error: t.form_validations.required_field,
        }),
        closed_date: z.date().optional(),
        status: z.enum(['ACTIVE', 'CLOSED', 'OVERDUE', 'CANCELLED']).optional(),
        note: z.string().optional(),
      }),
    [t]
  )

  type LoanForm = z.infer<typeof formSchema>

  const form = useForm<LoanForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      status: 'ACTIVE',
      planned_amount: toNumber(currentRow?.planned_amount),
      given_amount: toNumber(currentRow?.given_amount),
      start_date: currentRow?.start_date
        ? new Date(currentRow.start_date)
        : undefined,
      due_date: currentRow?.due_date
        ? new Date(currentRow.due_date)
        : undefined,
      closed_date: currentRow?.closed_date
        ? new Date(currentRow.closed_date)
        : undefined,
    },
  })

  const onSubmit = (values: LoanForm) => {
    if (isUpdate) {
      updateLoan.mutate(
        {
          id: currentRow.id,
          data: {
            ...values,
            planned_amount: values.planned_amount.toString(),
            given_amount: values.given_amount.toString(),
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createLoan.mutate(
        {
          ...values,
          planned_amount: values.planned_amount.toString(),
          given_amount: values.given_amount.toString(),
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    }
  }

  const handleDelete = () => {
    if (isUpdate && setCurrentRow && setOpen && currentRow) {
      setCurrentRow(currentRow)
      setOpen('delete')
    }
  }

  // Map each date field to its own state handler
  const formDates = [
    {
      value: 'start_date' as const,
      label: t.form_labels.start_date,
      open: openStartDate,
      setOpen: setOpenStartDate,
    },
    {
      value: 'due_date' as const,
      label: t.form_labels.due_date,
      open: openDueDate,
      setOpen: setOpenDueDate,
    },
    {
      value: 'closed_date' as const,
      label: t.form_labels.closed_date,
      open: openClosedDate,
      setOpen: setOpenClosedDate,
    },
  ]

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
            {isUpdate ? tLoan[lang].update_loan : tLoan[lang].create_loan}
          </SheetTitle>
          <SheetDescription>
            {isUpdate ? tLoan[lang].update_desc : tLoan[lang].create_desc}
            {tLoan[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='loan-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <FormFieldSelect
                control={form.control}
                name='direction'
                label={t.form_labels.direction}
                placeholder={t.form_placeholders.select_direction}
                options={getDirectionOptions(t_general)}
              />
              <FormFieldWrapper
                control={form.control}
                name='counterparty_name'
                label={t.form_labels.counterparty}
                placeholder={t.form_placeholders.enter_counterparty}
              />

              <FormFieldWrapper
                control={form.control}
                name='planned_amount'
                label={t.form_labels.planned_amount}
                placeholder={t.form_placeholders.enter_planned_amount}
                type='number'
                suffix={t.form_placeholders.uzs}
              />
              <FormFieldWrapper
                control={form.control}
                name='given_amount'
                label={t.form_labels.given_amount}
                placeholder={t.form_placeholders.enter_given_amount}
                type='number'
                suffix={t.form_placeholders.uzs}
              />

              {formDates.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name={item.value}
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-1'>
                      <FormLabel>{item.label}</FormLabel>
                      <Popover open={item.open} onOpenChange={item.setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                <FormatDateToLongString
                                  dateString={field.value}
                                />
                              ) : (
                                <span>{item.label}</span>
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
                              item.setOpen(false)
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
              ))}

              <FormFieldWrapper
                control={form.control}
                name='note'
                label={t.form_labels.notes}
                placeholder={t.form_placeholders.add_your_notes}
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
            disabled={isUpdate ? updateLoan.isPending : createLoan.isPending}
            form='loan-form'
            type='submit'
          >
            {(isUpdate ? updateLoan.isPending : createLoan.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
