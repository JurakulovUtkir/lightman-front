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
import { ProjectSchema } from '@/features/projects/data/schema'
import { useProjectSocials } from '../data/hooks'
import { GroupedRow } from './grouped-columns'

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
  projectData: ProjectSchema
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
    projectData,
    ...actions
  } = props

  const { lang, general, tForm } = useLang()
  const t = general[lang].layout
  const t_form = tForm[lang]

  const { data } = useProjectSocials({
    projectId: projectData.id,
  })

  // Group data by social network type, then by social_id
  const groupedData = useMemo(() => {
    if (!data?.data?.length) return {}

    const groups: Record<
      string,
      {
        name: string
        groupedBySocial: GroupedRow[]
      }
    > = {}

    data.data.forEach((item) => {
      const networkTypeId = item.social.social_network_type.id
      const networkTypeName = item.social.social_network_type.name
      const socialId = item.social.id

      if (!groups[networkTypeId]) {
        groups[networkTypeId] = {
          name: networkTypeName,
          groupedBySocial: [],
        }
      }

      // Find existing group for this social_id
      const existingGroup = groups[networkTypeId].groupedBySocial.find(
        (g) => g.socialId === socialId
      )

      if (existingGroup) {
        existingGroup.items.push(item)
        existingGroup.count += 1
        existingGroup.totalBuyPrice += item.buy_price || 0
        existingGroup.totalSellPrice += item.sell_price || 0

        // Update payment status - if any unpaid, mark as Unpaid
        if (!item.is_paid) {
          existingGroup.paymentStatus = 'Unpaid'
        }
      } else {
        groups[networkTypeId].groupedBySocial.push({
          socialId: socialId,
          socialName: item.social.name,
          socialLink: item.social.link,
          subscriberCount: item.social.subscriber_count || 0,
          count: 1,
          totalBuyPrice: item.buy_price || 0,
          totalSellPrice: item.sell_price || 0,
          paymentStatus: item.is_paid ? 'Paid' : 'Unpaid',
          items: [item],
        })
      }
    })

    return groups
  }, [data])

  // Combine all grouped data for "All" tab
  const allGroupedData = useMemo(() => {
    return Object.values(groupedData).flatMap(
      ({ groupedBySocial }) => groupedBySocial
    )
  }, [groupedData])

  const totalSellPrice = useMemo(() => {
    return allGroupedData.reduce((sum, item) => sum + item.totalSellPrice, 0)
  }, [allGroupedData])

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
      distribution_id: projectData.distribution_id ?? undefined,
      price: totalSellPrice ?? 0,
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
              detail={projectData?.distribution ?? undefined}
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
