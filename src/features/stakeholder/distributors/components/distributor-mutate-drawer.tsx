import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Route } from '@/routes/_authenticated/stakeholder/distributors/$id'
import { toast } from 'sonner'
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
import { DistributorDialogType } from '../context'
import { useCreateDistributor, useUpdateDistributor } from '../data/hooks'
import { DistributorSchema } from '../data/schema'
import { FormComboboxFounders } from './form-combobox-founders'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: DistributorSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<DistributorSchema | null>>
  setOpen?: (str: DistributorDialogType | null) => void
}

export function DistributorMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createDistributor = useCreateDistributor()
  const updateDistributor = useUpdateDistributor()
  const isUpdate = !!currentRow
  const { id } = Route.useLoaderData()

  const formSchema = z.object({
    founder_id: z.string({
      message: 'Founder is required',
    }),
    percentage: z
      .number({
        message: 'Percentage is required',
      })
      .min(0, 'Enter valid value'),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
  })

  type DistributorForm = z.infer<typeof formSchema>

  const form = useForm<DistributorForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentRow,
      is_active: true,
    },
  })

  const onSubmit = (data: DistributorForm) => {
    if (!id) {
      toast.warning('Unable to find Distribution ID')
      return
    }
    if (isUpdate) {
      updateDistributor.mutate(
        {
          id: currentRow.id,
          data: {
            ...data,
            distribution_id: id,
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
      createDistributor.mutate(
        {
          ...data,
          distribution_id: id,
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Distributor</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Distributor by providing necessary info.'
              : 'Add a new Distributor by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='distributor-form'
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
                      <FormLabel>Is Active</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormComboboxFounders
                control={form.control}
                name='founder_id'
                label='Founder'
                // detail={currentRow ?? undefined}
              />
              <FormFieldWrapper
                control={form.control}
                name='percentage'
                label='Percentage'
                placeholder='Enter percentage'
                type='number'
                suffix='%'
              />
              <FormFieldWrapper
                control={form.control}
                name='description'
                label='Description'
                placeholder='Add your notes'
                type='textarea'
              />
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
                ? updateDistributor.isPending
                : createDistributor.isPending
            }
            form='distributor-form'
            type='submit'
          >
            {(
              isUpdate
                ? updateDistributor.isPending
                : createDistributor.isPending
            )
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
