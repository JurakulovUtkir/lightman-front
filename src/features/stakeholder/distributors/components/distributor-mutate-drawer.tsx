import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Route } from '@/routes/_authenticated/stakeholder/distributors/$id'
import { toast } from 'sonner'
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
import { DistributorDialogType } from '../context'
import {
  useCreateDistributor,
  useUpdateDistributor,
  useDistributors,
} from '../data/hooks'
import { DistributorSchema } from '../data/schema'
import { FormComboboxFounders } from './form-combobox-founders'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: DistributorSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<DistributorSchema | null>>
  setOpen?: (str: DistributorDialogType | null) => void
}

export function DistributorMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createDistributor = useCreateDistributor()
  const updateDistributor = useUpdateDistributor()
  const isUpdate = !!currentRow
  const { id } = Route.useLoaderData()
  const { lang, tForm, tDistributor, interpolate } = useLang()
  const t = tForm[lang]

  // Fetch existing distributors to calculate remaining percentage
  const { data: distributorsData } = useDistributors(id)

  // Calculate the sum of existing percentages and get used founder IDs
  const { usedPercentage, usedFounderIds } = useMemo(() => {
    if (!distributorsData?.data) {
      return { usedPercentage: 0, usedFounderIds: [] }
    }

    const activeDistributors = distributorsData.data.filter((dist) => {
      // Exclude current row when updating
      if (isUpdate && currentRow) {
        return dist.id !== currentRow.id
      }
      return true
    })

    const totalPercentage = activeDistributors.reduce(
      (sum, dist) => sum + (dist.percentage || 0),
      0
    )

    const founderIds = activeDistributors.map((dist) => dist.founder_id)

    return {
      usedPercentage: totalPercentage,
      usedFounderIds: founderIds,
    }
  }, [distributorsData, isUpdate, currentRow])

  const remainingPercentage = 100 - usedPercentage

  const formSchema = useMemo(
    () =>
      z.object({
        founder_id: z
          .string({
            error: t.form_validations.founder,
          })
          .refine(
            (value) => {
              // Skip validation when updating and founder hasn't changed
              if (isUpdate && currentRow?.founder_id === value) {
                return true
              }
              // Check if founder is already used
              return !usedFounderIds.includes(value)
            },
            {
              error: t.form_validations.founder_assigned,
            }
          ),
        percentage: z
          .number({
            error: t.form_validations.percentage,
          })
          .min(0.01, t.form_validations.invalid_percentage)
          .refine(
            (value) => {
              // Check if the new percentage would exceed 100%
              return value <= remainingPercentage
            },
            {
              error: interpolate(t.form_validations.percentage_exceed, {
                remainingPercentage,
              }),
            }
          ),
        description: z.string().optional(),
        is_active: z.boolean().optional(),
      }),
    [t]
  )

  type DistributorForm = z.infer<typeof formSchema>

  const form = useForm<DistributorForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      is_active: currentRow?.is_active ?? true,
    },
  })

  const onSubmit = (data: DistributorForm) => {
    if (!id) {
      toast.warning(t.toast.unable_find_distribution)
      return
    }

    // Additional validation before submission
    const finalPercentage = usedPercentage + data.percentage
    if (finalPercentage > 100) {
      toast.error(interpolate(t.toast.total_percentage, { finalPercentage }))
      return
    }

    if (isUpdate) {
      updateDistributor.mutate(
        {
          id: currentRow.id,
          data: {
            ...data,
            distribution_id: id,
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createDistributor.mutate(
        {
          ...data,
          distribution_id: id,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
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
              ? tDistributor[lang].update_distributor
              : tDistributor[lang].create_distributor}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? tDistributor[lang].update_desc
              : tDistributor[lang].create_desc}
            {tDistributor[lang].click_save}
          </SheetDescription>
          {!isUpdate && remainingPercentage < 100 && (
            <div className='rounded-md bg-blue-50 p-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300'>
              {interpolate(t.form_labels.available_remaining, {
                remainingPercentage,
              })}
            </div>
          )}
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='distributor-form'
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
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>{t.form_labels.is_active}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormComboboxFounders
                control={form.control}
                name='founder_id'
                label={t.form_labels.founder}
                detail={currentRow?.founder}
                excludeFounderIds={usedFounderIds}
              />
              <FormFieldWrapper
                control={form.control}
                name='percentage'
                label={t.form_labels.percentage}
                placeholder={t.form_placeholders.enter_percentage}
                type='number'
                suffix='%'
              />
              <FormFieldWrapper
                control={form.control}
                name='description'
                label={t.form_labels.description}
                placeholder={t.form_placeholders.add_your_notes}
                type='textarea'
              />
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
              isUpdate
                ? updateDistributor.isPending
                : createDistributor.isPending
            }
            form='distributor-form'
            type='submit'
          >
            {(
              isUpdate
                ? updateDistributor.isPending
                : createDistributor.isPending
            )
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
