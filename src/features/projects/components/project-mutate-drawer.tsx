import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { FormComboboxNetwrokCategory } from '@/features/network/socials/components/form-combobox-network-category'
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

  const formSchema = z.object({
    name: z
      .string({
        error: 'Name is required.',
      })
      .min(1, 'Please enter your name.')
      .max(150, 'Name cannot exceed 150 characters.'),
    description: z
      .string({
        error: 'Description is required.',
      })
      .min(1)
      .max(150, 'Description cannot exceed 150 characters.')
      .optional(),
    contract_id: z.string().optional().nullable(),
    price: z
      .number({
        error: 'Required field',
      })
      .min(0, 'Invalid value'),
    price_with_qqs: z
      .number({
        error: 'Required field',
      })
      .min(0, 'Invalid value'),
    distribution_id: z.string().optional(),
    price_type: z.enum(['standard', 'vip', 'no_watermark']).optional(),
    category_id: z.string().optional(),
    customer_company_id: z.string({
      error: 'Required field',
    }),
    our_company_id: z.string({
      error: 'Required field',
    }),
    payment_type: z.enum(['cash', 'card', 'bank_transfer']).optional(),
    is_active: z.boolean().optional(),
    is_qqs: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    clone_project_id: z.string().optional().nullable(),
  })

  type ProjectForm = z.infer<typeof formSchema>

  const toNumber = (value: string | number | undefined): number | undefined => {
    if (value === undefined || value === null) return undefined
    return typeof value === 'string' ? parseFloat(value) : value
  }

  // Define empty default values
  const emptyFormValues: Partial<ProjectForm> = {
    name: '',
    description: '',
    contract_id: undefined,
    price: 0,
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

  const switchFields = [
    {
      name: 'is_active',
      label: 'Is active',
    },
    {
      name: 'is_qqs',
      label: 'Is QQS',
    },
  ] as const

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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Project</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Project by providing necessary info.'
              : 'Add a new Project by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='project-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              {!isUpdate && (
                <FormComboboxProject
                  control={form.control}
                  name='clone_project_id'
                  label='Clone project'
                  detail={undefined}
                />
              )}

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {switchFields.map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name}
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
                            {item.label}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormFieldWrapper
                control={form.control}
                name='name'
                label='Name'
                placeholder='Enter a name'
              />

              <FormFieldWrapper
                control={form.control}
                name='description'
                label='Description'
                placeholder='Enter a description'
              />
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormComboboxContract
                  control={form.control}
                  name='contract_id'
                  label='Contract'
                  detail={currentRow?.contract ?? undefined}
                />

                <FormDistribution
                  control={form.control}
                  name='distribution_id'
                  label='Distribution'
                  placeholder='Select a distribution'
                  detail={currentRow?.distribution ?? undefined}
                />

                <div className='flex flex-col gap-4 sm:col-span-2'>
                  <FormComboboxNetwrokCategory
                    control={form.control}
                    name='category_id'
                    label='Category'
                    detail={currentRow?.category ?? undefined}
                  />
                  <FormComboboxNetworkTags
                    control={form.control}
                    name='tags'
                    label='Tags'
                  />
                </div>
                <FormComboboxCompany
                  control={form.control}
                  name='our_company_id'
                  label='Our company'
                  detail={currentRow?.our_company}
                  filterOurCompany={true}
                  setValue={form.setValue}
                  shouldUpdateIsQqs={true}
                />
                <FormComboboxCompany
                  control={form.control}
                  name='customer_company_id'
                  label='Customer company'
                  detail={currentRow?.customer_company}
                  filterOurCompany={false}
                />

                <FormFieldSelect
                  control={form.control}
                  name='price_type'
                  label='Price type'
                  placeholder='Select a price type'
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'no_watermark', label: 'No watermark' },
                    { value: 'vip', label: 'Vip' },
                  ]}
                />

                <FormFieldSelect
                  control={form.control}
                  name='payment_type'
                  label='Payment type'
                  placeholder='Select a payment type'
                  options={[
                    { value: 'cash', label: 'Cash' },
                    { value: 'card', label: 'Card' },
                    { value: 'bank_transfer', label: 'Bank Transfer' },
                  ]}
                />

                <FormFieldWrapper
                  control={form.control}
                  name='price'
                  label='Price'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
                <FormFieldWrapper
                  control={form.control}
                  name='price_with_qqs'
                  label='Price with QQS'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
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
              Delete
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
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
