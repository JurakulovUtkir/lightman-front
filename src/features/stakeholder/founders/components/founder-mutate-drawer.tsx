import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { FounderDialogType } from '../context'
import { useCreateFounder, useUpdateFounder } from '../data/hooks'
import { FounderSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: FounderSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<FounderSchema | null>>
  setOpen?: (str: FounderDialogType | null) => void
}

export function FounderMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createFounder = useCreateFounder()
  const updateFounder = useUpdateFounder()
  const isUpdate = !!currentRow
  const { lang, tForm, tFounder } = useLang()
  const t = tForm[lang]

  const formSchema = useMemo(
    () =>
      z.object({
        name: z
          .string({
            error: t.form_validations.name,
          })
          .min(1, t.form_validations.enter_name)
          .max(150, t.form_validations.invalid_name),
        is_active: z.boolean().optional(),
        balance: z.number().min(0, t.form_validations.invalid_value).optional(),
      }),
    [t]
  )

  type FounderForm = z.infer<typeof formSchema>

  const form = useForm<FounderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          name: currentRow.name,
          is_active: currentRow.is_active,
          balance: toNumber(currentRow.balance),
        }
      : {
          name: '',
          is_active: true,
          balance: undefined,
        },
  })

  const onSubmit = (values: FounderForm) => {
    if (isUpdate) {
      updateFounder.mutate(
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
      createFounder.mutate(values, {
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
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate
              ? tFounder[lang].update_founder
              : tFounder[lang].create_founder}
          </SheetTitle>
          <SheetDescription>
            {isUpdate ? tFounder[lang].update_desc : tFounder[lang].create_desc}
            {tFounder[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='founder-form'
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
                      <FormLabel>{t.form_labels.is_active}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormFieldWrapper
                control={form.control}
                name='name'
                label={t.form_labels.founder}
                placeholder={t.form_placeholders.enter_name}
              />

              {isUpdate && (
                <FormFieldWrapper
                  control={form.control}
                  name='balance'
                  label={t.form_labels.balance}
                  placeholder={t.form_placeholders.enter_amount}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />
              )}
            </form>
          </Form>
        </div>
        <SheetFooter className='gap-2'>
          {isUpdate && (
            <Button onClick={handleDelete} size='sm' variant='destructive'>
              {t.buttons.delete}
            </Button>
          )}
          <Button
            disabled={
              isUpdate ? updateFounder.isPending : createFounder.isPending
            }
            form='founder-form'
            type='submit'
          >
            {(isUpdate ? updateFounder.isPending : createFounder.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
