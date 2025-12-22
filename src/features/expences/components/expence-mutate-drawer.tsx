import { useState, useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCalendar } from '@tabler/icons-react'
import {
  getExpenceOriginTypeOptions,
  getExpenceTypeOptions,
  getPaymentTypeOptions,
} from '@/constants'
import { toast } from 'sonner'
import { toNumber } from '@/lib/helpers'
import { getExpenceOriginTypeColor } from '@/lib/statusHelpers'
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
import { FormFileUploadField } from '@/features/project-socials/components/form-file-upload'
import { useDeleteFile } from '@/features/project-socials/data/hooks'
import { FormComboboxFounders } from '@/features/stakeholder/distributors/components/form-combobox-founders'
import { ExpenceDialogType } from '../context'
import { useCreateExpence, useUpdateExpence } from '../data/hooks'
import { ExpenceSchema } from '../data/schema'
import { FormComboboxCards } from './form-combobox-cards'
import { FormComboboxCompany } from './form-combobox-company'
import { FormComboboxLoans } from './form-combobox-loan'
import { FormComboboxNetworkSocial } from './form-combobox-network-social'
import { FormComboboxProjectSocial } from './form-combobox-project-social'
import { FormComboboxProject } from './form-combobox-projects'
import { FormComboboxUser } from './form-combobox-users'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ExpenceSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<ExpenceSchema | null>>
  setOpen?: (str: ExpenceDialogType | null) => void
}

export function ExpenceMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const { lang, tForm, tExpence, general } = useLang()
  const t = tForm[lang]
  const t_general = general[lang].columns

  const expenceOriginTypeOptions = getExpenceOriginTypeOptions(t_general)

  const [pendingDeleteFile, setPendingDeleteFile] = useState<string | null>(
    null
  )
  const [openDate, setOpenDate] = useState(false)
  const createExpence = useCreateExpence()
  const updateExpence = useUpdateExpence()
  const deleteFile = useDeleteFile()

  const isUpdate = !!currentRow

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
        type: z.enum(
          [
            CorporateExpenceType.EXPENCE,
            CorporateExpenceType.INCOME,
            CorporateExpenceType.TRANSFER,
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
    defaultValues: {
      ...currentRow,
      expence_type: currentRow?.expence_type ?? undefined,
      amount: toNumber(currentRow?.amount),
      commission: toNumber(currentRow?.amount) ?? 0,
      description: currentRow?.description ?? undefined,
      user_id: currentRow?.user?.id ?? undefined,
      file_url: currentRow?.file_url ?? undefined,
      created_at: currentRow?.created_at
        ? new Date(currentRow.created_at)
        : undefined,
      deadline_at: currentRow?.deadline_at
        ? new Date(currentRow.deadline_at)
        : undefined,
      date: currentRow?.date ? new Date(currentRow.date) : undefined,
    },
  })

  const selectedType = form.watch('type')
  const checkExpenceType = form.watch('expence_type')
  const selectedCompanyId = form.watch('company_id')
  const selectedPaymentType = form.watch('payment_type')

  // Reset checkExpenceType whenever selectedType changes
  useEffect(() => {
    form.reset({
      type: selectedType,
    })
  }, [selectedType, form])

  const filteredExpenceTypeOptions = useMemo(() => {
    const allOptions = getExpenceTypeOptions(t_general)
    // If type is TRANSFER, only show COMPANY_TRANSFER and CARD_WITHDRAW
    if (selectedType === CorporateExpenceType.TRANSFER) {
      return allOptions.filter(
        (option) =>
          option.value === ExpenceType.COMPANY_TRANSFER ||
          option.value === ExpenceType.CARD_WITHDRAW
      )
    }

    // If type is INCOME, only show CLIENT_PAYMENT, LOAN_REPAYMENT, LOAN_TAKEN, FOUNDER_INPUT
    if (selectedType === CorporateExpenceType.INCOME) {
      return allOptions.filter(
        (option) =>
          option.value === ExpenceType.CLIENT_PAYMENT ||
          option.value === ExpenceType.LOAN_REPAYMENT ||
          option.value === ExpenceType.LOAN_TAKEN ||
          option.value === ExpenceType.FOUNDER_INPUT
      )
    }

    // If type is EXPENCE, only show CHANNEL_POST, CHANNEL_DEPOSIT_TOPUP, CHANNEL_POST_FROM_DEPOSIT, SALARY ...
    if (selectedType === CorporateExpenceType.EXPENCE) {
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
    }
    // Return all options for other types
    return allOptions
  }, [selectedType, t_general])

  const filteredPaymentTypeOptions = useMemo(() => {
    const allOptions = getPaymentTypeOptions(t_general)
    if (selectedType === CorporateExpenceType.EXPENCE) {
      if (checkExpenceType === ExpenceType.CHANNEL_POST) {
        return allOptions
      }
    }
    if (
      selectedType === CorporateExpenceType.INCOME ||
      selectedType === CorporateExpenceType.EXPENCE ||
      selectedType === CorporateExpenceType.TRANSFER
    ) {
      return allOptions.filter(
        (option) =>
          option.value === PaymentType.CARD ||
          option.value === PaymentType.CASH ||
          option.value === PaymentType.BANK_TRANSFER
      )
    }

    return allOptions
  }, [checkExpenceType, selectedType, t_general])

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
  }, [selectedType, filteredExpenceTypeOptions, form])
  ////////////

  const handlePendingDelete = (filePath: string | null) => {
    setPendingDeleteFile(filePath)
  }

  const onSubmit = async (values: ExpenceForm) => {
    if (
      checkExpenceType === ExpenceType.CARD_WITHDRAW ||
      checkExpenceType === ExpenceType.COMPANY_TRANSFER
    ) {
      form.setValue('payment_type', PaymentType.BANK_TRANSFER)
    }

    if (isUpdate && pendingDeleteFile) {
      try {
        await deleteFile.mutateAsync(pendingDeleteFile)
        setPendingDeleteFile(null)
      } catch (_error) {
        toast.error(t.toast.unable_delete_previous)
      }
    }

    if (isUpdate) {
      updateExpence.mutate(
        {
          id: currentRow.id,
          data: values,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
            setPendingDeleteFile(null)
          },
        }
      )
    } else {
      createExpence.mutate(values, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
          setPendingDeleteFile(null)
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

  const companyOptions = [
    {
      value: 'company_id',
      label: t.form_labels.from_company_id,
    },
    {
      value: 'to_company_id',
      label: t.form_labels.to_company_id,
    },
  ] as const

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
          <SheetTitle>
            {isUpdate
              ? tExpence[lang].update_expence
              : tExpence[lang].create_expence}
          </SheetTitle>
          <SheetDescription>
            {isUpdate ? tExpence[lang].update_desc : tExpence[lang].create_desc}
            {tExpence[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='expence-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.form_labels.type}</FormLabel>
                    <FormControl>
                      <div className='grid grid-cols-3 gap-2'>
                        {expenceOriginTypeOptions.map((option) => (
                          <Button
                            key={option.value}
                            type='button'
                            variant='outline'
                            size='sm'
                            className={cn(
                              'w-full transition-all',
                              field.value === option.value
                                ? getExpenceOriginTypeColor(option.value)
                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900'
                            )}
                            onClick={() => field.onChange(option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormFieldSelect
                control={form.control}
                name='expence_type'
                label={t.form_labels.expence_type}
                placeholder={t.form_placeholders.select_type}
                options={filteredExpenceTypeOptions}
              />
              {/* ********* Transfer ********* */}
              {checkExpenceType === ExpenceType.CARD_WITHDRAW && (
                <>
                  <FormComboboxCompany
                    control={form.control}
                    name='company_id'
                    label={t.form_labels.company}
                    detail={currentRow?.company ?? undefined}
                    filterOurCompany={true}
                    setValue={form.setValue}
                  />
                </>
              )}
              {checkExpenceType === ExpenceType.COMPANY_TRANSFER && (
                <>
                  {companyOptions.map((item) => (
                    <FormComboboxCompany
                      control={form.control}
                      name={item.value}
                      label={item.label}
                      detail={currentRow?.company ?? undefined}
                      filterOurCompany={true}
                      setValue={form.setValue}
                      //       disabled={!selectedCompanyId}
                      // excludeCompanyId={selectedCompanyId}
                    />
                  ))}
                </>
              )}

              {selectedType === CorporateExpenceType.TRANSFER && (
                <FormComboboxProject
                  control={form.control}
                  name='project_id'
                  label={t.form_placeholders.select_project}
                  detail={currentRow?.project ?? undefined}
                />
              )}

              {/* Payment type */}
              {selectedType === CorporateExpenceType.TRANSFER ? (
                checkExpenceType === ExpenceType.CARD_WITHDRAW && (
                  <FormComboboxCards
                    name='card_id'
                    label={t.form_labels.select_card}
                    control={form.control}
                    companyId={selectedCompanyId}
                    // detail={currentRow?.card}
                  />
                )
              ) : (
                <>
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
                      detail={currentRow?.company ?? undefined}
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
                </>
              )}

              {/* ********* Income ********* */}
              {checkExpenceType === ExpenceType.CLIENT_PAYMENT && (
                <FormComboboxProject
                  control={form.control}
                  name='project_id'
                  label={t.form_placeholders.select_project}
                  detail={currentRow?.project ?? undefined}
                />
              )}

              {selectedType === CorporateExpenceType.INCOME &&
                checkExpenceType === ExpenceType.LOAN_REPAYMENT && (
                  <FormComboboxLoans
                    control={form.control}
                    name='loan_id'
                    label={t.form_labels.loan}
                    direction='WE_GAVE'
                    // detail={currentRow?.loan ?? undefined}
                  />
                )}

              {checkExpenceType === ExpenceType.LOAN_TAKEN && (
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
              )}
              {checkExpenceType === ExpenceType.FOUNDER_INPUT && (
                <FormComboboxFounders
                  control={form.control}
                  name='founder_id'
                  label={t.form_labels.founder}
                  // detail={currentRow?.founder}
                />
              )}
              {/* ********* OutCome  ********* */}
              {checkExpenceType === ExpenceType.CHANNEL_POST && (
                <>
                  <FormComboboxProject
                    control={form.control}
                    name='project_id'
                    label={t.form_placeholders.select_project}
                    detail={currentRow?.project ?? undefined}
                  />

                  <FormComboboxProjectSocial
                    control={form.control}
                    name='project_social_id'
                    label={t.form_placeholders.select_project_social}
                    projectIdField='project_id'
                    amountField='amount'
                    setValue={form.setValue}
                    // detail={currentRow?.project_social ?? undefined}
                  />
                </>
              )}
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
                  <FormComboboxProject
                    control={form.control}
                    name='project_id'
                    label={t.form_placeholders.select_project}
                    detail={currentRow?.project ?? undefined}
                  />

                  <FormComboboxUser
                    control={form.control}
                    name='user_id'
                    label={t.form_labels.select_user}
                    detail={currentRow?.user ?? undefined}
                  />
                </>
              )}
              {checkExpenceType === ExpenceType.SALARY_ADVANCE && (
                <FormComboboxUser
                  control={form.control}
                  name='user_id'
                  label={t.form_labels.select_user}
                  detail={currentRow?.user ?? undefined}
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
              {selectedType === CorporateExpenceType.EXPENCE &&
                checkExpenceType === ExpenceType.LOAN_REPAYMENT && (
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
                  <FormComboboxProject
                    control={form.control}
                    name='project_id'
                    label={t.form_placeholders.select_project}
                    detail={currentRow?.project ?? undefined}
                  />
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
                isUpdateMode={isUpdate}
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
          {isUpdate && (
            <Button onClick={handleDelete} size='sm' variant='destructive'>
              {t.buttons.delete}
            </Button>
          )}
          <Button
            disabled={
              isUpdate ? updateExpence.isPending : createExpence.isPending
            }
            form='expence-form'
            type='submit'
          >
            {(isUpdate ? updateExpence.isPending : createExpence.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Reset to_company_id whenever company_id changes
// useEffect(() => {
//   if (selectedType !== CorporateExpenceType.TRANSFER) {
//     form.setValue('to_company_id', undefined)
//     form.setValue('card_id', undefined)
//   }
// }, [selectedCompanyId, selectedType, form])

// .superRefine((data, ctx) => {
//         // If type is 'transfer', to_company_id is required
//         if (
//           data.type === CorporateExpenceType.TRANSFER &&
//           !data.expence_type
//         ) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: t.form_validations.required_field,
//             path: ['expence_type'],
//           })
//         }

//         // If expence_type is *** is required
//         if (
//           data.expence_type === ExpenceType.CARD_WITHDRAW &&
//           !data.company_id
//         ) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: t.form_validations.required_field,
//             path: ['company_id'],
//           })
//         }
//         if (
//           data.expence_type === ExpenceType.CARD_WITHDRAW &&
//           !data.card_id
//         ) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: t.form_validations.required_field,
//             path: ['card_id'],
//           })
//         }
//       }),
