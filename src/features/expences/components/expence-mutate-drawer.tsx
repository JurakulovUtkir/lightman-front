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
import { FormComboboxProject } from '@/features/projects/components/form-combobox-projects'
import { useDistributions } from '@/features/stakeholder/distributions/data/hooks'
import { ExpenceDialogType } from '../context'
import { useCreateExpence, useUpdateExpence } from '../data/hooks'
import { ExpenceSchema } from '../data/schema'
import { FormComboboxCompany } from './form-combobox-company'
import { FormComboboxDeposit } from './form-combobox-deposit'
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
  const [pendingDeleteFile, setPendingDeleteFile] = useState<string | null>(
    null
  )
  const [openDate, setOpenDate] = useState(false)
  const createExpence = useCreateExpence()
  const updateExpence = useUpdateExpence()
  const deleteFile = useDeleteFile()
  const { data: distribution } = useDistributions()

  const isUpdate = !!currentRow

  const { lang, tForm, tExpence, general } = useLang()
  const t = tForm[lang]
  const t_general = general[lang].columns
  const expenceOriginTypeOptions = getExpenceOriginTypeOptions(t_general)

  const formSchema = useMemo(
    () =>
      z
        .object({
          project_id: z.string({
            error: t.form_validations.required_field,
          }),
          expence_type: z.enum(
            ['salary', 'avans', 'project', 'deposit', 'other', 'transfer'],
            {
              error: t.form_validations.required_field,
            }
          ),
          type: z.enum(['expence', 'income', 'deposit'], {
            error: t.form_validations.required_field,
          }),
          distribution_id: z.string({
            error: t.form_validations.required_field,
          }),
          company_id: z.string({ error: t.form_validations.required_field }),
          to_company_id: z.string().optional(),
          created_at: z.date().optional(),
          user_id: z.string().optional(),
          deposit_id: z.string().optional(),
          payment_type: z.enum(['CARD', 'BANK_TRANSFER', 'CASH', 'DEPOSIT'], {
            error: t.form_validations.required_field,
          }),
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
        })
        .superRefine((data, ctx) => {
          // If expence_type is 'transfer', to_company_id is required
          if (data.expence_type === 'transfer' && !data.to_company_id) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t.form_validations.required_transfer,
              path: ['to_company_id'],
            })
          }

          // If expence_type is 'salary' or 'avans', user_id is required
          if (
            (data.expence_type === 'salary' || data.expence_type === 'avans') &&
            !data.user_id
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t.form_validations.required_user,
              path: ['user_id'],
            })
          }

          // If expence_type is 'deposit', deposit_id is required
          if (data.expence_type === 'deposit' && !data.deposit_id) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t.form_validations.required_deposit,
              path: ['deposit_id'],
            })
          }
        }),
    [t]
  )

  type ExpenceForm = z.infer<typeof formSchema>

  const form = useForm<ExpenceForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      amount: toNumber(currentRow?.amount),
      description: currentRow?.description ?? undefined,
      user_id: currentRow?.user?.id ?? undefined,
      file_url: currentRow?.file_url ?? undefined,
      created_at: currentRow?.created_at ?? undefined,
    },
  })

  const checkExpenceType = form.watch('expence_type')
  const selectedCompanyId = form.watch('company_id')

  // Reset to_company_id whenever company_id changes
  useEffect(() => {
    if (checkExpenceType === 'transfer') {
      form.setValue('to_company_id', undefined)
    }
  }, [selectedCompanyId, checkExpenceType, form])

  const handlePendingDelete = (filePath: string | null) => {
    setPendingDeleteFile(filePath)
  }

  const onSubmit = async (values: ExpenceForm) => {
    // If updating and there's a pending file deletion, delete it first
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
              <FormComboboxProject
                control={form.control}
                name='project_id'
                label={t.form_placeholders.select_project}
                detail={currentRow?.project ?? undefined}
              />
              <FormComboboxCompany
                control={form.control}
                name='company_id'
                label={t.form_labels.company}
                detail={currentRow?.company ?? undefined}
                filterOurCompany={true}
                setValue={form.setValue}
              />

              {checkExpenceType === 'transfer' && (
                <FormComboboxCompany
                  control={form.control}
                  name='to_company_id'
                  label={t.form_labels.transfer_company}
                  detail={currentRow?.company ?? undefined}
                  filterOurCompany={true}
                  setValue={form.setValue}
                  disabled={!selectedCompanyId}
                  excludeCompanyId={selectedCompanyId}
                />
              )}

              {(checkExpenceType === 'salary' ||
                checkExpenceType === 'avans') && (
                <FormComboboxUser
                  control={form.control}
                  name='user_id'
                  label={t.form_labels.select_user}
                  detail={currentRow?.user ?? undefined}
                />
              )}

              {checkExpenceType === 'deposit' && (
                <FormComboboxDeposit
                  name='deposit_id'
                  label={t.form_labels.select_deposit}
                  control={form.control}
                  detail={currentRow?.deposit ?? undefined}
                />
              )}

              <FormField
                control={form.control}
                name='created_at'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
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
