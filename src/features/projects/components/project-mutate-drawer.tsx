import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { FormComboboxContract } from '@/features/contracts/components/form-combobox-contracts'
import { FormComboboxNetworkCategory } from '@/features/network/socials/components/form-combobox-network-category'
import { FormComboboxNetworkTags } from '@/features/network/socials/components/form-combobox-network-tags'
import { ProjectDialogType } from '../context'
import { useCreateProject, useUpdateProject, useProjects } from '../data/hooks'
import { ProjectSchema } from '../data/schema'
import { FormComboboxCompany } from './form-combobox-company'
import { FormComboboxProject } from './form-combobox-projects'
import { FormDistribution } from './form-distribution'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ProjectSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<ProjectSchema | null>>
  setOpen?: (str: ProjectDialogType | null) => void
}

export function ProjectMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const isUpdate = !!currentRow
  const { lang, tForm, tProject, general } = useLang()
  const t = tForm[lang]
  const t_general = general[lang]

  const formSchema = useMemo(
    () =>
      z.object({
        name: z
          .string({
            error: t.form_validations.name,
          })
          .min(1, t.form_validations.enter_name)
          .max(150, t.form_validations.invalid_name),
        description: z
          .string({
            error: t.form_validations.description,
          })
          .max(150, t.form_validations.invalid_description)
          .optional(),
        contract_id: z.string().optional().nullable(),
        price: z
          .number({
            error: t.form_validations.required_field,
          })
          .min(0, t.form_validations.invalid_value),
        price_with_qqs: z
          .number({
            error: t.form_validations.required_field,
          })
          .min(0, t.form_validations.invalid_value),
        planned_views_count: z
          .number()
          .min(0, t.form_validations.invalid_value)
          .optional(),
        distribution_id: z.string().optional(),
        price_type: z.enum(['standard', 'vip', 'no_watermark']).optional(),
        category_id: z.string().optional(),
        customer_company_id: z.string({
          error: t.form_validations.required_field,
        }),
        our_company_id: z.string({
          error: t.form_validations.required_field,
        }),
        payment_type: z
          .enum(['cash', 'card', 'bank_transfer', 'deposit'])
          .optional(),
        is_active: z.boolean().optional(),
        is_qqs: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        clone_project_id: z.string().optional().nullable(),
      }),
    [t]
  )

  type ProjectForm = z.infer<typeof formSchema>

  // Define empty default values
  const emptyFormValues: Partial<ProjectForm> = {
    name: '',
    description: '',
    contract_id: undefined,
    price: 0,
    planned_views_count: 0,
    price_with_qqs: 0,
    distribution_id: undefined,
    price_type: undefined,
    category_id: undefined,
    customer_company_id: undefined,
    our_company_id: undefined,
    payment_type: undefined,
    is_active: true,
    is_qqs: false,
    clone_project_id: undefined,
    tags: undefined,
  }

  const form = useForm<ProjectForm>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyFormValues,
  })

  // Watch for clone_project_id changes
  const cloneProjectId = form.watch('clone_project_id')

  // Fetch projects to get the selected project data
  const { data: projectsData } = useProjects({
    offset: 0,
    limit: 100,
  })

  // Handle cloning project data
  useEffect(() => {
    if (!isUpdate && cloneProjectId && projectsData?.data?.items) {
      const selectedProject = projectsData.data.items.find(
        (project) => project.id === cloneProjectId
      )

      if (selectedProject) {
        form.reset({
          clone_project_id: cloneProjectId,
          name: selectedProject.name,
          description: selectedProject.description,
          contract_id: selectedProject.contract_id,
          price: toNumber(selectedProject.price) ?? 0,
          price_with_qqs: toNumber(selectedProject.price_with_qqs) ?? 0,
          planned_views_count:
            toNumber(selectedProject.planned_views_count) ?? 0,
          distribution_id: selectedProject.distribution_id,
          price_type: selectedProject.price_type,
          category_id: selectedProject.category_id,
          customer_company_id: selectedProject.customer_company_id,
          our_company_id: selectedProject.our_company_id,
          payment_type: selectedProject.payment_type,
          is_active: selectedProject.is_active,
          is_qqs: selectedProject.is_qqs,
          tags: selectedProject?.tags || [],
        })
      }
    }
  }, [cloneProjectId, projectsData, isUpdate, form])

  // Handle editing project data
  useEffect(() => {
    if (isUpdate && currentRow && open) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description,
        contract_id: currentRow.contract_id ?? undefined,
        price: toNumber(currentRow.price) ?? 0,
        price_with_qqs: toNumber(currentRow.price_with_qqs) ?? 0,
        planned_views_count: toNumber(currentRow.planned_views_count) ?? 0,
        distribution_id: currentRow.distribution_id,
        price_type: currentRow.price_type,
        category_id: currentRow.category_id,
        customer_company_id: currentRow.customer_company_id,
        our_company_id: currentRow.our_company_id,
        payment_type: currentRow.payment_type,
        is_active: currentRow.is_active,
        is_qqs: currentRow.is_qqs,
        clone_project_id: undefined,
        tags: currentRow?.tags || [],
      })
    } else if (!isUpdate && open) {
      // Reset to empty values when creating new project
      form.reset(emptyFormValues)
    }
  }, [isUpdate, currentRow, open, form])

  const onSubmit = (values: ProjectForm) => {
    if (isUpdate) {
      updateProject.mutate(
        {
          id: currentRow.id,
          data: values,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset(emptyFormValues)
          },
        }
      )
    } else {
      createProject.mutate(values, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset(emptyFormValues)
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
        if (!v) {
          // Reset to empty values when closing
          form.reset(emptyFormValues)
        }
      }}
    >
      <SheetContent className='flex max-w-full flex-col sm:max-w-[540px]'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate
              ? tProject[lang].update_project
              : tProject[lang].create_project}
          </SheetTitle>
          <SheetDescription>
            {isUpdate ? tProject[lang].update_desc : tProject[lang].create_desc}
            {tProject[lang].click_save}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='project-form'
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
                      <FormLabel className='text-sm'>
                        {t.form_labels.is_active}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {!isUpdate && (
                <FormComboboxProject
                  control={form.control}
                  name='clone_project_id'
                  label={t.form_labels.clone_project}
                  detail={undefined}
                />
              )}

              <FormFieldWrapper
                control={form.control}
                name='name'
                label={t.form_labels.name}
                placeholder={t.form_placeholders.enter_name}
              />

              <FormFieldWrapper
                control={form.control}
                name='description'
                label={t.form_labels.description}
                placeholder={t.form_placeholders.enter_description}
              />
              <div className='grid grid-cols-1 items-baseline gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-4 sm:col-span-2'>
                  <FormComboboxNetworkTags
                    control={form.control}
                    name='tags'
                    label={t.form_labels.tags}
                    enableCreate
                  />
                </div>
                <FormDistribution
                  control={form.control}
                  name='distribution_id'
                  label={t.form_labels.distribution}
                  placeholder={t.form_placeholders.select_distribution}
                  detail={currentRow?.distribution ?? undefined}
                />

                <FormComboboxContract
                  control={form.control}
                  name='contract_id'
                  label={t.form_labels.contract}
                  detail={currentRow?.contract ?? undefined}
                />

                <FormComboboxNetworkCategory
                  control={form.control}
                  name='category_id'
                  label={t.form_labels.category}
                  detail={currentRow?.category ?? undefined}
                />

                <FormComboboxCompany
                  control={form.control}
                  name='our_company_id'
                  label={t.form_labels.our_company}
                  detail={currentRow?.our_company}
                  filterOurCompany={true}
                  setValue={form.setValue}
                  shouldUpdateIsQqs={true}
                />
                <FormComboboxCompany
                  control={form.control}
                  name='customer_company_id'
                  label={t.form_labels.customer_company}
                  detail={currentRow?.customer_company}
                  filterOurCompany={false}
                />

                <FormFieldSelect
                  control={form.control}
                  name='price_type'
                  label={t.form_labels.price_type}
                  placeholder={t.form_placeholders.select_price_type}
                  options={[
                    {
                      value: 'standard',
                      label: t_general.columns.priceTypeOptions.standard,
                    },
                    {
                      value: 'no_watermark',
                      label: t_general.columns.priceTypeOptions.no_watermark,
                    },
                    {
                      value: 'vip',
                      label: t_general.columns.priceTypeOptions.vip,
                    },
                  ]}
                />

                <FormFieldSelect
                  control={form.control}
                  name='payment_type'
                  label={t.form_labels.payment_type}
                  placeholder={t.form_placeholders.select_payment_type}
                  options={[
                    {
                      value: 'cash',
                      label: t_general.columns.paymentTypeOptions.cash,
                    },
                    {
                      value: 'card',
                      label: t_general.columns.paymentTypeOptions.card,
                    },
                    {
                      value: 'bank_transfer',
                      label: t_general.columns.paymentTypeOptions.bank_transfer,
                    },
                  ]}
                />
                <FormFieldWrapper
                  control={form.control}
                  name='planned_views_count'
                  label={t.form_labels.planned_views_count}
                  placeholder={t.form_placeholders.enter_count}
                  type='number'
                />
                {isUpdate && (
                  <>
                    <FormFieldWrapper
                      control={form.control}
                      name='price'
                      label={t.form_labels.price}
                      placeholder={t.form_placeholders.enter_price}
                      type='number'
                      suffix='UZS'
                    />
                    <FormFieldWrapper
                      control={form.control}
                      name='price_with_qqs'
                      label={t.form_labels.price_with_vat}
                      placeholder={t.form_placeholders.enter_price}
                      type='number'
                      suffix='UZS'
                    />
                  </>
                )}
              </div>
            </form>
          </Form>
        </div>
        <SheetFooter>
          {isUpdate && (
            <Button
              onClick={handleDelete}
              size='sm'
              variant='destructive'
              className='w-full sm:w-auto'
            >
              {t.buttons.delete}
            </Button>
          )}
          <Button
            disabled={
              isUpdate ? updateProject.isPending : createProject.isPending
            }
            form='project-form'
            type='submit'
            className='w-full sm:w-auto'
          >
            {(isUpdate ? updateProject.isPending : createProject.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
