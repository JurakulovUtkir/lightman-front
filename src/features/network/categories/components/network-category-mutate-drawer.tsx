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
import { NetworkTypesDialogType } from '../../types/context'
import {
  useCreateNetworkCategory,
  useUpdateNetworkCategory,
} from '../data/hooks'
import { NetworkCategorySchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: NetworkCategorySchema
  setCurrentRow?: React.Dispatch<
    React.SetStateAction<NetworkCategorySchema | null>
  >
  setOpen?: (str: NetworkTypesDialogType | null) => void
}

export function NetworkCategoryMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createNetworkCategory = useCreateNetworkCategory()
  const updateNetworkCategory = useUpdateNetworkCategory()
  const isUpdate = !!currentRow
  const { lang, tForm, tNetwork } = useLang()
  const t = tForm[lang]

  const formSchema = useMemo(
    () =>
      z.object({
        name: z
          .string({ error: t.form_validations.name })
          .min(1, t.form_validations.name),
        is_active: z.boolean().optional(),
      }),
    [t]
  )

  type NetworkCategoryForm = z.infer<typeof formSchema>

  const form = useForm<NetworkCategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow,
  })

  const onSubmit = (values: NetworkCategoryForm) => {
    if (isUpdate) {
      updateNetworkCategory.mutate(
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
      createNetworkCategory.mutate(values, {
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
              ? tNetwork[lang].update_network_category
              : tNetwork[lang].create_network_category}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? tNetwork[lang].update_category_desc
              : tNetwork[lang].create_category_desc}
            {tNetwork[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='network-category-form'
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
                    <FormLabel>{t.form_labels.network_category}</FormLabel>
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
                ? updateNetworkCategory.isPending
                : createNetworkCategory.isPending
            }
            form='network-category-form'
            type='submit'
          >
            {(
              isUpdate
                ? updateNetworkCategory.isPending
                : createNetworkCategory.isPending
            )
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
