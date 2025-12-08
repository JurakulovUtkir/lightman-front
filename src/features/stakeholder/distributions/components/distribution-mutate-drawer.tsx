import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { DistributionDialogType } from '../context'
import { useCreateDistribution, useUpdateDistribution } from '../data/hooks'
import { DistributionSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: DistributionSchema
  setCurrentRow?: React.Dispatch<
    React.SetStateAction<DistributionSchema | null>
  >
  setOpen?: (str: DistributionDialogType | null) => void
}

export function DistributionMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createDistribution = useCreateDistribution()
  const updateDistribution = useUpdateDistribution()
  const isUpdate = !!currentRow
  const { lang, tForm, tDistribution } = useLang()
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
        description: z.string().optional(),
        is_active: z.boolean().optional(),
      }),
    [t]
  )

  type DistributionForm = z.infer<typeof formSchema>

  const form = useForm<DistributionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow || {
      name: '',
      description: '',
      is_active: true,
    },
  })

  const onSubmit = (values: DistributionForm) => {
    if (isUpdate) {
      updateDistribution.mutate(
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
      createDistribution.mutate(values, {
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
              ? tDistribution[lang].update_distribution
              : tDistribution[lang].create_distribution}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? tDistribution[lang].update_desc
              : tDistribution[lang].create_desc}
            {tDistribution[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='distribution-form'
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
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>{t.form_labels.distribution}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t.form_placeholders.enter_name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.form_labels.description}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.form_placeholders.enter_description}
                        className='h-40 resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                ? updateDistribution.isPending
                : createDistribution.isPending
            }
            form='distribution-form'
            type='submit'
          >
            {(
              isUpdate
                ? updateDistribution.isPending
                : createDistribution.isPending
            )
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
