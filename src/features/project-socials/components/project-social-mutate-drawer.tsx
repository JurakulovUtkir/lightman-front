import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Route } from '@/routes/_authenticated/projects/socials/$id'
import { toast } from 'sonner'
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
import { FormComboboxNetworkTypes } from '@/features/network/socials/components/form-combobox-network-types'
import { NetworkTypeSchema } from '@/features/network/types/data/schema'
import { useProject } from '@/features/projects/data/hooks'
import { ProjectSocialDialogType } from '../context'
import { useCreateProjectSocial, useUpdateProjectSocial } from '../data/hooks'
import { ProjectSocialSchema } from '../data/schema'
import { FormComboboxNetworkSocial } from './form-combobox-network-social'
import { FormFileUploadField } from './form-file-upload'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ProjectSocialSchema
  setCurrentRow?: React.Dispatch<
    React.SetStateAction<ProjectSocialSchema | null>
  >
  setOpen?: (str: ProjectSocialDialogType | null) => void
}

export function ProjectSocialMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const { id } = Route.useLoaderData()
  const { data: project } = useProject(id)

  const createProjectSocial = useCreateProjectSocial()
  const updateProjectSocial = useUpdateProjectSocial()
  const isUpdate = !!currentRow
  const { lang, tForm, tProject } = useLang()
  const t = tForm[lang]

  const formSchema = useMemo(
    () =>
      z.object({
        network_type_id: z.string({
          error: t.form_validations.required_field,
        }),
        social_id: z
          .string({
            error: t.form_validations.required_field,
          })
          .min(1, t.form_validations.required_field),
        buy_price: z.number().optional(),
        sell_price: z.number().optional(),
        post_link: z
          .url({
            message: t.form_validations.enter_valid_url,
          })
          .or(z.literal(''))
          .optional()
          .nullable(),
        post_views: z.number().optional().nullable(),
        payment: z.string().nullable().optional(),
        post_screenshot: z.string().nullable().optional(),

        post_count: z.number().optional(),
      }),
    [t]
  )

  type ProjectSocialForm = z.infer<typeof formSchema>

  const form = useForm<ProjectSocialForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      network_type_id: currentRow?.social?.social_network_type_id,
    },
  })

  const selectedNetworkTypeId = form.watch('network_type_id')

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'network_type_id' && value.social_id) {
        form.setValue('social_id', '')
        form.setValue('buy_price', undefined)
        form.setValue('sell_price', undefined)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = (data: ProjectSocialForm) => {
    if (!id) {
      toast.warning(t.toast.missing_project)
      return
    }

    const { network_type_id, ...apiData } = data

    if (isUpdate) {
      updateProjectSocial.mutate(
        {
          id: currentRow.id,
          data: {
            ...apiData,
            project_id: id,
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
      createProjectSocial.mutate(
        {
          ...apiData,
          project_id: id,
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
              ? tProject[lang].update_project_social
              : tProject[lang].create_project_social}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? tProject[lang].update_desc_social
              : tProject[lang].create_desc_social}
            {tProject[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='project-social-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <FormComboboxNetworkTypes
                name='network_type_id'
                label={t.form_labels.network_type}
                control={form.control}
                detail={
                  currentRow?.social.social_network_type as
                    | NetworkTypeSchema
                    | undefined
                }
              />
              <FormComboboxNetworkSocial
                name='social_id'
                label={t.form_labels.social_network}
                control={form.control}
                detail={currentRow?.social ?? undefined}
                socialNetworkTypeId={selectedNetworkTypeId}
                disabled={!selectedNetworkTypeId}
                setValue={form.setValue}
                priceType={
                  project?.price_type as
                    | 'standard'
                    | 'vip'
                    | 'no_watermark'
                    | undefined
                }
              />
              {!isUpdate && (
                <FormFieldWrapper
                  control={form.control}
                  name='post_count'
                  label={t.form_labels.post_count}
                  placeholder={t.form_placeholders.enter_count}
                  type='number'
                />
              )}
              <FormFieldWrapper
                control={form.control}
                name='buy_price'
                label={t.form_labels.buy_price}
                placeholder={t.form_placeholders.enter_price}
                type='number'
                suffix='UZS'
              />
              <FormFieldWrapper
                control={form.control}
                name='sell_price'
                label={t.form_labels.sell_price}
                placeholder={t.form_placeholders.enter_price}
                type='number'
                suffix='UZS'
              />
              {isUpdate && (
                <>
                  <FormFieldWrapper
                    control={form.control}
                    name='post_link'
                    label={t.form_labels.post_link}
                    placeholder={t.form_placeholders.enter_link}
                  />
                  <FormFieldWrapper
                    control={form.control}
                    name='post_views'
                    label={t.form_labels.post_views}
                    placeholder={t.form_placeholders.enter_views}
                    type='number'
                  />

                  <FormFileUploadField
                    control={form.control}
                    name='payment'
                    label={t.form_labels.payment_document}
                    maxSize={10}
                  />

                  <FormFileUploadField
                    control={form.control}
                    name='post_screenshot'
                    label={t.form_labels.post_screenshot}
                    maxSize={5}
                  />
                </>
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
              isUpdate
                ? updateProjectSocial.isPending
                : createProjectSocial.isPending
            }
            form='project-social-form'
            type='submit'
          >
            {(
              isUpdate
                ? updateProjectSocial.isPending
                : createProjectSocial.isPending
            )
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
