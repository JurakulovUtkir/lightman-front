import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  getPropertyCategoryOptions,
  getPropertyStatusOptions,
} from '@/constants'
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
import { FormFieldSelect } from '@/components/form-field-select'
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { FormComboboxCompany } from '@/features/projects/components/form-combobox-company'
import { PropertyDialogType } from '../context'
import { useCreateProperty, useUpdateProperty } from '../data/hooks'
import { PropertySchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: PropertySchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<PropertySchema | null>>
  setOpen?: (str: PropertyDialogType | null) => void
}

export function PropertyMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const isUpdate = !!currentRow

  const { lang, tForm, tProperty, general } = useLang()
  const t = tForm[lang]
  const t_general = general[lang].columns

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
        count: z
          .number({
            error: t.form_validations.required_field,
          })
          .min(0, t.form_validations.invalid_value),
        price: z
          .number({
            error: t.form_validations.required_field,
          })
          .min(0, t.form_validations.invalid_value),
        current_price: z
          .number({
            error: t.form_validations.required_field,
          })
          .min(0, t.form_validations.invalid_value),
        company_id: z
          .string({
            error: t.form_validations.required_field,
          })
          .min(1),
        status: z
          .enum([
            'IN_USE',
            'IN_STOCK',
            'REPAIRED',
            'WRITTEN_OFF',
            'SOLD',
            'LOST',
          ])
          .optional(),
        category: z
          .enum([
            'BUILDING',
            'VEHICLE',
            'EQUIPMENT',
            'FURNITURE',
            'ELECTRONICS',
            'OTHER',
          ])
          .optional(),
        is_active: z.boolean().optional(),
      }),
    [t]
  )

  type PropertyForm = z.infer<typeof formSchema>

  const form = useForm<PropertyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      count: toNumber(currentRow?.count),
      price: toNumber(currentRow?.price),
      current_price: toNumber(currentRow?.current_price),
      status: currentRow?.status ?? undefined,
      category: currentRow?.category ?? undefined,
      is_active: currentRow?.is_active ?? true,
    },
  })

  const onSubmit = (values: PropertyForm) => {
    if (isUpdate) {
      updateProperty.mutate(
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
      createProperty.mutate(values, {
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
      <SheetContent className='flex max-w-full flex-col sm:max-w-md'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate
              ? tProperty[lang].update_property
              : tProperty[lang].create_property}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? tProperty[lang].update_desc
              : tProperty[lang].create_desc}
            {tProperty[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='property-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-2'>
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
              </div>
              <FormFieldWrapper
                control={form.control}
                name='name'
                label={t.form_labels.property_name}
                placeholder={t.form_placeholders.enter_name}
              />

              <FormComboboxCompany
                control={form.control}
                name='company_id'
                label={t.form_labels.company}
                filterOurCompany={true}
                setValue={form.setValue}
                detail={currentRow?.company ?? undefined}
              />
              <FormFieldSelect
                control={form.control}
                name='status'
                label={t.form_labels.status}
                placeholder={t.form_placeholders.select_status}
                options={getPropertyStatusOptions(t_general)}
              />
              <FormFieldSelect
                control={form.control}
                name='category'
                label={t.form_labels.category}
                placeholder={t.form_placeholders.select_category}
                options={getPropertyCategoryOptions(t_general)}
              />
              <FormFieldWrapper
                control={form.control}
                name='count'
                label={t.form_labels.count}
                placeholder={t.form_placeholders.enter_count}
                type='number'
                suffix={t.form_placeholders.uzs}
              />
              <FormFieldWrapper
                control={form.control}
                name='price'
                label={t.form_labels.price}
                placeholder={t.form_placeholders.enter_price}
                type='number'
                suffix={t.form_placeholders.uzs}
              />
              <FormFieldWrapper
                control={form.control}
                name='current_price'
                label={t.form_labels.current_price}
                placeholder={t.form_placeholders.enter_current_price}
                type='number'
                suffix={t.form_placeholders.uzs}
              />

              <FormFieldWrapper
                control={form.control}
                name='description'
                label={t.form_labels.description}
                placeholder={t.form_placeholders.enter_description}
                type='textarea'
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
              isUpdate ? updateProperty.isPending : createProperty.isPending
            }
            form='property-form'
            type='submit'
          >
            {(isUpdate ? updateProperty.isPending : createProperty.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
