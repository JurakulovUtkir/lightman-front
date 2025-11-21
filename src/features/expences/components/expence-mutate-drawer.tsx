import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  expenceOriginTypeOptions,
  expenceTypeOptions,
  paymentTypeOptions,
} from '@/constants'
import { toast } from 'sonner'
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
import { FormFieldSelect } from '@/components/form-field-select'
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { FormFileUploadField } from '@/features/project-socials/components/form-file-upload'
import { useDeleteFile } from '@/features/project-socials/data/hooks'
import { FormComboboxCompany } from '@/features/projects/components/form-combobox-company'
import { FormComboboxProject } from '@/features/projects/components/form-combobox-projects'
import { useDistributions } from '@/features/stakeholder/distributions/data/hooks'
import { ExpenceDialogType } from '../context'
import { useCreateExpence, useUpdateExpence } from '../data/hooks'
import { ExpenceSchema } from '../data/schema'
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
  const createExpence = useCreateExpence()
  const updateExpence = useUpdateExpence()
  const deleteFile = useDeleteFile()
  const { data: distribution } = useDistributions()

  const isUpdate = !!currentRow
  const formSchema = z.object({
    project_id: z.string({
      error: 'Required field',
    }),
    expence_type: z.enum(['salary', 'avans', 'project', 'deposit', 'other'], {
      error: 'Required field',
    }),
    type: z.enum(['expence', 'income', 'deposit'], {
      error: 'Required field',
    }),

    distribution_id: z.string({
      error: 'Required field',
    }),
    company_id: z.string({ error: 'Required field' }),
    user_id: z.string().optional(),
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

  type ExpenceForm = z.infer<typeof formSchema>

  const form = useForm<ExpenceForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      amount: toNumber(currentRow?.amount),
      description: currentRow?.description ?? undefined,
      user_id: currentRow?.user?.id ?? undefined,
      file_url: currentRow?.file_url ?? undefined,
    },
  })

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
        toast.error('Unable to delete previous file')
        // Handle error if needed
        // console.error('Failed to delete old file:', error)
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Expence</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Expence by providing necessary info.'
              : 'Add a new Expence by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='expence-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <FormComboboxProject
                control={form.control}
                name='project_id'
                label='Select Project'
                // detail={undefined}
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
                name='type'
                label='Type'
                placeholder='Select a type'
                options={expenceOriginTypeOptions}
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
              <FormComboboxCompany
                control={form.control}
                name='company_id'
                label='Company'
                detail={currentRow?.company ?? undefined}
                filterOurCompany={true}
                setValue={form.setValue}
              />

              <FormComboboxUser
                control={form.control}
                name='user_id'
                label='Select User'
                detail={currentRow?.user ?? undefined}
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
              <FormFieldWrapper
                control={form.control}
                name='description'
                label='Description'
                placeholder='Enter a description'
                type='textarea'
              />

              <FormFileUploadField
                control={form.control}
                name='file_url'
                label='File'
                maxSize={5}
                isUpdateMode={isUpdate}
                onPendingDelete={handlePendingDelete}
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
              isUpdate ? updateExpence.isPending : createExpence.isPending
            }
            form='expence-form'
            type='submit'
          >
            {(isUpdate ? updateExpence.isPending : createExpence.isPending)
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
