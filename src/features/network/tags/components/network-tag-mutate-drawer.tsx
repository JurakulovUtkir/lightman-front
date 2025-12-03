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
import { NetworkTagDialogType } from '../context'
import { useCreateNetworkTag, useUpdateNetworkTag } from '../data/hooks'
import { NetworkTagSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: NetworkTagSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<NetworkTagSchema | null>>
  setOpen?: (str: NetworkTagDialogType | null) => void
}

export function NetworkTagMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createNetworkTag = useCreateNetworkTag()
  const updateNetworkTag = useUpdateNetworkTag()
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
  type NetworkTagForm = z.infer<typeof formSchema>

  const form = useForm<NetworkTagForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow || {
      name: '',
      is_active: true,
    },
  })

  const onSubmit = (values: NetworkTagForm) => {
    if (isUpdate) {
      updateNetworkTag.mutate(
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
      createNetworkTag.mutate(values, {
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
              ? tNetwork[lang].update_network_tag
              : tNetwork[lang].create_network_tag}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? tNetwork[lang].update_tag_desc
              : tNetwork[lang].create_tag_desc}
            {tNetwork[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='network-tag-form'
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
                    <FormLabel>{t.form_labels.network_tag}</FormLabel>
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
              isUpdate ? updateNetworkTag.isPending : createNetworkTag.isPending
            }
            form='network-tag-form'
            type='submit'
          >
            {(
              isUpdate ? updateNetworkTag.isPending : createNetworkTag.isPending
            )
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
