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
import { NetworkCategorySchema } from '../../categories/data/schema'
import { NetworkTypeSchema } from '../../types/data/schema'
import { NetworkSocialDialogType } from '../context'
import { useCreateNetworkSocial, useUpdateNetworkSocial } from '../data/hooks'
import { NetworkSocialSchema } from '../data/schema'
import { FormComboboxNetworkCategory } from './form-combobox-network-category'
import { FormComboboxNetworkTags } from './form-combobox-network-tags'
import { FormComboboxNetworkTypes } from './form-combobox-network-types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: NetworkSocialSchema
  setCurrentRow?: React.Dispatch<
    React.SetStateAction<NetworkSocialSchema | null>
  >
  setOpen?: (str: NetworkSocialDialogType | null) => void
}

export function NetworkSocialMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createNetworkSocial = useCreateNetworkSocial()
  const updateNetworkSocial = useUpdateNetworkSocial()
  const isUpdate = !!currentRow

  const { lang, tForm, tNetwork } = useLang()
  const t = tForm[lang]

  const formSchema = useMemo(
    () =>
      z.object({
        name: z
          .string({ error: t.form_validations.name })
          .min(1, t.form_validations.name),
        link: z
          .url({
            error: t.form_validations.link,
          })
          .min(1),
        social_network_type_id: z.string({
          error: t.form_validations.social_network_type,
        }),

        category_id: z.string().optional(),
        tags: z.array(z.string()).optional(),

        subscriber_count: z
          .number()
          .min(0, t.form_validations.invalid_value)
          .optional(),
        average_view_count: z
          .number()
          .min(0, t.form_validations.invalid_value)
          .optional(),
        buy_price: z
          .number()
          .min(0, t.form_validations.invalid_value)
          .optional(),
        standard_sell_price: z
          .number()
          .min(0, t.form_validations.invalid_value)
          .optional(),
        vip_sell_price: z
          .number()
          .min(0, t.form_validations.invalid_value)
          .optional(),
        no_watermark_sell_price: z
          .number()
          .min(0, t.form_validations.invalid_value)
          .optional(),
        no_watermark_buy_price: z
          .number()
          .min(0, t.form_validations.invalid_value)
          .optional(),
        balance: z.number().min(0, t.form_validations.invalid_value).optional(),
        contact_info: z.string().optional().nullable(),
        // is_active: z.boolean().optional(),
      }),
    [t]
  )

  type NetworkSocialForm = z.infer<typeof formSchema>

  const form = useForm<NetworkSocialForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      balance: toNumber(currentRow?.balance),
      buy_price: toNumber(currentRow?.buy_price),
      standard_sell_price: toNumber(currentRow?.standard_sell_price),
      vip_sell_price: toNumber(currentRow?.vip_sell_price),
      no_watermark_sell_price: toNumber(currentRow?.no_watermark_sell_price),
      no_watermark_buy_price: toNumber(currentRow?.no_watermark_buy_price),
      tags: currentRow?.tags || [],
      category_id: currentRow?.category_id ?? undefined,
    },
  })

  const onSubmit = (values: NetworkSocialForm) => {
    if (isUpdate) {
      updateNetworkSocial.mutate(
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
      createNetworkSocial.mutate(values, {
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
      <SheetContent className='flex max-w-full flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate
              ? tNetwork[lang].update_network_social
              : tNetwork[lang].create_network_social}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? tNetwork[lang].update_social_desc
              : tNetwork[lang].create_social_desc}
            {tNetwork[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='network-social-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              {/* <FormField
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
              /> */}
              <FormFieldWrapper
                control={form.control}
                name='name'
                label='Name'
                placeholder={t.form_placeholders.enter_name}
              />
              <FormComboboxNetworkTypes
                control={form.control}
                name='social_network_type_id'
                label={t.form_labels.network_type}
                enableCreate
                detail={
                  currentRow?.social_network_type as
                    | NetworkTypeSchema
                    | undefined
                }
              />
              <FormComboboxNetworkCategory
                control={form.control}
                name='category_id'
                label={t.form_labels.network_category}
                enableCreate
                detail={
                  currentRow?.category as NetworkCategorySchema | undefined
                }
              />
              <FormComboboxNetworkTags
                control={form.control}
                name='tags'
                label={t.form_labels.tags}
                enableCreate
              />
              <FormFieldWrapper
                control={form.control}
                name='link'
                label={t.form_labels.link}
                placeholder={t.form_placeholders.enter_link}
              />
              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-2'>
                <FormFieldWrapper
                  control={form.control}
                  name='subscriber_count'
                  label={t.form_labels.subscriber_count}
                  placeholder={t.form_placeholders.enter_count}
                  type='number'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='average_view_count'
                  label={t.form_labels.average_views_count}
                  placeholder={t.form_placeholders.enter_count}
                  type='number'
                />
              </div>
              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-2'>
                <FormFieldWrapper
                  control={form.control}
                  name='buy_price'
                  label={t.form_labels.buy_price}
                  placeholder={t.form_placeholders.enter_price}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />
                <FormFieldWrapper
                  control={form.control}
                  name='standard_sell_price'
                  label={t.form_labels.standard_sell_price}
                  placeholder={t.form_placeholders.enter_price}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />
                <FormFieldWrapper
                  control={form.control}
                  name='no_watermark_buy_price'
                  label={t.form_labels.no_watermark_buy_price}
                  placeholder={t.form_placeholders.enter_price}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />
                <FormFieldWrapper
                  control={form.control}
                  name='no_watermark_sell_price'
                  label={t.form_labels.no_watermark_sell_price}
                  placeholder={t.form_placeholders.enter_price}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />

                <FormFieldWrapper
                  control={form.control}
                  name='vip_sell_price'
                  label={t.form_labels.vip_sell_price}
                  placeholder={t.form_placeholders.enter_price}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />
                <FormFieldWrapper
                  control={form.control}
                  name='balance'
                  label={t.form_labels.balance}
                  placeholder={t.form_placeholders.enter_balance}
                  type='number'
                  suffix={t.form_placeholders.uzs}
                />
              </div>
              <FormFieldWrapper
                control={form.control}
                name='contact_info'
                label={t.form_labels.contact_info}
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
                ? updateNetworkSocial.isPending
                : createNetworkSocial.isPending
            }
            form='network-social-form'
            type='submit'
            className='w-full sm:w-auto'
          >
            {(
              isUpdate
                ? updateNetworkSocial.isPending
                : createNetworkSocial.isPending
            )
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
