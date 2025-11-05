import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Route } from '@/routes/_authenticated/projects/socials/$id'
import { toast } from 'sonner'
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
  const createProjectSocial = useCreateProjectSocial()
  const updateProjectSocial = useUpdateProjectSocial()
  const isUpdate = !!currentRow

  const formSchema = z.object({
    social_id: z
      .string({
        error: 'Required field',
      })
      .optional(),

    buy_price: z.number().optional(),
    sell_price: z.number().optional(),
    post_link: z
      .url({
        message: 'Enter valid url',
      })
      .or(z.literal(''))
      .optional()
      .nullable(),
    post_views: z.number().optional().nullable(),
    payment: z.string().nullable().optional(),
    post_screenshot: z.string().nullable().optional(),
  })
  type ProjectSocialForm = z.infer<typeof formSchema>

  const form = useForm<ProjectSocialForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow,
  })

  const onSubmit = (data: ProjectSocialForm) => {
    if (!id) {
      toast.warning('Unable to find Project ID')
      return
    }

    if (isUpdate) {
      updateProjectSocial.mutate(
        {
          id: currentRow.id,
          data: {
            ...data,
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
          ...data,
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
            {isUpdate ? 'Update' : 'Create'} Project Social
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Project Social by providing necessary info.'
              : 'Add a new Project Social by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='project-social-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex-1 space-y-5 px-4'
            >
              <FormComboboxNetworkSocial
                name='social_id'
                label='Social Network'
                control={form.control}
                // detail={currentRow?.social_network}
              />

              <FormFieldWrapper
                control={form.control}
                name='buy_price'
                label='Buy price'
                placeholder='Enter a price'
                type='number'
                suffix='UZS'
              />
              <FormFieldWrapper
                control={form.control}
                name='sell_price'
                label='Sell price'
                placeholder='Enter a price'
                type='number'
                suffix='UZS'
              />
              {isUpdate && (
                <>
                  <FormFieldWrapper
                    control={form.control}
                    name='post_link'
                    label='Post link'
                    placeholder='Enter a link'
                  />
                  <FormFieldWrapper
                    control={form.control}
                    name='post_views'
                    label='Post views'
                    placeholder='Enter a count'
                    type='number'
                  />
                  <FormFileUploadField
                    control={form.control}
                    name='payment'
                    label='Payment Document'
                    fileType='document'
                    maxSize={10}
                  />

                  <FormFileUploadField
                    control={form.control}
                    name='post_screenshot'
                    label='Post Screenshot'
                    fileType='image'
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
              Delete
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
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
