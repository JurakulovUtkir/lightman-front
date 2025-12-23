import { useMemo } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { FormComboboxDistributions } from '@/features/companies/components/form-combobox-distributions'

interface ApproveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  disabled?: boolean
  desc: React.JSX.Element | string
  cancelBtnText?: string
  confirmText?: React.ReactNode
  destructive?: boolean
  handleApproveConfirm: (payload: {
    distribution_id: string
    price: number
  }) => void
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

export function ApproveDialog(props: ApproveDialogProps) {
  const {
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    handleApproveConfirm,
    ...actions
  } = props

  const { lang, general, tForm } = useLang()
  const t = general[lang].layout
  const t_form = tForm[lang]

  const formSchema = useMemo(
    () =>
      z.object({
        distribution_id: z
          .string({
            error: t_form.form_validations.required_field,
          })
          .min(1, t_form.form_validations.required_field),
        price: z
          .number({
            error: t_form.form_validations.required_field,
          })
          .min(0, t_form.form_validations.invalid_value)
          .optional(),
      }),
    [t]
  )
  type StatusForm = z.infer<typeof formSchema>
  const form = useForm<StatusForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 0,
    },
  })

  const onSubmit = (values: StatusForm) => {
    handleApproveConfirm({
      distribution_id: values.distribution_id,
      price: values.price ?? 0,
    })
  }

  return (
    <AlertDialog {...actions}>
      <AlertDialogContent className={cn(className && className)}>
        <AlertDialogHeader className='text-left'>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>{desc}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            id='status-form-approve'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 px-4'
          >
            <FormComboboxDistributions
              control={form.control}
              name='distribution_id'
              label={t_form.form_labels.distribution}
            />

            <FormFieldWrapper
              control={form.control}
              name='price'
              label={t_form.form_labels.price}
              placeholder={t_form.form_placeholders.enter_price}
              type='number'
              suffix={t_form.form_placeholders.uzs}
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelBtnText ?? t.cancel}
          </AlertDialogCancel>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            disabled={disabled || isLoading}
            type='submit'
            form='status-form-approve'
          >
            {confirmText ?? t.continue}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
