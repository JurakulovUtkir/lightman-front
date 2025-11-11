import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { FormFieldSelect } from '@/components/form-field-select'
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { FormComboboxNetwrokCategory } from '@/features/network/socials/components/form-combobox-network-category'
import { ProjectDialogType } from '../context'
import { useCreateProject, useUpdateProject } from '../data/hooks'
import { ProjectSchema } from '../data/schema'
import { FormComboboxCompany } from './form-combobox-company'
import { FormDistribution } from './form-distribution'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ProjectSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<ProjectSchema | null>>
  setOpen?: (str: ProjectDialogType | null) => void
}

export function ProjectMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const isUpdate = !!currentRow
  const formSchema = z.object({
    name: z
      .string({
        error: 'Name is required.',
      })
      .min(1, 'Please enter your name.')
      .max(150, 'Name cannot exceed 150 characters.'),
    description: z
      .string({
        error: 'Description is required.',
      })
      .min(1)
      .max(150, 'Description cannot exceed 150 characters.')
      .optional(),
    contract_id: z.string().optional().nullable(),
    price: z
      .number({
        error: 'Required field',
      })
      .min(0, 'Invalid value'),
    price_with_qqs: z
      .number({
        error: 'Required field',
      })
      .min(0, 'Invalid value'),
    // status: z.string().optional(),
    distribution_id: z.string().optional(),
    price_type: z.enum(['standard', 'vip', 'no_watermark']).optional(),
    category_id: z.string().optional(),
    customer_company_id: z.string({
      error: 'Required field',
    }),
    our_company_id: z.string({
      error: 'Required field',
    }),
    payment_type: z.enum(['cash', 'card', 'bank_transfer']).optional(),
    is_active: z.boolean().optional(),
  })

  type ProjectForm = z.infer<typeof formSchema>

  const toNumber = (value: string | number | undefined): number | undefined => {
    if (value === undefined || value === null) return undefined
    return typeof value === 'string' ? parseFloat(value) : value
  }

  const form = useForm<ProjectForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      contract_id: currentRow?.contract_id ?? undefined,
      price: toNumber(currentRow?.price) ?? 0,
      price_with_qqs: toNumber(currentRow?.price_with_qqs) ?? 0,
    },
  })

  const onSubmit = (values: ProjectForm) => {
    if (isUpdate) {
      updateProject.mutate(
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
      createProject.mutate(values, {
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
      <SheetContent className='flex max-w-full flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Project</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Project by providing necessary info.'
              : 'Add a new Project by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='project-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
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
                      <FormLabel className='text-sm'>Is active</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormFieldWrapper
                control={form.control}
                name='name'
                label='Name'
                placeholder='Enter a name'
              />

              <FormFieldWrapper
                control={form.control}
                name='description'
                label='Description'
                placeholder='Enter a description'
              />
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {/* ! contract_id combo select */}
                <FormFieldSelect
                  control={form.control}
                  name='contract_id'
                  label='Contract'
                  placeholder='Select a contract'
                  options={[]}
                  emptyMessage='No Contracts found'
                />

                {/* distribution_id select */}
                <FormDistribution
                  control={form.control}
                  name='distribution_id'
                  label='Distribution'
                  placeholder='Select a distribution'
                />

                {/* category_id combo select */}
                <div className='sm:col-span-2'>
                  <FormComboboxNetwrokCategory
                    control={form.control}
                    name='category_id'
                    label='Category'
                    detail={currentRow?.category ?? undefined}
                  />
                </div>
                {/* our_company_id combo select */}
                <FormComboboxCompany
                  control={form.control}
                  name='our_company_id'
                  label='Our company'
                  detail={currentRow?.our_company}
                  filterOurCompany={true}
                />
                {/* customer_company_id combo select */}
                <FormComboboxCompany
                  control={form.control}
                  name='customer_company_id'
                  label='Customer company'
                  detail={currentRow?.customer_company}
                  filterOurCompany={false}
                />

                {/* price_type select */}
                <FormFieldSelect
                  control={form.control}
                  name='price_type'
                  label='Price type'
                  placeholder='Select a price type'
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'no_watermark', label: 'No watermark' },
                    { value: 'vip', label: 'Vip' },
                  ]}
                />

                <FormFieldSelect
                  control={form.control}
                  name='payment_type'
                  label='Payment type'
                  placeholder='Select a payment type'
                  options={[
                    { value: 'cash', label: 'Cash' },
                    { value: 'card', label: 'Card' },
                    { value: 'bank_transfer', label: 'Bank Transfer' },
                  ]}
                />

                <FormFieldWrapper
                  control={form.control}
                  name='price'
                  label='Price'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='price_with_qqs'
                  label='Price with QQS'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
              </div>
            </form>
          </Form>
        </div>
        <SheetFooter>
          {isUpdate && (
            <Button
              onClick={handleDelete}
              size='sm'
              variant='destructive'
              className='w-full sm:w-auto'
            >
              Delete
            </Button>
          )}
          <Button
            disabled={
              isUpdate ? updateProject.isPending : createProject.isPending
            }
            form='project-form'
            type='submit'
            className='w-full sm:w-auto'
          >
            {(isUpdate ? updateProject.isPending : createProject.isPending)
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
