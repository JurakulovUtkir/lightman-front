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
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { NetworkTypesDialogType } from '../../types/context'
import {
  useCreateNetworkCategory,
  useUpdateNetworkCategory,
} from '../data/hooks'
import { NetworkCategorySchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: NetworkCategorySchema
  setCurrentRow?: React.Dispatch<
    React.SetStateAction<NetworkCategorySchema | null>
  >
  setOpen?: (str: NetworkTypesDialogType | null) => void
}

export function NetworkCategoryMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  setCurrentRow,
  setOpen,
}: Props) {
  const createNetworkCategory = useCreateNetworkCategory()
  const updateNetworkCategory = useUpdateNetworkCategory()
  const isUpdate = !!currentRow

  const formSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    is_active: z.boolean().optional(),
  })

  type NetworkCategoryForm = z.infer<typeof formSchema>

  const form = useForm<NetworkCategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow,
  })

  const onSubmit = (values: NetworkCategoryForm) => {
    if (isUpdate) {
      updateNetworkCategory.mutate(
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
      createNetworkCategory.mutate(values, {
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
            {isUpdate ? 'Update' : 'Create'} Network category
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the Network category by providing necessary info.'
              : 'Add a new Network category by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='network-category-form'
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
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Network Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter a name' />
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
              Delete
            </Button>
          )}
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            disabled={
              isUpdate
                ? updateNetworkCategory.isPending
                : createNetworkCategory.isPending
            }
            form='network-category-form'
            type='submit'
          >
            {(
              isUpdate
                ? updateNetworkCategory.isPending
                : createNetworkCategory.isPending
            )
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
