import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toNumber } from '@/lib/helpers'
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
import { NetworkCategorySchema } from '../../categories/data/schema'
import { NetworkTypeSchema } from '../../types/data/schema'
import { useCreateNetworkSocial, useUpdateNetworkSocial } from '../data/hooks'
import { NetworkSocialSchema } from '../data/schema'
import { FormComboboxNetwrokCategory } from './form-combobox-network-category'
import { FormComboboxNetworkTags } from './form-combobox-network-tags'
import { FormComboboxNetworkTypes } from './form-combobox-network-types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: NetworkSocialSchema
}

export function NetworkSocialMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const createNetworkSocial = useCreateNetworkSocial()
  const updateNetworkSocial = useUpdateNetworkSocial()
  const isUpdate = !!currentRow
  const formSchema = z.object({
    name: z
      .string({
        error: 'Name is required.',
      })
      .min(1),
    link: z
      .url({
        error: 'Link is required.',
      })
      .min(1),
    social_network_type_id: z.string({
      error: 'Social network type is required.',
    }),

    category_id: z.string().optional(),
    tags: z.array(z.string()).optional(),

    subscriber_count: z.number().min(0, 'Invalid value').optional(),
    average_view_count: z.number().min(0, 'Invalid value').optional(),
    buy_price: z.number().min(0, 'Invalid value').optional(),
    standard_sell_price: z.number().min(0, 'Invalid value').optional(),
    vip_sell_price: z.number().min(0, 'Invalid value').optional(),
    no_watermark_sell_price: z.number().min(0, 'Invalid value').optional(),
    balance: z.number().min(0, 'Invalid value').optional(),
    contact_info: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
  })

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
      tags: currentRow?.tags || [],
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
            {isUpdate ? 'Update' : 'Create'} Network social
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Network social by providing necessary info.'
              : 'Add a new Network social by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='network-social-form'
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
                      <FormLabel className='text-sm'>Is Active</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormFieldWrapper
                control={form.control}
                name='name'
                label='Name'
                placeholder='Enter a name'
              />
              <FormComboboxNetworkTypes
                control={form.control}
                name='social_network_type_id'
                label='Network type'
                detail={
                  currentRow?.social_network_type as
                    | NetworkTypeSchema
                    | undefined
                }
              />
              <FormComboboxNetwrokCategory
                control={form.control}
                name='category_id'
                label='Network category'
                detail={
                  currentRow?.category as NetworkCategorySchema | undefined
                }
              />
              <FormComboboxNetworkTags
                control={form.control}
                name='tags'
                label='Tags'
              />
              <FormFieldWrapper
                control={form.control}
                name='link'
                label='Link'
                placeholder='Enter a link'
              />
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormFieldWrapper
                  control={form.control}
                  name='subscriber_count'
                  label='Subscriber Count'
                  placeholder='Enter a count'
                  type='number'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='average_view_count'
                  label='Average View Count'
                  placeholder='Enter a count'
                  type='number'
                />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormFieldWrapper
                  control={form.control}
                  name='buy_price'
                  label='Buy Price'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='standard_sell_price'
                  label='Standard Sell Price'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='vip_sell_price'
                  label='VIP Sell Price'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='no_watermark_sell_price'
                  label='No Watermark Sell Price'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='balance'
                  label='Balance'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
              </div>
              <FormFieldWrapper
                control={form.control}
                name='contact_info'
                label='Contact Info'
                placeholder='Add your notes'
                type='textarea'
              />
            </form>
          </Form>
        </div>
        <SheetFooter className='gap-2'>
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
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
