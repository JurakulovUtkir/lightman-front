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
import { FounderDialogType } from '../context'
import { useCreateFounder, useUpdateFounder } from '../data/hooks'
import { FounderSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: FounderSchema
  setCurrentRow?: React.Dispatch<React.SetStateAction<FounderSchema | null>>
  setOpen?: (str: FounderDialogType | null) => void
}

export function FounderMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createFounder = useCreateFounder()
  const updateFounder = useUpdateFounder()
  const isUpdate = !!currentRow

  const formSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    is_active: z.boolean().optional(),
    balance: z.number().min(0, 'Invalid value').optional(),
  })

  type FounderForm = z.infer<typeof formSchema>

  const form = useForm<FounderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          name: currentRow.name,
          is_active: currentRow.is_active,
          balance: toNumber(currentRow.balance),
        }
      : {
          name: '',
          is_active: true,
          balance: undefined,
        },
  })

  const onSubmit = (values: FounderForm) => {
    if (isUpdate) {
      updateFounder.mutate(
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
      createFounder.mutate(values, {
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Founder</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Founder by providing necessary info.'
              : 'Add a new Founder by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='founder-form'
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
              <FormFieldWrapper
                control={form.control}
                name='name'
                label='Founder'
                placeholder='Enter a name'
              />

              {isUpdate && (
                <FormFieldWrapper
                  control={form.control}
                  name='balance'
                  label='Balance'
                  placeholder='Enter a price'
                  type='number'
                  suffix='UZS'
                />
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
              isUpdate ? updateFounder.isPending : createFounder.isPending
            }
            form='founder-form'
            type='submit'
          >
            {(isUpdate ? updateFounder.isPending : createFounder.isPending)
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
