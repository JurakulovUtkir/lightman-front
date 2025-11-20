import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toNumber } from '@/lib/helpers'
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
import { FormFileUploadField } from '@/features/project-socials/components/form-file-upload'
import { FormComboboxCompany } from '@/features/projects/components/form-combobox-company'
import { ContractDialogType } from '../context'
import { useCreateContract, useUpdateContract } from '../data/hooks'
import { ContractSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ContractSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<ContractSchema | null>>
  setOpen?: (str: ContractDialogType | null) => void
}

export function ContractMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createContract = useCreateContract()
  const updateContract = useUpdateContract()
  const isUpdate = !!currentRow
  const formSchema = z.object({
    contract_number: z
      .string({
        error: 'Contract number is required',
      })
      .min(1, 'Please enter contract number.')
      .max(100, 'Contract number cannot exceed 100 characters.'),
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
    price: z
      .number({
        error: 'Required field',
      })
      .min(0, 'Invalid value'),
    payment_type: z.enum(['card', 'bank_transfer', 'cash'], {
      error: 'Required field',
    }),
    // payment_status: z.enum(['pending'], {
    //   error: 'Required field',
    // }),
    our_company_id: z.string({
      error: 'Required field',
    }),
    customer_company_id: z.string({
      error: 'Required field',
    }),
    file: z.string({
      error: 'File is field',
    }),
    is_active: z.boolean().optional(),
    is_qqs: z.boolean().optional(),
  })

  type ProjectForm = z.infer<typeof formSchema>

  const form = useForm<ProjectForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      price: toNumber(currentRow?.price) ?? undefined,
    },
  })

  const onSubmit = (values: ProjectForm) => {
    if (isUpdate) {
      updateContract.mutate(
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
      createContract.mutate(values, {
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

  const switchFields = [
    {
      name: 'is_active',
      label: 'Is active',
    },
    {
      name: 'is_qqs',
      label: 'Is QQS',
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Contract</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Contract by providing necessary info.'
              : 'Add a new Contract by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='contract-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {switchFields.map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name}
                    render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <FormControl>
                            <Switch
                              defaultChecked={item.name === 'is_active'}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className='text-sm'>
                            {item.label}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormFieldWrapper
                control={form.control}
                name='contract_number'
                label='Contract number'
                placeholder='Enter a number'
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
                <FormFieldWrapper
                  control={form.control}
                  name='price'
                  label='Price'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
                <FormComboboxCompany
                  control={form.control}
                  name='our_company_id'
                  label='Our company'
                  detail={currentRow?.our_company}
                  filterOurCompany={true}
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
                <FormComboboxCompany
                  control={form.control}
                  name='customer_company_id'
                  label='Customer company'
                  detail={currentRow?.customer_company}
                  filterOurCompany={false}
                />
                {/* <FormFieldSelect
                  control={form.control}
                  name='payment_status'
                  label='Payment status'
                  placeholder='Select a payment status'
                  options={[{ value: 'pending', label: 'Pending' }]}
                  emptyMessage='No Contracts found'
                /> */}
              </div>

              <FormFileUploadField
                control={form.control}
                name='file'
                label='File'
                maxSize={5}
              />
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
              isUpdate ? updateContract.isPending : createContract.isPending
            }
            form='contract-form'
            type='submit'
            className='w-full sm:w-auto'
          >
            {(isUpdate ? updateContract.isPending : createContract.isPending)
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
