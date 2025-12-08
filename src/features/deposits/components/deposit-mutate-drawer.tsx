import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toNumber } from '@/lib/helpers'
import { useLang } from '@/hooks/useLang'
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
  const { lang, tForm, tDeposit } = useLang()
  const t = tForm[lang]

  const formSchema = useMemo(
    () =>
      z.object({
        name: z
          .string({
            error: t.form_validations.name,
          })
          .min(1, t.form_validations.enter_a_name)
          .max(150, t.form_validations.invalid_name),

        balance: z
          .number({
            error: t.form_validations.required_field,
          })
          .min(0, t.form_validations.invalid_value),
      }),
    [t]
  )

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
          <SheetTitle>
            {isUpdate
              ? tDeposit[lang].update_deposit
              : tDeposit[lang].create_deposit}
          </SheetTitle>
          <SheetDescription>
            {isUpdate ? tDeposit[lang].update_desc : tDeposit[lang].create_desc}
            {tDeposit[lang].click_save}
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
                label={t.form_labels.name}
                placeholder={t.form_placeholders.enter_name}
              />

              <FormFieldWrapper
                control={form.control}
                name='balance'
                label={t.form_labels.balance}
                placeholder={t.form_placeholders.enter_balance}
                type='number'
                suffix={t.form_placeholders.uzs}
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
              isUpdate ? updateDeposit.isPending : createDeposit.isPending
            }
            form='deposit-form'
            type='submit'
          >
            {(isUpdate ? updateDeposit.isPending : createDeposit.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
