import { useState, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCalendar } from '@tabler/icons-react'
import {
  getExpenceTypeOptions,
  getExpenceOriginTypeOptions,
  getPaymentTypeOptions,
} from '@/constants'
import { toast } from 'sonner'
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
import { FormComboboxCompany } from '@/features/expences/components/form-combobox-company'
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

  const expenceOriginTypeOptions = getExpenceOriginTypeOptions(t_general)

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
        distribution_id: z.string({
          error: t.form_validations.required_field,
        }),
        company_id: z.string({ error: t.form_validations.required_field }),
        to_company_id: z.string().optional(),
        created_at: z.date().optional(),
        user_id: z.string().optional(),
        deposit_id: z.string().optional(),
        payment_type: z.enum(
          [
            PaymentType.CARD,
            PaymentType.CASH,
            PaymentType.BANK_TRANSFER,
            PaymentType.DEPOSIT,
          ],
          {
            error: t.form_validations.required_field,
          }
        ),
        amount: z
          .number({
            error: t.form_validations.amount,
          })
          .min(0, t.form_validations.invalid_value),
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

  // const checkExpenceType = form.watch('expence_type')
  // const selectedCompanyId = form.watch('company_id')

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
                options={getExpenceTypeOptions(t_general)}
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
                options={getPaymentTypeOptions(t_general)}
              />
              <FormFieldWrapper
                control={form.control}
                name='amount'
                label={t.form_labels.amount}
                placeholder={t.form_placeholders.enter_amount}
                type='number'
                suffix={t.form_placeholders.uzs}
              />
              {/*  <FormComboboxProject
                              control={form.control}
                              name='project_id'
                              label={t.form_placeholders.select_project}
                              detail={currentRow?.project ?? undefined}
                            /> */}
              <FormComboboxCompany
                control={form.control}
                name='company_id'
                label={t.form_labels.company}
                detail={undefined}
                filterOurCompany={true}
                setValue={form.setValue}
              />
              {/* 
              {checkExpenceType === 'transfer' && (
                <FormComboboxCompany
                  control={form.control}
                  name='to_company_id'
                  label={t.form_labels.transfer_company}
                  detail={undefined}
                  filterOurCompany={true}
                  setValue={form.setValue}
                  disabled={!selectedCompanyId}
                  excludeCompanyId={selectedCompanyId}
                />
              )} */}

              {/* {(checkExpenceType === 'salary' ||
                checkExpenceType === 'avans') && (
                <FormComboboxUser
                  control={form.control}
                  name='user_id'
                  label={t.form_labels.select_user}
                  detail={undefined}
                />
              )}

              {checkExpenceType === 'deposit' && (
                <FormComboboxDeposit
                  name='deposit_id'
                  label={t.form_labels.select_deposit}
                  control={form.control}
                  detail={undefined}
                />
              )} */}

              <FormField
                control={form.control}
                name='created_at'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-1'>
                    <FormLabel>{t.form_labels.creation_date}</FormLabel>
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
                              <span>{t.form_labels.creation_date}</span>
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

// Reset to_company_id whenever company_id changes
// useEffect(() => {
//   if (checkExpenceType === 'transfer') {
//     form.setValue('to_company_id', undefined)
//   }
// }, [selectedCompanyId, checkExpenceType, form])

// .superRefine((data, ctx) => {
//     // If expence_type is 'transfer', to_company_id is required
//     if (data.expence_type === 'transfer' && !data.to_company_id) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: t.form_validations.required_transfer,
//         path: ['to_company_id'],
//       })
//     }

//     // If expence_type is 'salary' or 'avans', user_id is required
//     if (
//       (data.expence_type === 'salary' || data.expence_type === 'avans') &&
//       !data.user_id
//     ) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: t.form_validations.required_user,
//         path: ['user_id'],
//       })
//     }

//     // If expence_type is 'deposit', deposit_id is required
//     if (data.expence_type === 'deposit' && !data.deposit_id) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: t.form_validations.required_deposit,
//         path: ['deposit_id'],
//       })
//     }
//   })
