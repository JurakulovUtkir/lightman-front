import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toNumber } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { DepositDialogType } from '../context'
import { useCreateDeposit, useUpdateDeposit } from '../data/hooks'
import { DepositSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: DepositSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<DepositSchema | null>>
  setOpen?: (str: DepositDialogType | null) => void
}

export function DepositMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createDeposit = useCreateDeposit()
  const updateDeposit = useUpdateDeposit()
  const isUpdate = !!currentRow
  const formSchema = z.object({
    name: z
      .string({
        error: 'Name is required.',
      })
      .min(1, 'Please enter name.')
      .max(150, 'Name cannot exceed 150 characters.'),

    balance: z
      .number({
        error: 'Balance is required',
      })
      .min(0, 'Invalid value'),
  })

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
      updateDeposit.mutate(
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
      createDeposit.mutate(values, {
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
      <SheetContent className='flex max-w-md flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Deposit</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Deposit by providing necessary info.'
              : 'Add a new Deposit by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='deposit-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <FormFieldWrapper
                control={form.control}
                name='name'
                label='Name'
                placeholder='Enter a name'
              />

              <FormFieldWrapper
                control={form.control}
                name='balance'
                label='Balance'
                placeholder='Enter a balance'
                type='number'
                suffix='UZS'
              />
            </form>
          </Form>
        </div>
        <SheetFooter>
          {isUpdate && (
            <Button onClick={handleDelete} size='sm' variant='destructive'>
              Delete
            </Button>
          )}
          <Button
            disabled={
              isUpdate ? updateDeposit.isPending : createDeposit.isPending
            }
            form='deposit-form'
            type='submit'
          >
            {(isUpdate ? updateDeposit.isPending : createDeposit.isPending)
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
