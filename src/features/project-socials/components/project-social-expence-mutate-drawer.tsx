import { useState, useMemo, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCalendar } from '@tabler/icons-react'
import { getExpenceTypeOptions, getPaymentTypeOptions } from '@/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  CorporateExpenceType,
  ExpenceType,
  PaymentType,
} from '@/constants/enums'
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
import { FormComboboxCards } from '@/features/expences/components/form-combobox-cards'
import { FormComboboxCompany } from '@/features/expences/components/form-combobox-company'
import { FormComboboxLoans } from '@/features/expences/components/form-combobox-loan'
import { FormComboboxNetworkSocial } from '@/features/expences/components/form-combobox-network-social'
import { FormComboboxUser } from '@/features/expences/components/form-combobox-users'
// import { FormComboboxDeposit } from '@/features/expences/components/form-combobox-deposit'
// import { FormComboboxUser } from '@/features/expences/components/form-combobox-users'
import { useCreateExpence } from '@/features/expences/data/hooks'
import { FormFileUploadField } from '@/features/project-socials/components/form-file-upload'
import {
  useDeleteFile,
  useUpdateProjectSocial,
} from '@/features/project-socials/data/hooks'
// import { FormComboboxProject } from '@/features/projects/components/form-combobox-projects'
import { useDistributions } from '@/features/stakeholder/distributions/data/hooks'
import { ProjectSocialSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ProjectSocialSchema
}

export function ProjectSocialExpenceMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const { lang, general, tExpence, tForm } = useLang()
  const t = tForm[lang]
  const t_general = general[lang].columns

  const [pendingDeleteFile, setPendingDeleteFile] = useState<string | null>(
    null
  )
  const [openDate, setOpenDate] = useState(false)
  const createExpence = useCreateExpence()
  const deleteFile = useDeleteFile()
  const { data: distribution } = useDistributions()
  const updateProjectSocial = useUpdateProjectSocial()

  const formSchema = useMemo(
    () =>
      z.object({
        project_id: z
          .string({
            error: t.form_validations.required_field,
          })
          .optional(),
        expence_type: z.enum(
          [
            ExpenceType.CHANNEL_POST,
            ExpenceType.CHANNEL_DEPOSIT_TOPUP,
            ExpenceType.CHANNEL_POST_FROM_DEPOSIT,
            ExpenceType.SALARY,
            ExpenceType.SALARY_ADVANCE,
            ExpenceType.BONUS,
            ExpenceType.LOAN_GIVEN,
            ExpenceType.LOAN_TAKEN,
            ExpenceType.LOAN_REPAYMENT,
            ExpenceType.COMPANY_TRANSFER,
            ExpenceType.CARD_WITHDRAW,
            ExpenceType.CASH_WITHDRAW,
            ExpenceType.SERVICE_EXPENCE,
            ExpenceType.CLIENT_PAYMENT,
            ExpenceType.FOUNDER_INPUT,
            ExpenceType.OTHER,
          ],
          {
            error: t.form_validations.required_field,
          }
        ),
        payment_type: z
          .enum([
            PaymentType.CARD,
            PaymentType.CASH,
            PaymentType.BANK_TRANSFER,
            PaymentType.DEPOSIT,
          ])
          .optional(),
        company_id: z
          .string({ error: t.form_validations.required_field })
          .optional(),

        to_company_id: z
          .string({ error: t.form_validations.required_field })
          .optional(),
        card_id: z
          .string({ error: t.form_validations.required_field })
          .optional(),
        loan_id: z
          .string({ error: t.form_validations.required_field })
          .optional(),
        social_id: z
          .string({ error: t.form_validations.required_field })
          .optional(),
        founder_id: z
          .string({ error: t.form_validations.required_field })
          .optional(),
        project_social_id: z
          .string({
            error: t.form_validations.required_field,
          })
          .optional(),
        amount: z
          .number({
            error: t.form_validations.amount,
          })
          .min(0, t.form_validations.invalid_value)
          .optional(),
        commission: z
          .number({
            error: t.form_validations.amount,
          })
          .min(0, t.form_validations.invalid_value)
          .optional(),
        counterparty_name: z
          .string({
            error: t.form_validations.required_field,
          })
          .optional(),

        deadline_at: z.date().optional(),

        distribution_id: z
          .string({
            error: t.form_validations.required_field,
          })
          .optional(),
        created_at: z.date().optional(),
        date: z.date().optional(),
        user_id: z.string().optional(),
        deposit_id: z.string().optional(),

        description: z
          .string()
          .max(150, t.form_validations.invalid_description)
          .optional(),
        file_url: z.string().optional(),
      }),
    [t]
  )

  type ExpenceForm = z.infer<typeof formSchema>

  const form = useForm<ExpenceForm>({
    resolver: zodResolver(formSchema),
  })

  const checkExpenceType = form.watch('expence_type')
  const selectedCompanyId = form.watch('company_id')
  const selectedPaymentType = form.watch('payment_type')

  const filteredExpenceTypeOptions = useMemo(() => {
    const allOptions = getExpenceTypeOptions(t_general)

    return allOptions.filter(
      (option) =>
        // option.value === ExpenceType.CHANNEL_POST_FROM_DEPOSIT ||
        option.value === ExpenceType.CHANNEL_POST ||
        option.value === ExpenceType.CHANNEL_DEPOSIT_TOPUP ||
        option.value === ExpenceType.SALARY ||
        option.value === ExpenceType.SALARY_ADVANCE ||
        option.value === ExpenceType.LOAN_GIVEN ||
        option.value === ExpenceType.LOAN_REPAYMENT ||
        option.value === ExpenceType.SERVICE_EXPENCE
    )
  }, [t_general])

  const filteredPaymentTypeOptions = useMemo(() => {
    const allOptions = getPaymentTypeOptions(t_general)
    return allOptions.filter(
      (option) =>
        option.value === PaymentType.CARD ||
        option.value === PaymentType.CASH ||
        option.value === PaymentType.BANK_TRANSFER
    )
  }, [t_general])

  useEffect(() => {
    const currentExpenceType = form.getValues('expence_type')
    const isCurrentValid = filteredExpenceTypeOptions.some(
      (opt) => opt.value === currentExpenceType
    )

    // If current selection is not valid for new type, reset it
    if (currentExpenceType && !isCurrentValid) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue('expence_type', undefined as any)
    }
  }, [filteredExpenceTypeOptions, form])
  ////////////

  const handlePendingDelete = (filePath: string | null) => {
    setPendingDeleteFile(filePath)
  }

  const onSubmit = async (values: ExpenceForm) => {
    if (!currentRow?.id) {
      toast.warning(t.toast.failed_create_expence)
      return
    }
    // If updating and there's a pending file deletion, delete it first
    if (pendingDeleteFile) {
      try {
        await deleteFile.mutateAsync(pendingDeleteFile)
        setPendingDeleteFile(null)
      } catch (_error) {
        toast.error(t.toast.unable_delete_previous)
      }
    }
    createExpence.mutate(
      {
        ...values,
        type: CorporateExpenceType.EXPENCE,
        project_social_id: currentRow?.id,
        project_id: currentRow?.project_id,
      },
      {
        onSuccess: () => {
          // Nested mutation with its own callbacks
          updateProjectSocial.mutate(
            {
              id: currentRow.id,
              data: {
                is_paid: true,
                payment: values.file_url,
              },
            },
            {
              onSuccess: () => {
                onOpenChange(false)
                form.reset()
                setPendingDeleteFile(null)
              },
            }
          )
        },
      }
    )
  }

  const amountOptions = [
    {
      value: 'amount',
      label: t.form_labels.amount,
      palceholder: t.form_placeholders.enter_amount,
    },
    {
      value: 'commission',
      label: t.form_labels.commission,
      palceholder: t.form_placeholders.enter_commission,
    },
  ] as const

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex max-w-full flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-left'>
          <SheetTitle>{tExpence[lang].expence}</SheetTitle>
          <SheetDescription>{tExpence[lang].create_expence}</SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='expence-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <FormFieldSelect
                control={form.control}
                name='expence_type'
                label={t.form_labels.expence_type}
                placeholder={t.form_placeholders.select_type}
                options={filteredExpenceTypeOptions}
              />
              <FormFieldSelect
                control={form.control}
                name='distribution_id'
                label={t.form_labels.distribution}
                placeholder={t.form_placeholders.select_distribution}
                options={
                  distribution?.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })) ?? []
                }
              />
              <FormFieldSelect
                control={form.control}
                name='payment_type'
                label={t.form_labels.payment_type}
                placeholder={t.form_placeholders.select_payment_type}
                options={filteredPaymentTypeOptions}
              />
              {selectedPaymentType === PaymentType.BANK_TRANSFER ? (
                <FormComboboxCompany
                  control={form.control}
                  name='company_id'
                  label={t.form_labels.company}
                  // detail={currentRow?.company ?? undefined}
                  filterOurCompany={true}
                  setValue={form.setValue}
                />
              ) : (
                (selectedPaymentType === PaymentType.CARD ||
                  selectedPaymentType === PaymentType.CASH) && (
                  <FormComboboxCards
                    name='card_id'
                    label={t.form_labels.select_card}
                    control={form.control}
                    companyId={selectedCompanyId}
                    paymentTypeField='payment_type'
                    // detail={currentRow?.card}
                  />
                )
              )}

              {/* ********* OutCome  ********* */}
              {checkExpenceType === ExpenceType.CHANNEL_DEPOSIT_TOPUP && (
                <FormComboboxNetworkSocial
                  control={form.control}
                  name='social_id'
                  label={t.form_labels.social_network}
                  // detail={currentRow?.social ?? undefined}
                  setValue={form.setValue}
                />
              )}
              {checkExpenceType === ExpenceType.SALARY && (
                <>
                  <FormComboboxUser
                    control={form.control}
                    name='user_id'
                    label={t.form_labels.select_user}
                    // detail={currentRow?.user ?? undefined}
                  />
                </>
              )}
              {checkExpenceType === ExpenceType.SALARY_ADVANCE && (
                <FormComboboxUser
                  control={form.control}
                  name='user_id'
                  label={t.form_labels.select_user}
                  // detail={currentRow?.user ?? undefined}
                />
              )}
              {checkExpenceType === ExpenceType.LOAN_GIVEN && (
                <>
                  <FormFieldWrapper
                    control={form.control}
                    name='counterparty_name'
                    label={t.form_labels.counterparty_name}
                    placeholder={t.form_placeholders.enter_name}
                  />
                  <FormField
                    control={form.control}
                    name='deadline_at'
                    render={({ field }) => (
                      <FormItem className='flex flex-col space-y-1'>
                        <FormLabel>{t.form_labels.deadline_at}</FormLabel>
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
                                  <span>{t.form_labels.deadline_at}</span>
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
                </>
              )}
              {checkExpenceType === ExpenceType.LOAN_REPAYMENT && (
                <FormComboboxLoans
                  control={form.control}
                  name='loan_id'
                  label={t.form_labels.loan}
                  direction='WE_TOOK'
                  // detail={currentRow?.loan ?? undefined}
                />
              )}
              {checkExpenceType === ExpenceType.SERVICE_EXPENCE && (
                <>
                  <FormFieldWrapper
                    control={form.control}
                    name='counterparty_name'
                    label={t.form_labels.counterparty_name}
                    placeholder={t.form_placeholders.enter_name}
                  />
                </>
              )}
              {amountOptions.map((item) => (
                <FormFieldWrapper
                  control={form.control}
                  name={item.value}
                  label={item.label}
                  placeholder={item.palceholder}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />
              ))}

              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-1'>
                    <FormLabel>{t.form_labels.date}</FormLabel>
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
                              <span>{t.form_labels.date}</span>
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

              <FormFileUploadField
                control={form.control}
                name='file_url'
                label={t.form_labels.file}
                maxSize={5}
                onPendingDelete={handlePendingDelete}
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
          <Button
            disabled={createExpence.isPending}
            form='expence-form'
            type='submit'
          >
            {createExpence.isPending
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
