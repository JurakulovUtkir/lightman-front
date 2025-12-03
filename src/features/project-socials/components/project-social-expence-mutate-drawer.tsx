import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCalendar } from '@tabler/icons-react'
import {
  expenceOriginTypeOptions,
  expenceTypeOptions,
  paymentTypeOptions,
} from '@/constants'
import { toast } from 'sonner'
import { getExpenceOriginTypeColor } from '@/lib/statusHelpers'
import { cn } from '@/lib/utils'
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
import { FormComboboxDeposit } from '@/features/expences/components/form-combobox-deposit'
import { FormComboboxUser } from '@/features/expences/components/form-combobox-users'
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
  const [pendingDeleteFile, setPendingDeleteFile] = useState<string | null>(
    null
  )
  const [openDate, setOpenDate] = useState(false)
  const createExpence = useCreateExpence()
  const deleteFile = useDeleteFile()
  const { data: distribution } = useDistributions()
  const updateProjectSocial = useUpdateProjectSocial()

  // Dynamic schema with conditional validation
  const formSchema = z
    .object({
      //   project_id: z.string({
      //     error: 'Required field',
      //   }),
      expence_type: z.enum(
        ['salary', 'avans', 'project', 'deposit', 'other', 'transfer'],
        {
          error: 'Required field',
        }
      ),
      type: z.enum(['expence', 'income', 'deposit'], {
        error: 'Required field',
      }),
      distribution_id: z.string({
        error: 'Required field',
      }),
      company_id: z.string({ error: 'Required field' }),
      to_company_id: z.string().optional(),
      created_at: z.date().optional(),
      user_id: z.string().optional(),
      deposit_id: z.string().optional(),
      payment_type: z.enum(['card', 'bank_transfer', 'cash', 'deposit'], {
        error: 'Required field',
      }),
      amount: z
        .number({
          error: 'Amount is required',
        })
        .min(0, 'Invalid value'),
      description: z
        .string()
        .max(150, 'Name cannot exceed 150 characters.')
        .optional(),
      file_url: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // If expence_type is 'transfer', to_company_id is required
      if (data.expence_type === 'transfer' && !data.to_company_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Transfer to company is required for transfer type',
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
          message: 'User is required for salary/avans type',
          path: ['user_id'],
        })
      }

      // If expence_type is 'deposit', deposit_id is required
      if (data.expence_type === 'deposit' && !data.deposit_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Deposit is required for deposit type',
          path: ['deposit_id'],
        })
      }
    })

  type ExpenceForm = z.infer<typeof formSchema>

  const form = useForm<ExpenceForm>({
    resolver: zodResolver(formSchema),
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
    if (!currentRow?.id) {
      toast.warning('Failed to create expence to this project social!')
      return
    }
    // If updating and there's a pending file deletion, delete it first
    if (pendingDeleteFile) {
      try {
        await deleteFile.mutateAsync(pendingDeleteFile)
        setPendingDeleteFile(null)
      } catch (_error) {
        toast.error('Unable to delete previous file')
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
          <SheetTitle>Expence</SheetTitle>
          <SheetDescription>
            Add a new Expence by providing necessary info. Click save when
            you&apos;re done.
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
                    <FormLabel>Type</FormLabel>
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
                label='Expence type'
                placeholder='Select a type'
                options={expenceTypeOptions}
              />
              <FormFieldSelect
                control={form.control}
                name='distribution_id'
                label='Distribution'
                placeholder='Select a distribution'
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
                label='Payment type'
                placeholder='Select a payment type'
                options={paymentTypeOptions}
              />
              <FormFieldWrapper
                control={form.control}
                name='amount'
                label='Amount'
                placeholder='Enter a amount'
                type='number'
                suffix='UZS'
              />
              {/* <FormComboboxProject
                control={form.control}
                name='project_id'
                label='Select Project'
                detail={undefined}
              /> */}
              <FormComboboxCompany
                control={form.control}
                name='company_id'
                label='Company'
                detail={undefined}
                filterOurCompany={true}
                setValue={form.setValue}
              />

              {checkExpenceType === 'transfer' && (
                <FormComboboxCompany
                  control={form.control}
                  name='to_company_id'
                  label='Transfer Company'
                  detail={undefined}
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
                  label='Select User'
                  detail={undefined}
                />
              )}

              {checkExpenceType === 'deposit' && (
                <FormComboboxDeposit
                  name='deposit_id'
                  label='Select deposit'
                  control={form.control}
                  detail={undefined}
                />
              )}

              <FormField
                control={form.control}
                name='created_at'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Creation date</FormLabel>
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
                              <span>Creation date</span>
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
                label='File'
                maxSize={5}
                onPendingDelete={handlePendingDelete}
              />

              <FormFieldWrapper
                control={form.control}
                name='description'
                label='Description'
                placeholder='Enter a description'
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
            {createExpence.isPending ? 'Loading...' : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
