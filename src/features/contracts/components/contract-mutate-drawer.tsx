import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getPaymentTypeOptions } from '@/constants'
import { toast } from 'sonner'
import { toNumber } from '@/lib/helpers'
import { useLang } from '@/hooks/useLang'
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
import { useDeleteFile } from '@/features/project-socials/data/hooks'
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
  const deleteFile = useDeleteFile()
  const isUpdate = !!currentRow
  const { lang, tForm, general, tContract } = useLang()
  const t = tForm[lang]
  const t_general = general[lang].columns

  const [pendingDeleteFile, setPendingDeleteFile] = useState<string | null>(
    null
  )
  const formSchema = useMemo(
    () =>
      z.object({
        contract_number: z
          .string({
            error: t.form_validations.contract_number,
          })
          .min(1, t.form_validations.enter_contract_number)
          .max(100, t.form_validations.contract_number_limit),
        name: z
          .string({
            error: t.form_validations.name,
          })
          .min(1, t.form_validations.enter_a_name)
          .max(150, t.form_validations.invalid_name),
        description: z
          .string({
            error: t.form_validations.description,
          })
          .max(150, t.form_validations.invalid_description)
          .optional(),
        price: z
          .number({
            error: t.form_validations.required_field,
          })
          .min(0, t.form_validations.invalid_value),
        payment_type: z.enum(['card', 'bank_transfer', 'cash', 'deposit'], {
          error: t.form_validations.required_field,
        }),
        our_company_id: z.string({
          error: t.form_validations.required_field,
        }),
        customer_company_id: z.string({
          error: t.form_validations.required_field,
        }),
        file: z.string({
          error: t.form_validations.file,
        }),
        is_active: z.boolean().optional(),
        is_qqs: z.boolean().optional(),
      }),
    [t]
  )

  type ProjectForm = z.infer<typeof formSchema>

  const form = useForm<ProjectForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      price: toNumber(currentRow?.price) ?? undefined,
      description: currentRow?.description ?? '',
    },
  })

  const handlePendingDelete = (filePath: string | null) => {
    setPendingDeleteFile(filePath)
  }

  const onSubmit = async (values: ProjectForm) => {
    // If updating and there's a pending file deletion, delete it first
    if (isUpdate && pendingDeleteFile) {
      try {
        await deleteFile.mutateAsync(pendingDeleteFile)
        setPendingDeleteFile(null)
      } catch (_error) {
        toast.error(t.toast.unable_delete_previous)
        // Handle error if needed
        // console.error('Failed to delete old file:', error)
      }
    }

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
            setPendingDeleteFile(null)
          },
        }
      )
    } else {
      createContract.mutate(values, {
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

  const handleSheetChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      // Reset everything when closing
      form.reset()
      setPendingDeleteFile(null)
    }
  }

  const switchFields = [
    {
      name: 'is_active',
      label: t.form_labels.is_active,
    },
    {
      name: 'is_qqs',
      label: t.form_labels.is_vat,
    },
  ] as const

  return (
    <Sheet open={open} onOpenChange={handleSheetChange}>
      <SheetContent className='flex max-w-full flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate
              ? tContract[lang].update_contract
              : tContract[lang].create_contract}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? tContract[lang].update_desc
              : tContract[lang].create_desc}
            {tContract[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='contract-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-3'>
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
                label={t.form_labels.contract_number}
                placeholder={t.form_placeholders.enter_number}
              />

              <FormFieldWrapper
                control={form.control}
                name='name'
                label={t.form_labels.name}
                placeholder={t.form_placeholders.enter_name}
              />

              <FormFieldWrapper
                control={form.control}
                name='description'
                label={t.form_labels.description}
                placeholder={t.form_placeholders.enter_description}
              />

              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-2'>
                <FormFieldWrapper
                  control={form.control}
                  name='price'
                  label={t.form_labels.price}
                  placeholder={t.form_placeholders.enter_price}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />
                <FormComboboxCompany
                  control={form.control}
                  name='our_company_id'
                  label={t.form_labels.our_company}
                  detail={currentRow?.our_company}
                  filterOurCompany={true}
                />
                <FormFieldSelect
                  control={form.control}
                  name='payment_type'
                  label={t.form_labels.payment_type}
                  placeholder={t.form_placeholders.select_payment_type}
                  options={getPaymentTypeOptions(t_general)}
                />
                <FormComboboxCompany
                  control={form.control}
                  name='customer_company_id'
                  label={t.form_labels.customer_company}
                  detail={currentRow?.customer_company}
                  filterOurCompany={false}
                />
              </div>

              <FormFileUploadField
                control={form.control}
                name='file'
                label={t.form_labels.file}
                maxSize={5}
                isUpdateMode={isUpdate}
                onPendingDelete={handlePendingDelete}
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
              {t.buttons.delete}
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
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
