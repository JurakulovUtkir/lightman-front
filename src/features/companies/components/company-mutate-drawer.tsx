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
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { CompanyDialogType } from '../context'
import { useCreateCompany, useUpdateCompany } from '../data/hooks'
import { CompanySchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: CompanySchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<CompanySchema | null>>
  setOpen?: (str: CompanyDialogType | null) => void
}

export function CompanyMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const isUpdate = !!currentRow
  const formSchema = z.object({
    name: z
      .string({
        error: 'Name must be a valid string.',
      })
      .min(1, 'Please enter your name.')
      .max(150, 'Name cannot exceed 150 characters.'),
    address: z
      .string({
        error: 'Address is required.',
      })
      .min(1)
      .max(150, 'Address cannot exceed 150 characters.'),
    stir: z
      .string({
        error: 'STIR number is required.',
      })
      .regex(/^\d{9}$/, 'STIR number must be exactly 9 digits.'),
    mfo: z
      .string({
        error: 'MFO number is required.',
      })
      .regex(/^\d{5}$/, 'MFO number must be exactly 5 digits.'),
    bank: z
      .string({
        error: 'Bank name is required.',
      })
      .min(1)
      .max(150, 'Bank name cannot exceed 150 characters.'),
    account_number: z
      .string({
        error: 'Account number is required.',
      })
      .regex(/^\d{20}$/, 'Account number must be exactly 20 digits.'),

    balance: z.number().min(0, 'Invalid value').optional(),
    is_active: z.boolean().optional(),
    is_our_company: z.boolean().optional(),
    is_vip: z.boolean().optional(),
  })

  type CompanyForm = z.infer<typeof formSchema>

  const toNumber = (value: string | number | undefined): number | undefined => {
    if (value === undefined || value === null) return undefined
    return typeof value === 'string' ? parseFloat(value) : value
  }

  const form = useForm<CompanyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      balance: toNumber(currentRow?.balance),
      stir: currentRow?.stir?.toString() || '',
      mfo: currentRow?.mfo?.toString() || '',
      account_number: currentRow?.account_number?.toString() || '',
    },
  })

  const onSubmit = (values: CompanyForm) => {
    if (isUpdate) {
      updateCompany.mutate(
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
      createCompany.mutate(values, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const switchFields = [
    {
      name: 'is_active',
      label: 'Is active',
    },
    {
      name: 'is_our_company',
      label: 'Is our company',
    },
    {
      name: 'is_vip',
      label: 'Is vip',
    },
  ] as const

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
      <SheetContent className='flex max-w-2xl flex-col md:max-w-[540px]!'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Company</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Company by providing necessary info.'
              : 'Add a new Company by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='company-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <div className='grid grid-cols-3 gap-4'>
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
                          <FormLabel>{item.label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormFieldWrapper
                control={form.control}
                name='name'
                label='Name'
                placeholder='Enter a name'
              />

              <FormFieldWrapper
                control={form.control}
                name='address'
                label='Address'
                placeholder='Enter a address'
              />
              <FormFieldWrapper
                control={form.control}
                name='bank'
                label='Bank name'
                placeholder='Enter a bank name'
              />

              <div className='flex items-baseline justify-between gap-4'>
                <FormFieldWrapper
                  control={form.control}
                  name='stir'
                  label='STIR number'
                  placeholder='Enter a number'
                  type='text'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='mfo'
                  label='MFO number'
                  placeholder='Enter a number'
                  type='text'
                />
              </div>
              <FormFieldWrapper
                control={form.control}
                name='account_number'
                label='Account number'
                placeholder='Enter a number'
                type='text'
              />
              <FormFieldWrapper
                control={form.control}
                name='balance'
                label='Balance'
                placeholder='Enter a price'
                type='number'
                suffix='UZS'
              />
            </form>
          </Form>
        </div>
        <SheetFooter className='gap-2'>
          {isUpdate && (
            <Button onClick={handleDelete} size='sm' variant='destructive'>
              Delete
            </Button>
          )}
          <Button
            disabled={
              isUpdate ? updateCompany.isPending : createCompany.isPending
            }
            form='company-form'
            type='submit'
          >
            {(isUpdate ? updateCompany.isPending : createCompany.isPending)
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
