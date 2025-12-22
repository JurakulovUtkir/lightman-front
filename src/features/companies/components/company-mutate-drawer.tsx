import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation } from '@tanstack/react-router'
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
  const { pathname } = useLocation()

  const { lang, tForm, tCompany } = useLang()
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
        address: z
          .string({
            error: t.form_validations.address,
          })
          .min(1)
          .max(150, t.form_validations.invalid_address),
        stir: z.string().regex(/^\d{9}$/, t.form_validations.invalid_stir),
        mfo: z.string().regex(/^\d{5}$/, t.form_validations.invalid_mfo),
        pinfl: z.string().regex(/^\d{14}$/, t.form_validations.invalid_pnfl),
        bank: z
          .string({
            error: t.form_validations.bank,
          })
          .min(1)
          .max(150, t.form_validations.invalid_bank),
        account_number: z
          .string()
          .regex(/^\d{20}$/, t.form_validations.invalid_account_number),
        balance: z.number().min(0, t.form_validations.invalid_value).optional(),
        is_active: z.boolean().optional(),
        is_our_company: z.boolean().optional(),
        is_vip: z.boolean().optional(),
        is_qqs: z.boolean().optional(),
      }),
    [t]
  )

  type CompanyForm = z.infer<typeof formSchema>

  const form = useForm<CompanyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      balance: toNumber(currentRow?.balance),
      stir: currentRow?.stir?.toString() || '',
      mfo: currentRow?.mfo?.toString() || '',
      pinfl: currentRow?.pinfl?.toString() || '',
      account_number: currentRow?.account_number?.toString() || '',
      is_our_company: pathname.includes('counterparty') ? false : true,
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
      label: t.form_labels.is_active,
    },
    {
      name: 'is_our_company',
      label: t.form_labels.is_our_company,
    },
    {
      name: 'is_vip',
      label: t.form_labels.is_vip,
    },
    {
      name: 'is_qqs',
      label: t.form_labels.is_vat,
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
      <SheetContent className='flex max-w-full flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate
              ? tCompany[lang].update_company
              : tCompany[lang].create_company}
          </SheetTitle>
          <SheetDescription>
            {isUpdate ? tCompany[lang].update_desc : tCompany[lang].create_desc}
            {tCompany[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='company-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-2'>
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
                name='name'
                label={t.form_labels.company_name}
                placeholder={t.form_placeholders.enter_name}
              />

              <FormFieldWrapper
                control={form.control}
                name='address'
                label={t.form_labels.address}
                placeholder={t.form_placeholders.enter_address}
              />
              <FormFieldWrapper
                control={form.control}
                name='bank'
                label={t.form_labels.bank_name}
                placeholder={t.form_placeholders.enter_bank_name}
              />

              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-2'>
                <FormFieldWrapper
                  control={form.control}
                  name='stir'
                  label={t.form_labels.stir_number}
                  placeholder={t.form_placeholders.enter_number}
                  type='text'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='mfo'
                  label={t.form_labels.mfo_number}
                  placeholder={t.form_placeholders.enter_number}
                  type='text'
                />
              </div>
              <FormFieldWrapper
                control={form.control}
                name='pinfl'
                label={t.form_labels.pinfl}
                placeholder={t.form_placeholders.pinfl}
                type='text'
              />
              <FormFieldWrapper
                control={form.control}
                name='account_number'
                label={t.form_labels.account_number}
                placeholder={t.form_placeholders.enter_number}
                type='text'
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
              isUpdate ? updateCompany.isPending : createCompany.isPending
            }
            form='company-form'
            type='submit'
          >
            {(isUpdate ? updateCompany.isPending : createCompany.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
